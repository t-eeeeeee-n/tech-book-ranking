#!/usr/bin/env ts-node

import { program } from 'commander'
import dotenv from 'dotenv'
import cronService from '@/services/cronService'
import { getBatchStats, getRecentBatchLogs } from '@/utils/batchLogger'

// Load environment variables
dotenv.config()

class CronRunner {
    async runDaemon(): Promise<void> {
        console.log('🕒 Starting Cron Daemon...')
        
        try {
            await cronService.start()
            
            // Keep the process running
            console.log('✅ Cron daemon is now running. Press Ctrl+C to stop.')
            
            // Handle graceful shutdown
            process.on('SIGINT', async () => {
                console.log('\n🛑 Received SIGINT, shutting down gracefully...')
                await cronService.stop()
                process.exit(0)
            })

            process.on('SIGTERM', async () => {
                console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
                await cronService.stop()
                process.exit(0)
            })

            // Keep process alive
            await new Promise(() => {}) // This will run forever until interrupted
            
        } catch (error) {
            console.error('💥 Failed to start cron daemon:', error)
            process.exit(1)
        }
    }

    async runSingleJob(jobName: string): Promise<void> {
        console.log(`🔄 Running single job: ${jobName}`)
        
        try {
            await cronService.triggerJob(jobName)
            console.log(`✅ Job completed: ${jobName}`)
        } catch (error) {
            console.error(`❌ Job failed: ${jobName}`, error)
            process.exit(1)
        }
    }

    async showJobStatus(): Promise<void> {
        console.log('📊 Cron Job Status:')
        
        try {
            const status = cronService.getJobStatus()
            
            if (status.length === 0) {
                console.log('No jobs are currently scheduled.')
                return
            }

            console.table(status.map(job => ({
                Job: job.name,
                Running: job.running ? '✅' : '❌',
                'Next Run': job.nextRun ? job.nextRun.toISOString() : 'N/A'
            })))

        } catch (error) {
            console.error('❌ Failed to get job status:', error)
        }
    }

    async showBatchLogs(options: {
        type?: string
        limit?: number
        stats?: boolean
    } = {}): Promise<void> {
        const { type, limit = 20, stats = false } = options

        try {
            if (stats) {
                console.log('📈 Batch Statistics (Last 30 days):')
                
                const batchTypes = ['qiita_fetch', 'ranking_update', 'cache_update', 'book_enrichment']
                
                for (const batchType of batchTypes) {
                    const batchStats = await getBatchStats(batchType as any, 30)
                    console.log(`\n${batchType.toUpperCase()}:`)
                    console.log(`  Total batches: ${batchStats.totalBatches}`)
                    console.log(`  Successful: ${batchStats.successful}`)
                    console.log(`  Failed: ${batchStats.failed}`)
                    console.log(`  Success rate: ${batchStats.successRate}%`)
                    console.log(`  Avg duration: ${batchStats.avgDuration}s`)
                }
                return
            }

            console.log(`📋 Recent Batch Logs (${type || 'all types'}, last ${limit}):`)
            
            const logs = await getRecentBatchLogs(type as any, limit)
            
            if (logs.length === 0) {
                console.log('No batch logs found.')
                return
            }

            const tableData = logs.map(log => ({
                Type: log.batchType,
                Status: log.status === 'completed' ? '✅' : 
                       log.status === 'failed' ? '❌' : 
                       log.status === 'running' ? '🔄' : '⏸️',
                Started: log.startedAt.toISOString().replace('T', ' ').substring(0, 19),
                Duration: log.duration ? `${log.duration}s` : 'N/A',
                Processed: log.processedCount,
                Success: log.successCount,
                Errors: log.errorCount,
                Summary: log.summary?.substring(0, 50) + (log.summary && log.summary.length > 50 ? '...' : '')
            }))

            console.table(tableData)

        } catch (error) {
            console.error('❌ Failed to get batch logs:', error)
        }
    }

    async generateCrontab(): Promise<void> {
        console.log('📅 Suggested Crontab Entries:')
        console.log('# Add these to your crontab (crontab -e)')
        console.log('')
        
        const nodeCommand = process.execPath
        const scriptPath = __filename.replace('.ts', '.js') // Assume compiled JS
        const projectRoot = process.cwd()
        
        console.log('# Fetch Qiita articles hourly')
        console.log(`0 * * * * cd ${projectRoot} && NODE_ENV=production ${nodeCommand} dist/scripts/cronRunner.js run fetchQiita`)
        console.log('')
        
        console.log('# Generate rankings daily at 2 AM')
        console.log(`0 2 * * * cd ${projectRoot} && NODE_ENV=production ${nodeCommand} dist/scripts/cronRunner.js run generateRankings`)
        console.log('')
        
        console.log('# Cleanup logs weekly on Sunday at 3 AM')
        console.log(`0 3 * * 0 cd ${projectRoot} && NODE_ENV=production ${nodeCommand} dist/scripts/cronRunner.js run cleanupLogs`)
        console.log('')
        
        console.log('# Or run the daemon continuously (recommended)')
        console.log(`@reboot cd ${projectRoot} && NODE_ENV=production ${nodeCommand} dist/scripts/cronRunner.js daemon`)
        console.log('')
        
        console.log('💡 Tips:')
        console.log('- Make sure to build the project first: npm run build')
        console.log('- Set up proper environment variables in .env')
        console.log('- Consider using PM2 for process management in production')
        console.log('- Check logs with: npm run cron-runner logs')
    }
}

// CLI setup
program
    .name('cronRunner')
    .description('Run scheduled batch operations for TechBook Ranking')
    .version('1.0.0')

// Daemon mode - keeps running with scheduled jobs
program
    .command('daemon')
    .description('Run cron daemon with all scheduled jobs')
    .action(async () => {
        const runner = new CronRunner()
        await runner.runDaemon()
    })

// Run a single job
program
    .command('run <jobName>')
    .description('Run a single job manually')
    .action(async (jobName: string) => {
        if (!['fetchQiita', 'generateRankings', 'cleanupLogs', 'dailySummary'].includes(jobName)) {
            console.error('❌ Invalid job name. Valid options: fetchQiita, generateRankings, cleanupLogs, dailySummary')
            process.exit(1)
        }
        
        const runner = new CronRunner()
        await runner.runSingleJob(jobName)
    })

// Show job status
program
    .command('status')
    .description('Show status of all scheduled jobs')
    .action(async () => {
        const runner = new CronRunner()
        await runner.showJobStatus()
    })

// Show batch logs
program
    .command('logs')
    .description('Show recent batch operation logs')
    .option('-t, --type <type>', 'Filter by batch type (qiita_fetch, ranking_update, etc.)')
    .option('-l, --limit <limit>', 'Number of logs to show', '20')
    .option('-s, --stats', 'Show statistics instead of logs')
    .action(async (options) => {
        const runner = new CronRunner()
        await runner.showBatchLogs({
            type: options.type,
            limit: parseInt(options.limit),
            stats: options.stats
        })
    })

// Generate crontab entries
program
    .command('crontab')
    .description('Generate suggested crontab entries')
    .action(async () => {
        const runner = new CronRunner()
        await runner.generateCrontab()
    })

// Make the script executable
if (require.main === module) {
    program.parse()
}