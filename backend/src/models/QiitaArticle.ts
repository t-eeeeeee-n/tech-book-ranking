import mongoose, { Schema, Document, Model } from 'mongoose'

export interface QiitaArticleDocument extends Document {
    qiitaId: string
    title: string
    url: string
    authorId: string
    authorName: string
    likesCount: number
    stocksCount: number
    commentsCount: number
    body?: string | null
    excerpt: string
    tags: string[]
    publishedAt: Date
    updatedAt: Date
    processed: boolean
    processedAt?: Date | null
    bookExtractionStatus: 'pending' | 'completed' | 'failed'
    lastCheckedAt: Date
    createdAt: Date
    // Compatibility fields
    author?: string
}

const qiitaArticleSchema = new Schema<QiitaArticleDocument>({
    qiitaId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 300
    },
    url: {
        type: String,
        required: true,
        maxlength: 500
    },
    authorId: {
        type: String,
        required: true,
        maxlength: 100,
        index: true
    },
    authorName: {
        type: String,
        required: true,
        maxlength: 100,
        index: true
    },
    likesCount: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    stocksCount: {
        type: Number,
        required: true,
        default: 0
    },
    commentsCount: {
        type: Number,
        required: true,
        default: 0
    },
    body: {
        type: String,
        default: null
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: 500
    },
    tags: {
        type: [String],
        required: true,
        index: true
    },
    publishedAt: {
        type: Date,
        required: true,
        index: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    processed: {
        type: Boolean,
        required: true,
        default: false,
        index: true
    },
    processedAt: {
        type: Date,
        default: null
    },
    bookExtractionStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        index: true
    },
    lastCheckedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    // Compatibility fields
    author: {
        type: String,
        maxlength: 100
    }
}, {
    timestamps: true,
    collection: 'qiita_articles'
})

// Indexes
qiitaArticleSchema.index({ publishedAt: -1 })
qiitaArticleSchema.index({ likesCount: -1 })
// qiitaArticleSchema.index({ tags: 1 }) // Removed to avoid duplicate with field index

const QiitaArticle: Model<QiitaArticleDocument> = mongoose.model<QiitaArticleDocument>('QiitaArticle', qiitaArticleSchema)

export default QiitaArticle