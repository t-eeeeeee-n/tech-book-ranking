import mongoose, { Schema, Document, Model } from 'mongoose'
import { Book as IBook } from '@/types'

export interface BookDocument extends Omit<IBook, 'id' | '_id'>, Document {
    _id: mongoose.Types.ObjectId
    titleNormalized: string
}

const bookSchema = new Schema<BookDocument>({
    title: {
        type: String,
        required: true,
        maxlength: 200,
        index: true
    },
    titleNormalized: {
        type: String,
        required: true,
        maxlength: 200,
        index: true
    },
    author: {
        type: [String],
        required: true,
        index: true
    },
    publisher: {
        type: String,
        maxlength: 100
    },
    isbn10: {
        type: String,
        length: 10,
        index: true,
        sparse: true
    },
    isbn13: {
        type: String,
        length: 13,
        index: true,
        sparse: true
    },
    publishedYear: {
        type: Number,
        index: true
    },
    category: {
        type: [String],
        required: true,
        index: true
    },
    tags: {
        type: [String],
        required: true,
        index: true
    },
    mentionCount: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    uniqueArticleCount: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    firstMentionedAt: {
        type: Date
    },
    lastMentionedAt: {
        type: Date,
        index: true
    },
    trendScore: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    amazonUrl: {
        type: String,
        maxlength: 500
    },
    rakutenUrl: {
        type: String,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        maxlength: 500
    },
    description: {
        type: String,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'merged'],
        default: 'active',
        maxlength: 20,
        index: true
    },
    mergedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(_doc, ret) {
            ret.id = ret._id.toString()
            return ret
        }
    }
})

// Indexes for better query performance
bookSchema.index({ title: 1, titleNormalized: 1 })
bookSchema.index({ mentionCount: -1, trendScore: -1 })
bookSchema.index({ category: 1, mentionCount: -1 })
// bookSchema.index({ tags: 1, mentionCount: -1 }) // Removed to avoid duplicate with field index
bookSchema.index({ status: 1, mentionCount: -1 })
bookSchema.index({ lastMentionedAt: -1 })

// Create a text index for search functionality
bookSchema.index({ 
    title: 'text', 
    titleNormalized: 'text', 
    author: 'text', 
    description: 'text',
    tags: 'text'
})

const Book: Model<BookDocument> = mongoose.model<BookDocument>('Book', bookSchema)

export default Book