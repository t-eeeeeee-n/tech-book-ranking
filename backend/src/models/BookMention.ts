import mongoose, { Schema, Document, Model } from 'mongoose'

export interface BookMentionDocument extends Document {
    bookId: string
    articleId: string
    mentionText: string
    context: string
    confidence: number
    extractionMethod: 'regex' | 'nlp' | 'manual'
    sentiment?: 'positive' | 'neutral' | 'negative' | null
    recommendationLevel?: number | null
    articlePopularity: number
    authorCredibility: number
    mentionWeight: number
    createdAt: Date
    verifiedAt?: Date | null
    verifiedBy?: string | null
}

const bookMentionSchema = new Schema<BookMentionDocument>({
    bookId: {
        type: String,
        required: true,
        index: true
    },
    articleId: {
        type: String,
        required: true,
        index: true
    },
    mentionText: {
        type: String,
        required: true,
        maxlength: 1000
    },
    context: {
        type: String,
        required: true,
        maxlength: 2000
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        index: true
    },
    extractionMethod: {
        type: String,
        required: true,
        enum: ['regex', 'nlp', 'manual'],
        index: true
    },
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: null,
        index: true
    },
    recommendationLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    articlePopularity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    authorCredibility: {
        type: Number,
        required: true,
        default: 0.5,
        min: 0,
        max: 1
    },
    mentionWeight: {
        type: Number,
        required: true,
        default: 1.0,
        min: 0
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verifiedBy: {
        type: String,
        default: null,
        maxlength: 100
    }
}, {
    timestamps: true
})

// Compound indexes
bookMentionSchema.index({ bookId: 1, articleId: 1 }, { unique: true })
bookMentionSchema.index({ bookId: 1, mentionedAt: -1 })
bookMentionSchema.index({ articleId: 1, mentionedAt: -1 })

const BookMention: Model<BookMentionDocument> = mongoose.model<BookMentionDocument>('BookMention', bookMentionSchema)

export default BookMention