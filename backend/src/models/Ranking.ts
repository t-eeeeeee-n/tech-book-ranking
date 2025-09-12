import mongoose, { Schema, Document, Model } from 'mongoose'

export interface RankingDocument extends Document {
    type: 'overall' | 'category' | 'trending' | 'newcomer'
    categoryId?: mongoose.Types.ObjectId
    period: 'all' | 'year' | 'month' | 'week'
    rankings: Array<{
        bookId: mongoose.Types.ObjectId
        rank: number
        score: number
        mentionCount: number
        trendScore?: number
    }>
    totalBooks: number
    generatedAt: Date
    expiresAt: Date
}

const rankingSchema = new Schema<RankingDocument>({
    type: {
        type: String,
        enum: ['overall', 'category', 'trending', 'newcomer'],
        required: true,
        index: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    },
    period: {
        type: String,
        enum: ['all', 'year', 'month', 'week'],
        required: true,
        index: true
    },
    rankings: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        rank: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        mentionCount: {
            type: Number,
            required: true
        },
        trendScore: {
            type: Number
        }
    }],
    totalBooks: {
        type: Number,
        required: true
    },
    generatedAt: {
        type: Date,
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true
        // index removed to avoid duplicate with TTL index below
    }
}, {
    timestamps: true
})

// Compound indexes for efficient querying
rankingSchema.index({ type: 1, period: 1 })
rankingSchema.index({ type: 1, categoryId: 1, period: 1 })
rankingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index

const Ranking: Model<RankingDocument> = mongoose.model<RankingDocument>('Ranking', rankingSchema)

export default Ranking