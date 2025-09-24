import mongoose from 'mongoose'
import { Book, Favorite } from '@/models'
import type {
  FavoritesApiResponse,
  FavoriteActionResponse,
  Favorite as IFavorite,
  FavoriteBook
} from '@/types'
import { createError } from '@/middleware/errorHandler'

export class FavoritesService {
  async getUserFavorites(userId: string): Promise<FavoritesApiResponse> {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw createError('Invalid userId format', 400, 'INVALID_USER_ID')
      }

      // ユーザーのお気に入りを取得
      const favorites = await Favorite.find({
        userId: new mongoose.Types.ObjectId(userId)
      })
        .sort({ createdAt: -1 })
        .lean()
        .exec()

      // 書籍情報も含めて返す
      const favoriteBooks = await Promise.all(
        favorites.map(async (favorite) => {
          const book = await Book.findById(favorite.bookId).lean().exec()

          if (!book) return null

          // Convert MongoDB ObjectId to numeric ID for frontend compatibility
          const numericId = parseInt(book._id.toString().slice(-8), 16)

          const favoriteBook: FavoriteBook = {
            id: numericId,
            title: book.title,
            author: Array.isArray(book.author) ? book.author : [book.author],
            imageUrl: book.imageUrl,
            category: Array.isArray(book.category) ? book.category : [book.category],
            mentionCount: book.mentionCount,
            goodBookScore: book.trendScore || 0
          }

          const favoriteData: IFavorite = {
            _id: favorite._id?.toString() || '',
            userId: favorite.userId.toString(),
            bookId: favorite.bookId.toString(),
            createdAt: favorite.createdAt.toISOString(),
            book: favoriteBook
          }

          return favoriteData
        })
      )

      // nullを除外
      const validFavorites = favoriteBooks.filter((item: IFavorite | null): item is IFavorite => item !== null)

      return {
        success: true,
        data: validFavorites,
        total: validFavorites.length
      }
    } catch (error) {
      console.error('Error in getUserFavorites:', error)
      throw error
    }
  }

  async addFavorite(userId: string, bookId: string | number): Promise<FavoriteActionResponse> {
    try {

      // Validate userId ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw createError('Invalid userId format', 400, 'INVALID_USER_ID')
      }

      const userObjectId = new mongoose.Types.ObjectId(userId)
      let bookObjectId: mongoose.Types.ObjectId

      // Handle bookId - could be ObjectId string or numeric ID
      if (mongoose.Types.ObjectId.isValid(bookId.toString()) && bookId.toString().length === 24) {
        // It's already an ObjectId
        bookObjectId = new mongoose.Types.ObjectId(bookId.toString())
      } else {
        // It's a numeric ID, need to find the corresponding ObjectId
        const numericId = parseInt(bookId.toString())

        // Convert numeric ID to ObjectId by searching for the book
        const books = await Book.find({}).select('_id title').lean().limit(1000).exec()
        
        const book = books.find(b => {
          try {
            const hexSuffix = b._id.toString().slice(-8)
            const derivedNumericId = parseInt(hexSuffix, 16)
            return derivedNumericId === numericId
          } catch (e) {
            return false
          }
        })

        if (!book) {
          throw createError('Book not found', 404, 'BOOK_NOT_FOUND')
        }

        bookObjectId = book._id as mongoose.Types.ObjectId
      }


      // 既にお気に入りに追加されているかチェック
      const existingFavorite = await Favorite.findOne({
        userId: userObjectId,
        bookId: bookObjectId
      }).lean().exec()

      if (existingFavorite) {
        throw createError('Book is already in favorites', 409, 'DUPLICATE_FAVORITE')
      }

      // お気に入りに追加
      const newFavorite = new Favorite({
        userId: userObjectId,
        bookId: bookObjectId,
        createdAt: new Date()
      })

      const savedFavorite = await newFavorite.save()

      // レスポンス用に型変換
      const favoriteResponse: IFavorite = {
        _id: savedFavorite._id?.toString() || '',
        userId: savedFavorite.userId.toString(),
        bookId: savedFavorite.bookId.toString(),
        createdAt: savedFavorite.createdAt.toISOString()
      }

      return {
        success: true,
        message: 'Book added to favorites successfully',
        data: favoriteResponse
      }
    } catch (error) {
      console.error('Error in addFavorite:', error)
      throw error
    }
  }

  async removeFavorite(userId: string, bookId: string | number): Promise<FavoriteActionResponse> {
    try {

      // Validate userId ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw createError('Invalid userId format', 400, 'INVALID_USER_ID')
      }

      const userObjectId = new mongoose.Types.ObjectId(userId)
      let bookObjectId: mongoose.Types.ObjectId

      // Handle bookId - could be ObjectId string or numeric ID
      if (mongoose.Types.ObjectId.isValid(bookId.toString()) && bookId.toString().length === 24) {
        // It's already an ObjectId
        bookObjectId = new mongoose.Types.ObjectId(bookId.toString())
      } else {
        // It's a numeric ID, need to find the corresponding ObjectId
        const numericId = parseInt(bookId.toString())

        // Convert numeric ID to ObjectId by searching for the book
        // Use a simple scan approach for now (not efficient but safe)
        const books = await Book.find({}).select('_id title').lean().limit(1000).exec()
        const book = books.find(b => {
          try {
            const hexSuffix = b._id.toString().slice(-8)
            const derivedNumericId = parseInt(hexSuffix, 16)
            return derivedNumericId === numericId
          } catch (e) {
            return false
          }
        })

        if (!book) {
          throw createError('Book not found', 404, 'BOOK_NOT_FOUND')
        }

        bookObjectId = book._id as mongoose.Types.ObjectId
      }

      const result = await Favorite.deleteOne({
        userId: userObjectId,
        bookId: bookObjectId
      })

      if (result.deletedCount === 0) {
        throw createError('Favorite not found', 404, 'FAVORITE_NOT_FOUND')
      }

      return {
        success: true,
        message: 'Book removed from favorites successfully'
      }
    } catch (error) {
      console.error('Error in removeFavorite:', error)
      throw error
    }
  }
}

export default new FavoritesService()