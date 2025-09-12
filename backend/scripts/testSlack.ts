#!/usr/bin/env ts-node

import dotenv from 'dotenv'
import { program } from 'commander'
import { slackNotificationService } from '@/services/slackNotificationService'
import { BatchLog } from '@/models'
import database from '@/utils/database'

// Load environment variables
dotenv.config()

class SlackTester {
    async testConnection(): Promise<void> {
        console.log('🔍 Testing Slack connection...')
        
        const isConnected = await slackNotificationService.testConnection()
        
        if (isConnected) {
            console.log('✅ Slack connection successful!')
        } else {
            console.log('❌ Slack connection failed!')
            console.log('Check your SLACK_BOT_TOKEN and ENABLE_SLACK_NOTIFICATIONS environment variables')
        }
    }

    async sendTestMessage(): Promise<void> {
        console.log('📤 Sending test message...')
        
        try {
            await slackNotificationService.sendMessage({
                text: '🧪 Test Message from TechBook Ranking',
                blocks: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain_text',
                            text: '🧪 Slack Integration Test'
                        }
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'This is a test message to verify Slack integration is working correctly.'
                        }
                    },
                    {
                        type: 'section',
                        fields: [
                            {
                                type: 'mrkdwn',
                                text: '*Environment:*\nTest'
                            },
                            {
                                type: 'mrkdwn',
                                text: '*Time:*\n' + new Date().toISOString()
                            }
                        ]
                    }
                ]
            })
            
            console.log('✅ Test message sent successfully!')
        } catch (error) {
            console.error('❌ Failed to send test message:', error)
        }
    }

    async sendMockBatchNotification(jobType: string = 'test_job'): Promise<void> {
        console.log(`📋 Sending mock batch notification for ${jobType}...`)
        
        // Connect to database to create a mock batch log
        await database.connect({
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/techbook-ranking'
        })
        
        const mockBatchLog = new BatchLog({
            batchType: jobType as any,
            status: 'completed',
            startedAt: new Date(Date.now() - 300000), // 5 minutes ago
            completedAt: new Date(),
            duration: 300,
            processedCount: 150,
            successCount: 145,
            errorCount: 5,
            summary: `Mock ${jobType} completed successfully with 5 minor errors`,
            errors: [
                {
                    message: 'Connection timeout for external API',
                    context: { url: 'https://api.example.com', timeout: '5000ms' }
                },
                {
                    message: 'Invalid book ISBN format',
                    context: { isbn: '123-invalid-isbn' }
                }
            ]
        })
        
        try {
            await slackNotificationService.sendBatchJobNotification(mockBatchLog as any)
            console.log('✅ Mock batch notification sent successfully!')
        } catch (error) {
            console.error('❌ Failed to send mock batch notification:', error)
        }
    }

    async sendErrorAlert(): Promise<void> {
        console.log('🚨 Sending error alert...')
        
        try {
            const mockError = new Error('Database connection failed after 3 retries')
            await slackNotificationService.sendErrorAlert('qiita_fetch', mockError, {
                database: 'MongoDB',
                connectionString: 'mongodb://localhost:27017',
                retries: 3
            })
            
            console.log('✅ Error alert sent successfully!')
        } catch (error) {
            console.error('❌ Failed to send error alert:', error)
        }
    }

    async sendDailySummary(): Promise<void> {
        console.log('📊 Sending daily summary...')
        
        try {
            const mockStats = {
                totalJobs: 24,
                successRate: 95.8,
                booksUpdated: 1250,
                articlesProcessed: 3400
            }
            
            await slackNotificationService.sendDailySummary(mockStats)
            console.log('✅ Daily summary sent successfully!')
        } catch (error) {
            console.error('❌ Failed to send daily summary:', error)
        }
    }
}

// CLI setup
program
    .name('testSlack')
    .description('Test Slack notification integration for TechBook Ranking')
    .version('1.0.0')

// Test connection
program
    .command('connection')
    .description('Test Slack API connection')
    .action(async () => {
        const tester = new SlackTester()
        await tester.testConnection()
        process.exit(0)
    })

// Send test message
program
    .command('message')
    .description('Send a test message to Slack')
    .action(async () => {
        const tester = new SlackTester()
        await tester.sendTestMessage()
        process.exit(0)
    })

// Send mock batch notification
program
    .command('batch')
    .description('Send a mock batch job notification')
    .option('-t, --type <type>', 'Job type for mock notification', 'qiita_fetch')
    .action(async (options) => {
        const tester = new SlackTester()
        await tester.sendMockBatchNotification(options.type)
        process.exit(0)
    })

// Send error alert
program
    .command('error')
    .description('Send a mock error alert')
    .action(async () => {
        const tester = new SlackTester()
        await tester.sendErrorAlert()
        process.exit(0)
    })

// Send daily summary
program
    .command('summary')
    .description('Send a mock daily summary')
    .action(async () => {
        const tester = new SlackTester()
        await tester.sendDailySummary()
        process.exit(0)
    })

// Run all tests
program
    .command('all')
    .description('Run all Slack integration tests')
    .action(async () => {
        console.log('🚀 Running comprehensive Slack integration tests...\n')
        
        const tester = new SlackTester()
        
        await tester.testConnection()
        console.log()
        
        await tester.sendTestMessage()
        console.log()
        
        await tester.sendMockBatchNotification('qiita_fetch')
        console.log()
        
        await tester.sendErrorAlert()
        console.log()
        
        await tester.sendDailySummary()
        console.log()
        
        console.log('🎉 All Slack tests completed!')
        process.exit(0)
    })

// Make the script executable
if (require.main === module) {
    program.parse()
}