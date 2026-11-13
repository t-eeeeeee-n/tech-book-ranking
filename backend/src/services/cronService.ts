import * as cron from 'node-cron'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { BatchLogger, getBatchStats } from '@/utils/batchLogger'
import rankingGenerationService from './rankingGenerationService'
import { cleanupOldBatchLogs } from '@/utils/batchLogger'
import { slackNotificationService } from './slackNotificationService'

// Import the existing QiitaFetcher from the script
import { QiitaFetcher } from '../../scripts/fetchQiita'

// Load environment variables
dotenv.config()

interface CronJobConfig {
    name: string
    schedule: string
    enabled: boolean
    description: string
    handler: () => Promise<void>
}

export class CronService {
    private jobs: Map<string, cron.ScheduledTask> = new Map()
    private runningJobs: Set<string> = new Set()
    private isRunning = false

    async start(): Promise<void> {
        if (this.isRunning) {
            console.log('⚠️ Cron service is already running')
            return
        }

        // Connect to database
        await this.connectToDatabase()

        const jobConfigs: CronJobConfig[] = [
            {
                name: 'fetchQiita',
                schedule: '0 * * * *', // Every hour at minute 0
                enabled: true,
                description: 'Fetch articles from Qiita API and match to books',
                handler: this.handleQiitaFetch.bind(this)
            },
            {
                name: 'generateRankings',
                schedule: '0 2 * * *', // Every day at 2:00 AM
                enabled: true,
                description: 'Generate daily book rankings',
                handler: this.handleRankingGeneration.bind(this)
            },
            {
                name: 'cleanupLogs',
                schedule: '0 3 * * 0', // Every Sunday at 3:00 AM
                enabled: true,
                description: 'Clean up old batch logs and expired rankings',
                handler: this.handleCleanup.bind(this)
            },
            {
                name: 'dailySummary',
                schedule: '0 8 * * *', // Every day at 8:00 AM
                enabled: process.env.ENABLE_SLACK_NOTIFICATIONS?.toLowerCase() !== 'false',
                description: 'Send daily summary to Slack',
                handler: this.handleDailySummary.bind(this)
            }
        ]

        // Schedule all jobs
        for (const config of jobConfigs) {
            if (config.enabled) {
                this.scheduleJob(config)
            }
        }

        this.isRunning = true
        console.log('🚀 Cron service started successfully')
        console.log(`📅 Scheduled ${this.jobs.size} jobs`)
    }

    async stop(): Promise<void> {
        if (!this.isRunning) {
            console.log('⚠️ Cron service is not running')
            return
        }

        // Stop all jobs
        for (const [name, task] of this.jobs) {
            task.stop()
            console.log(`⏹️ Stopped job: ${name}`)
        }

        this.jobs.clear()
        this.isRunning = false

        // Close database connection
        await mongoose.connection.close()
        console.log('🔌 Cron service stopped and database connection closed')
    }

    private scheduleJob(config: CronJobConfig): void {
        const task = cron.schedule(config.schedule, async () => {
            console.log(`\n⏰ Starting scheduled job: ${config.name}`)
            console.log(`📋 Description: ${config.description}`)
            console.log(`🕐 Scheduled: ${config.schedule}`)
            
            this.runningJobs.add(config.name)
            
            try {
                await config.handler()
                console.log(`✅ Completed scheduled job: ${config.name}`)
            } catch (error) {
                console.error(`❌ Failed scheduled job: ${config.name}`, error)
            } finally {
                this.runningJobs.delete(config.name)
            }
        }, {
            scheduled: false,
            timezone: process.env.CRON_TIMEZONE || 'UTC'
        })

        task.start()
        this.jobs.set(config.name, task)
        
        console.log(`📅 Scheduled job: ${config.name} (${config.schedule})`)
    }

