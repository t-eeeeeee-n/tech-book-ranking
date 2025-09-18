import mongoose, { Schema, Document } from 'mongoose'

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId
  bookId: mongoose.Types.ObjectId
  createdAt: Date
}

const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Book',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // We're using createdAt manually
})

// Compound index for unique favorites per user
favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true })

// Index for efficient queries
favoriteSchema.index({ userId: 1, createdAt: -1 })

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema)
export default Favorite