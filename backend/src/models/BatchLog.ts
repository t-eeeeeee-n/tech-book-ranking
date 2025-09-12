import mongoose, { Schema, Document, Model } from 'mongoose'

export interface BatchLogDocument extends Document {
    batchType: 'qiita_fetch' | 'book_extraction' | 'ranking_update' | 'cache_update' | 'book_enrichment'
    status: 'running' | 'completed' | 'failed' | 'cancelled'
    startedAt: Date
    completedAt?: Date
    duration?: number // in seconds
    processedCount: number
    successCount: number
    errorCount: number
    errorLogs?: Array<{
        message: string
        stack?: string
        timestamp: Date
        context?: any
    }>
    config?: {
        [key: string]: any
    }
    summary?: string
    metadata?: {
        [key: string]: any
    }
}

const batchLogSchema = new Schema<BatchLogDocument>({
    batchType: {
        type: String,
        enum: ['qiita_fetch', 'book_extraction', 'ranking_update', 'cache_update', 'book_enrichment'],
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['running', 'completed', 'failed', 'cancelled'],
        required: true,
        index: true
    },
    startedAt: {
        type: Date,
        required: true,
        index: true
    },
    completedAt: {
        type: Date,
        index: true
    },
    duration: {
        type: Number // seconds
    },
    processedCount: {
        type: Number,
        required: true,
        default: 0
    },
    successCount: {
        type: Number,
        required: true,
        default: 0
    },
    errorCount: {
        type: Number,
        required: true,
        default: 0
    },
    errorLogs: [{
        message: {
            type: String,
            required: true
        },
        stack: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        context: Schema.Types.Mixed
    }],
    config: {
        type: Schema.Types.Mixed
    },
    summary: String,
    metadata: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
})

// Compound indexes for efficient querying
batchLogSchema.index({ batchType: 1, status: 1 })
batchLogSchema.index({ batchType: 1, startedAt: -1 })
batchLogSchema.index({ startedAt: -1 })

// TTL index to automatically cleanup old logs (keep for 90 days)
batchLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

const BatchLog: Model<BatchLogDocument> = mongoose.model<BatchLogDocument>('BatchLog', batchLogSchema)

export default BatchLog