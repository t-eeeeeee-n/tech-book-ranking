import { WebClient } from '@slack/web-api'
import { BatchLogDocument } from '@/models/BatchLog'
import { serverConfig } from '@/utils/config'

export interface SlackMessage {
  text: string
  blocks?: any[]
  channel?: string
  username?: string
  icon_emoji?: string
}

export interface JobSummary {
  jobType: string
  status: 'completed' | 'failed' | 'cancelled'
  duration: number
  processedCount: number
  successCount: number
  errorCount: number
  startedAt: Date
  completedAt?: Date
  summary?: string
  errors?: any[]
}

export class SlackNotificationService {
  private client: WebClient | null = null
  private enabled: boolean = false
  private defaultChannel: string
  private botUsername: string = 'TechBook Bot'
  private botEmoji: string = ':books:'

  constructor() {
    this.enabled = this.initializeSlack()
    this.defaultChannel = process.env.SLACK_DEFAULT_CHANNEL || '#techbook-alerts'
  }

  private initializeSlack(): boolean {
    const slackToken = process.env.SLACK_BOT_TOKEN
    const enableNotifications = process.env.ENABLE_SLACK_NOTIFICATIONS?.toLowerCase() !== 'false'

    if (!slackToken || !enableNotifications) {
      console.log('Slack notifications disabled (missing token or disabled via env)')
      return false
    }

    try {
      this.client = new WebClient(slackToken)
      console.log('✅ Slack notification service initialized')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize Slack client:', error)
      return false
    }
  }

