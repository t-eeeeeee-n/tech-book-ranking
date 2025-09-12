import { BatchLog, BatchLogDocument } from '@/models'
import mongoose from 'mongoose'
import { slackNotificationService } from '@/services/slackNotificationService'

export type BatchType = 'qiita_fetch' | 'book_extraction' | 'ranking_update' | 'cache_update' | 'book_enrichment'
export type BatchStatus = 'running' | 'completed' | 'failed' | 'cancelled'

export interface BatchError {
    message: string
    stack?: string
    context?: any
}

export class BatchLogger {
    private logId: mongoose.Types.ObjectId | null = null
    private startTime: Date | null = null
    private processedCount = 0
    private successCount = 0
    private errorCount = 0
    private errors: BatchError[] = []

    /**
     * Start a new batch operation log
     */
    async start(
        batchType: BatchType, 
        config?: any
    ): Promise<mongoose.Types.ObjectId> {
        this.startTime = new Date()
        
        const batchLog = new BatchLog({
            batchType,
            status: 'running',
            startedAt: this.startTime,
            processedCount: 0,
            successCount: 0,
            errorCount: 0,
            config: config || {},
            errors: []
        })

        const saved = await batchLog.save()
        this.logId = saved._id as mongoose.Types.ObjectId
        
        console.log(`🚀 Started batch operation: ${batchType} (ID: ${this.logId})`)
        return this.logId
    }

    /**
     * Log progress during batch operation
     */
    incrementProcessed(count: number = 1): void {
        this.processedCount += count
    }

    incrementSuccess(count: number = 1): void {
        this.successCount += count
    }

    incrementError(count: number = 1): void {
        this.errorCount += count
    }

    /**
     * Add an error to the batch log
     */
    addError(error: Error | string, context?: any): void {
        const errorObj: BatchError = {
            message: typeof error === 'string' ? error : error.message,
            stack: typeof error === 'object' ? error.stack : undefined,
            context
        }

        this.errors.push(errorObj)
        this.incrementError()
        
        console.error(`❌ Batch error: ${errorObj.message}`)
    }

    /**
     * Update the batch log with current progress
     */
    async updateProgress(summary?: string): Promise<void> {
        if (!this.logId) {
            console.warn('Cannot update progress: batch not started')
            return
        }

        await BatchLog.findByIdAndUpdate(this.logId, {
            processedCount: this.processedCount,
            successCount: this.successCount,
            errorCount: this.errorCount,
            errors: this.errors,
            summary
        })
    }

    /**
     * Complete the batch operation successfully
     */
    async complete(summary?: string, metadata?: any): Promise<void> {
        if (!this.logId || !this.startTime) {
            console.warn('Cannot complete batch: batch not started')
            return
        }

        const completedAt = new Date()
        const duration = Math.floor((completedAt.getTime() - this.startTime.getTime()) / 1000)

        const updatedLog = await BatchLog.findByIdAndUpdate(this.logId, {
            status: 'completed',
            completedAt,
            duration,
            processedCount: this.processedCount,
            successCount: this.successCount,
            errorCount: this.errorCount,
            errors: this.errors,
            summary: summary || `Processed ${this.processedCount} items, ${this.successCount} successful, ${this.errorCount} errors`,
            metadata
        }, { new: true })

        console.log(`✅ Batch completed: ${summary || 'Success'} (Duration: ${duration}s)`)
        
        // Send Slack notification
        if (updatedLog) {
            try {
                await slackNotificationService.sendBatchJobNotification(updatedLog)
            } catch (error) {
                console.error('Failed to send Slack notification for completed batch:', error)
            }
        }
        
        this.reset()
    }