    private async connectToDatabase(): Promise<void> {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techbook-ranking'
        console.log('📦 Connecting to MongoDB...')
        
        try {
            await mongoose.connect(mongoUri)
            console.log('✅ Connected to MongoDB')
        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error)
            throw error
        }
    }

    /**
     * Handle Qiita fetching job
     */
    private async handleQiitaFetch(): Promise<void> {
        const logger = new BatchLogger()
        
        try {
            await logger.start('qiita_fetch', {
                query: process.env.QIITA_DEFAULT_QUERY || 'created:>2024-01-01 stocks:>3',
                pages: 2,
                perPage: 20,
                minConfidence: 0.5,
                scheduledJob: true
            })

            const qiitaToken = process.env.QIITA_TOKEN
            if (!qiitaToken) {
                throw new Error('QIITA_TOKEN environment variable is not set')
            }

            const fetcher = new QiitaFetcher(qiitaToken)
            
            // Run Qiita fetching with moderate settings for scheduled job
            const options = {
                query: process.env.QIITA_DEFAULT_QUERY || 'created:>2024-01-01 stocks:>3',
                pages: 2,
                perPage: 20,
                minConfidence: 0.5
            }

            // Capture console output for logging
            const originalLog = console.log
            let output = ''
            console.log = (...args) => {
                output += args.join(' ') + '\n'
                originalLog(...args)
            }

            try {
                await fetcher.run(options)
                
                // Parse output to get statistics
                const articleMatch = output.match(/Articles processed: (\d+)/)
                const mentionMatch = output.match(/Total mentions found: (\d+)/)
                
                const processedCount = articleMatch ? parseInt(articleMatch[1]) : 0
                const mentionCount = mentionMatch ? parseInt(mentionMatch[1]) : 0
                
                logger.incrementProcessed(processedCount)
                logger.incrementSuccess(mentionCount)

                await logger.complete(
                    `Processed ${processedCount} articles, found ${mentionCount} book mentions`,
                    {
                        articlesProcessed: processedCount,
                        mentionsFound: mentionCount,
                        queryUsed: options.query,
                        pages: options.pages
                    }
                )
            } finally {
                console.log = originalLog
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            await logger.fail(errorMessage, {
                jobType: 'scheduled',
                error: errorMessage
            })
            throw error
        }
    }

    /**
     * Handle ranking generation job
     */
    private async handleRankingGeneration(): Promise<void> {
        const logger = new BatchLogger()
        
        try {
            await logger.start('ranking_update', {
                periods: ['all', 'year', 'month', 'week'],
                types: ['overall', 'category', 'trending', 'newcomer'],
                maxBooks: 1000,
                cacheHours: 24,
                scheduledJob: true
            })

            const result = await rankingGenerationService.generateAllRankings({
                periods: ['all', 'year', 'month', 'week'],
                types: ['overall', 'category', 'trending', 'newcomer'],
                maxBooks: 1000,
                cacheHours: 24
            })

            if (result.success) {
                logger.incrementProcessed(result.generatedRankings + result.updatedRankings)
                logger.incrementSuccess(result.generatedRankings + result.updatedRankings)

                await logger.complete(
                    result.summary,
                    result.metadata
                )
            } else {
                // Add errors to logger
                for (const error of result.errors) {
                    logger.addError(error)
                }

                await logger.fail(
                    `Ranking generation completed with errors: ${result.errors.length} errors`,
                    result.metadata
                )
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            await logger.fail(errorMessage, {
                jobType: 'scheduled',
                error: errorMessage
            })
            throw error
        }
    }

    /**
     * Handle cleanup job
     */
    private async handleCleanup(): Promise<void> {
        const logger = new BatchLogger()
        
        try {
            await logger.start('cache_update', {
                logRetentionDays: 90,
                scheduledJob: true
            })

            // Clean up old batch logs
            const deletedLogs = await cleanupOldBatchLogs(90)
            logger.incrementProcessed(deletedLogs)
            logger.incrementSuccess(deletedLogs)

            // Clean up expired rankings
            const cleanupResult = await rankingGenerationService.cleanupOldRankings()
            logger.incrementProcessed(cleanupResult.deletedCount)
            logger.incrementSuccess(cleanupResult.deletedCount)

            await logger.complete(
                `Cleaned up ${deletedLogs} old batch logs and ${cleanupResult.deletedCount} expired rankings`,
                {
                    deletedBatchLogs: deletedLogs,
                    deletedRankings: cleanupResult.deletedCount
                }
            )

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            await logger.fail(errorMessage, {
                jobType: 'scheduled',
                error: errorMessage
            })
            throw error
        }
    }

    /**
     * Handle daily summary notification
     */
    private async handleDailySummary(): Promise<void> {
        try {
            console.log('📊 Generating daily summary for Slack...')

            // Get stats for each job type from the last 24 hours
            const qiitaStats = await getBatchStats('qiita_fetch', 1)
            const rankingStats = await getBatchStats('ranking_update', 1)
            const cleanupStats = await getBatchStats('cache_update', 7) // Weekly for cleanup

            // Calculate overall stats
            const totalJobs = qiitaStats.totalBatches + rankingStats.totalBatches + cleanupStats.totalBatches
            const totalSuccessful = qiitaStats.successful + rankingStats.successful + cleanupStats.successful
            const overallSuccessRate = totalJobs > 0 ? (totalSuccessful / totalJobs) * 100 : 0

            // Get additional metrics (you could enhance this with real database queries)
            // const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
            const summaryStats = {
                totalJobs,
                successRate: Math.round(overallSuccessRate * 100) / 100,
                booksUpdated: 0, // Could be calculated from ranking stats
                articlesProcessed: 0, // Could be calculated from qiita stats
                qiitaFetches: qiitaStats.totalBatches,
                rankingUpdates: rankingStats.totalBatches,
                cleanupJobs: cleanupStats.totalBatches,
                avgDurationQiita: qiitaStats.avgDuration,
                avgDurationRanking: rankingStats.avgDuration
            }

            // Only send summary if there's meaningful activity
            if (totalJobs > 0) {
                await slackNotificationService.sendDailySummary(summaryStats)
                console.log('✅ Daily summary sent to Slack')
            } else {
                console.log('ℹ️ No job activity in the last 24 hours, skipping daily summary')
            }

        } catch (error: unknown) {
            console.error('❌ Failed to send daily summary:', error)

            // Send error alert instead
            try {
                const errorObj = error instanceof Error ? error : new Error('Unknown error occurred during daily summary')
                await slackNotificationService.sendErrorAlert('daily_summary', errorObj, {
                    task: 'Daily summary generation',
                    time: new Date().toISOString()
                })
            } catch (slackError) {
                console.error('❌ Failed to send error alert for daily summary:', slackError)
            }
        }
    }

    /**
     * Get status of all jobs
     */
    getJobStatus(): Array<{
        name: string
        running: boolean
        nextRun?: Date
    }> {
        const status: Array<{ name: string, running: boolean, nextRun?: Date }> = []

        for (const [name] of this.jobs) {
            status.push({
                name,
                running: this.runningJobs.has(name),
                // Note: node-cron doesn't expose next run time directly
            })
        }

        return status
    }

    /**
     * Manually trigger a specific job
     */
    async triggerJob(jobName: string): Promise<void> {
        console.log(`🔄 Manually triggering job: ${jobName}`)
        
        this.runningJobs.add(jobName)
        
        try {
            switch (jobName) {
                case 'fetchQiita':
                    await this.handleQiitaFetch()
                    break
                case 'generateRankings':
                    await this.handleRankingGeneration()
                    break
                case 'cleanupLogs':
                    await this.handleCleanup()
                    break
                case 'dailySummary':
                    await this.handleDailySummary()
                    break
                default:
                    throw new Error(`Unknown job: ${jobName}`)
            }
        } finally {
            this.runningJobs.delete(jobName)
        }
    }
}

export default new CronService()