  /**
   * Send batch job completion notification
   */
  async sendBatchJobNotification(batchLog: BatchLogDocument): Promise<void> {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      const summary: JobSummary = {
        jobType: batchLog.batchType,
        status: batchLog.status as 'completed' | 'failed' | 'cancelled',
        duration: batchLog.duration || 0,
        processedCount: batchLog.processedCount,
        successCount: batchLog.successCount,
        errorCount: batchLog.errorCount,
        startedAt: batchLog.startedAt,
        completedAt: batchLog.completedAt || undefined,
        summary: batchLog.summary,
        errors: batchLog.errorLogs || []
      }

      const message = this.buildJobCompletionMessage(summary)
      await this.sendMessage(message)
      
      console.log(`📢 Slack notification sent for ${batchLog.batchType} job`)
    } catch (error) {
      console.error('❌ Failed to send Slack notification:', error)
    }
  }

  /**
   * Send custom message to Slack
   */
  async sendMessage(message: SlackMessage, channel?: string): Promise<void> {
    if (!this.enabled || !this.client) {
      return
    }

    try {
      await this.client.chat.postMessage({
        channel: channel || message.channel || this.defaultChannel,
        text: message.text,
        blocks: message.blocks,
        username: message.username || this.botUsername,
        icon_emoji: message.icon_emoji || this.botEmoji
      })
    } catch (error) {
      console.error('❌ Failed to send Slack message:', error)
      throw error
    }
  }

  /**
   * Build job completion message with rich formatting
   */
  private buildJobCompletionMessage(summary: JobSummary): SlackMessage {
    const { jobType, status, duration, processedCount, successCount, errorCount, startedAt, completedAt } = summary

    // Status indicators
    const statusEmoji = this.getStatusEmoji(status)
    const jobTypeTitle = this.getJobTypeTitle(jobType)

    // Duration formatting
    const durationText = this.formatDuration(duration)
    
    // Success rate calculation
    const successRate = processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0

    const text = `${statusEmoji} ${jobTypeTitle} ${status}`

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} ${jobTypeTitle} - ${status.toUpperCase()}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Status:*\n${this.capitalizeFirst(status)}`
          },
          {
            type: 'mrkdwn',
            text: `*Duration:*\n${durationText}`
          },
          {
            type: 'mrkdwn',
            text: `*Processed:*\n${processedCount.toLocaleString()}`
          },
          {
            type: 'mrkdwn',
            text: `*Success Rate:*\n${successRate}%`
          }
        ]
      }
    ]

    // Add detailed stats section
    if (processedCount > 0) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Successful:*\n:white_check_mark: ${successCount.toLocaleString()}`
          },
          {
            type: 'mrkdwn',
            text: `*Errors:*\n${errorCount > 0 ? ':x:' : ':white_check_mark:'} ${errorCount.toLocaleString()}`
          },
          {
            type: 'mrkdwn',
            text: `*Started:*\n${this.formatDateTime(startedAt)}`
          },
          {
            type: 'mrkdwn',
            text: `*Completed:*\n${completedAt ? this.formatDateTime(completedAt) : 'In progress'}`
          }
        ]
      })
    }

    // Add summary section if available
    if (summary.summary) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Summary:*\n${summary.summary}`
        }
      })
    }

    // Add error details for failed jobs
    if (status === 'failed' && summary.errors && summary.errors.length > 0) {
      const errorText = summary.errors
        .slice(0, 3) // Show only first 3 errors
        .map(error => `• ${error.message || error}`)
        .join('\n')

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Errors:*\n\`\`\`${errorText}\`\`\``
        }
      })

      if (summary.errors.length > 3) {
        blocks.push({
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `_... and ${summary.errors.length - 3} more errors_`
            }
          ]
        } as any)
      }
    }

    // Add job-specific recommendations
    const recommendations = this.getJobRecommendations(jobType, summary)
    if (recommendations.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Recommendations:*\n${recommendations.map(r => `• ${r}`).join('\n')}`
        }
      })
    }

    // Add divider
    blocks.push({ type: 'divider' } as any)

    // Add context
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🤖 TechBook Ranking System | Environment: ${serverConfig.env} | ${new Date().toISOString()}`
        }
      ]
    } as any)

    return {
      text,
      blocks
    }
  }

  /**
   * Send alert for critical errors
   */
  async sendErrorAlert(jobType: string, error: Error, context?: any): Promise<void> {
    if (!this.enabled) return

    const message: SlackMessage = {
      text: `🚨 Critical Error in ${this.getJobTypeTitle(jobType)}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 Critical Error - ${this.getJobTypeTitle(jobType)}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:*\n\`\`\`${error.message}\`\`\``
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Job Type:*\n${jobType}`
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${this.formatDateTime(new Date())}`
            }
          ]
        }
      ]
    }

    if (context) {
      message.blocks!.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Context:*\n\`\`\`${JSON.stringify(context, null, 2)}\`\`\``
        }
      })
    }

    await this.sendMessage(message)
  }

  /**
   * Send daily summary report
   */
  async sendDailySummary(stats: any): Promise<void> {
    if (!this.enabled) return

    const message: SlackMessage = {
      text: '📊 TechBook Ranking Daily Summary',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📊 Daily Summary Report'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Total Jobs:*\n${stats.totalJobs || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Success Rate:*\n${stats.successRate || 0}%`
            },
            {
              type: 'mrkdwn',
              text: `*Books Updated:*\n${stats.booksUpdated || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Articles Processed:*\n${stats.articlesProcessed || 0}`
            }
          ]
        }
      ]
    }

    await this.sendMessage(message)
  }

  // Helper methods
  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'completed': return ':white_check_mark:'
      case 'failed': return ':x:'
      case 'cancelled': return ':warning:'
      case 'running': return ':hourglass_flowing_sand:'
      default: return ':question:'
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'good'
      case 'failed': return 'danger'
      case 'cancelled': return 'warning'
      default: return '#439FE0'
    }
  }

  private getJobTypeTitle(jobType: string): string {
    switch (jobType) {
      case 'qiita_fetch': return 'Qiita Article Fetch'
      case 'ranking_update': return 'Ranking Generation'
      case 'cache_update': return 'Cache Update'
      case 'book_enrichment': return 'Book Enrichment'
      case 'cleanup': return 'Data Cleanup'
      default: return jobType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private getJobRecommendations(jobType: string, summary: JobSummary): string[] {
    const recommendations: string[] = []

    // General recommendations based on error rate
    const errorRate = summary.processedCount > 0 ? (summary.errorCount / summary.processedCount) * 100 : 0

    if (errorRate > 10) {
      recommendations.push('High error rate detected - check logs for recurring issues')
    }

    if (summary.duration > 3600) { // More than 1 hour
      recommendations.push('Job took longer than expected - consider optimizing or increasing resources')
    }

    // Job-specific recommendations
    switch (jobType) {
      case 'qiita_fetch':
        if (summary.successCount === 0) {
          recommendations.push('No articles found - check Qiita API status or search parameters')
        }
        if (errorRate > 5) {
          recommendations.push('API rate limit may be reached - consider adjusting fetch frequency')
        }
        break

      case 'ranking_update':
        if (summary.errorCount > 0) {
          recommendations.push('Ranking generation errors - verify book data integrity')
        }
        break

      case 'book_enrichment':
        if (errorRate > 20) {
          recommendations.push('High enrichment failure rate - check Amazon API configuration')
        }
        break
    }

    return recommendations
  }

  /**
   * Check if Slack notifications are enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Test Slack connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.enabled || !this.client) {
      return false
    }

    try {
      const result = await this.client.auth.test()
      console.log('✅ Slack connection test successful:', result.team)
      return true
    } catch (error) {
      console.error('❌ Slack connection test failed:', error)
      return false
    }
  }
}

export const slackNotificationService = new SlackNotificationService()