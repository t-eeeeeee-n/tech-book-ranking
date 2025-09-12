import mongoose, { Schema, Document, Model } from 'mongoose'

export interface CategoryDocument extends Document {
    name: string
    slug: string
    description?: string | null
    parentId?: string | null
    displayOrder: number
    isActive: boolean
    color?: string | null
    icon?: string | null
    bookCount: number
    createdAt: Date
    updatedAt: Date
}

const categorySchema = new Schema<CategoryDocument>({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        index: true
    },
    description: {
        type: String,
        default: null,
        maxlength: 500
    },
    parentId: {
        type: String,
        default: null,
        index: true
    },
    displayOrder: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
        index: true
    },
    color: {
        type: String,
        default: null,
        maxlength: 20
    },
    icon: {
        type: String,
        default: null,
        maxlength: 50
    },
    bookCount: {
        type: Number,
        required: true,
        default: 0,
        index: true
    }
}, {
    timestamps: true
})

const Category: Model<CategoryDocument> = mongoose.model<CategoryDocument>('Category', categorySchema)

export default Category