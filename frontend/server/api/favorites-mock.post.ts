import { findBookIdByNumericId, convertStringIdToNumber } from '../utils/idConverter'
import { mockDatabase } from '../utils/mockDatabase'

// メモリ内ストレージ（開発用）
const inMemoryFavorites: Array<{
  _id: string
  userId: string
  bookId: string
  createdAt: Date
}> = []

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, bookId } = body

    if (!userId || !bookId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and bookId are required'
      })
    }

    // UserIdの形式チェック（24文字の16進数文字列）
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid userId format'
      })
    }

    // bookIdが文字列（ObjectId）の場合はそのまま使用、数値の場合は変換
    let bookStringId: string

    if (/^[0-9a-fA-F]{24}$/.test(bookId)) {
      // 24文字の16進数文字列（ObjectId形式）の場合はそのまま使用
      bookStringId = bookId
    } else {
      // 数値の場合は文字列IDを検索
      const numericBookId = parseInt(bookId)
      if (isNaN(numericBookId)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid bookId format'
        })
      }

      const foundId = findBookIdByNumericId(numericBookId, mockDatabase.books)
      if (!foundId) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Book not found in ID mapping'
        })
      }
      bookStringId = foundId
    }

    // モックデータから書籍が存在するかチェック
    const book = mockDatabase.books.find(b => b._id === bookStringId)

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found'
      })
    }

    // 既にお気に入りに追加されているかチェック
    const existingFavorite = inMemoryFavorites.find(fav =>
      fav.userId === userId && fav.bookId === bookStringId
    )

    if (existingFavorite) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Book is already in favorites'
      })
    }

    // お気に入りに追加
    const newFavorite = {
      _id: generateObjectId(),
      userId: userId,
      bookId: bookStringId,
      createdAt: new Date()
    }

    inMemoryFavorites.push(newFavorite)

    return {
      success: true,
      data: newFavorite,
      message: 'Book added to favorites successfully (mock storage)'
    }

  } catch (error) {
    console.error('Error adding to favorites:', error)

    // 既に定義されたエラーの場合はそのまま投げる
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add book to favorites'
    })
  }
})

// ObjectId生成関数
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16)
  const randomBytes = Math.random().toString(16).substr(2, 16)
  return timestamp + randomBytes.padEnd(16, '0')
}