    /**
     * Mark the batch operation as failed
     */
    async fail(error: Error | string, metadata?: any): Promise<void> {
        if (!this.logId || !this.startTime) {
            console.warn('Cannot fail batch: batch not started')
            return
        }

        const completedAt = new Date()
        const duration = Math.floor((completedAt.getTime() - this.startTime.getTime()) / 1000)

        // Add the failure error
        this.addError(error)

        const updatedLog = await BatchLog.findByIdAndUpdate(this.logId, {
            status: 'failed',
            completedAt,
            duration,
            processedCount: this.processedCount,
            successCount: this.successCount,
            errorCount: this.errorCount,
            errors: this.errors,
            summary: `Batch failed: ${typeof error === 'string' ? error : error.message}`,
            metadata
        }, { new: true })

        console.error(`❌ Batch failed: ${typeof error === 'string' ? error : error.message} (Duration: ${duration}s)`)
        
        // Send Slack notification for failed batch
        if (updatedLog) {
            try {
                await slackNotificationService.sendBatchJobNotification(updatedLog)
            } catch (slackError) {
                console.error('Failed to send Slack notification for failed batch:', slackError)
            }
        }
        
        this.reset()
    }

    /**
     * Cancel the batch operation
     */
    async cancel(reason?: string): Promise<void> {
        if (!this.logId || !this.startTime) {
            console.warn('Cannot cancel batch: batch not started')
            return
        }

        const completedAt = new Date()
        const duration = Math.floor((completedAt.getTime() - this.startTime.getTime()) / 1000)

        const updatedLog = await BatchLog.findByIdAndUpdate(this.logId, {
            status: 'cancelled',
            completedAt,
            duration,
            processedCount: this.processedCount,
            successCount: this.successCount,
            errorCount: this.errorCount,
            errors: this.errors,
            summary: `Batch cancelled: ${reason || 'Unknown reason'}`
        }, { new: true })

        console.warn(`⚠️ Batch cancelled: ${reason || 'Unknown reason'} (Duration: ${duration}s)`)
        
        // Send Slack notification for cancelled batch
        if (updatedLog) {
            try {
                await slackNotificationService.sendBatchJobNotification(updatedLog)
            } catch (error) {
                console.error('Failed to send Slack notification for cancelled batch:', error)
            }
        }
        
        this.reset()
    }

    /**
     * Get current batch statistics
     */
    getStats() {
        return {
            processedCount: this.processedCount,
            successCount: this.successCount,
            errorCount: this.errorCount,
            errors: this.errors.length,
            isRunning: this.logId !== null
        }
    }

    /**
     * Reset the logger for a new batch
     */
    private reset(): void {
        this.logId = null
        this.startTime = null
        this.processedCount = 0
        this.successCount = 0
        this.errorCount = 0
        this.errors = []
    }
}

/**
 * Utility functions for batch logging
 */

/**
 * Get recent batch logs
 */
export async function getRecentBatchLogs(
    batchType?: BatchType,
    limit: number = 50
): Promise<BatchLogDocument[]> {
    const query = batchType ? { batchType } : {}
    
    return await BatchLog.find(query)
        .sort({ startedAt: -1 })
        .limit(limit)
        .lean()
}

/**
 * Get batch statistics
 */
export async function getBatchStats(
    batchType?: BatchType,
    days: number = 30
): Promise<{
    totalBatches: number
    successful: number
    failed: number
    cancelled: number
    avgDuration: number
    successRate: number
}> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const query: any = { startedAt: { $gte: startDate } }
    
    if (batchType) {
        query.batchType = batchType
    }

    const logs = await BatchLog.find(query).select('status duration').lean()
    
    const totalBatches = logs.length
    const successful = logs.filter(log => log.status === 'completed').length
    const failed = logs.filter(log => log.status === 'failed').length
    const cancelled = logs.filter(log => log.status === 'cancelled').length
    
    const completedLogs = logs.filter(log => log.status === 'completed' && log.duration)
    const avgDuration = completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / completedLogs.length
        : 0
        
    const successRate = totalBatches > 0 ? (successful / totalBatches) * 100 : 0

    return {
        totalBatches,
        successful,
        failed,
        cancelled,
        avgDuration: Math.round(avgDuration),
        successRate: Math.round(successRate * 100) / 100
    }
}

/**
 * Clean up old batch logs
 */
export async function cleanupOldBatchLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    
    const result = await BatchLog.deleteMany({
        createdAt: { $lt: cutoffDate }
    })
    
    console.log(`🧹 Cleaned up ${result.deletedCount || 0} old batch logs`)
    return result.deletedCount || 0
}

export default BatchLogger