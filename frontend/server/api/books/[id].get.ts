import { mockDatabase } from '../../utils/mockDatabase'
import { addNumericId, convertStringIdToNumber } from '../../utils/idConverter'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Book ID is required',
        data: {
          success: false,
          error: 'Missing required parameter',
          message: 'Book ID must be provided'
        }
      })
    }

    const book = mockDatabase.books.find(b => b._id === id)

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found',
        data: {
          success: false,
          error: 'Book not found',
          message: `No book found with ID ${id}`
        }
      })
    }

    // Get book mentions with article details
    const bookMentions = mockDatabase.book_mentions
      .filter(mention => mention.bookId === book._id)
      .map(mention => {
        const article = mockDatabase.qiita_articles.find(a => a._id === mention.articleId)
        return {
          ...mention,
          article: article || null
        }
      })
      .filter(mention => mention.article !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Get related books (books mentioned in the same articles)
    const relatedArticleIds = bookMentions.map(mention => mention.articleId)
    const relatedBookIds = mockDatabase.book_mentions
      .filter(mention => 
        relatedArticleIds.includes(mention.articleId) && 
        mention.bookId !== book._id
      )
      .map(mention => mention.bookId)
    
    const uniqueRelatedBookIds = [...new Set(relatedBookIds)]
    const relatedBooks = uniqueRelatedBookIds
      .map(bookId => mockDatabase.books.find(b => b._id === bookId))
      .filter(Boolean)
      .slice(0, 5) as (typeof mockDatabase.books[0])[]

    // Add computed fields
    const bookWithDetails = {
      ...addNumericId(book), // 数値IDを追加
      mentions: bookMentions,
      relatedBooks: relatedBooks.map(addNumericId), // 関連書籍にも数値IDを追加
      daysSinceLastMention: book.lastMentionedAt ? Math.floor((Date.now() - new Date(book.lastMentionedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      isPopular: book.mentionCount >= 50,
      isRecentlyMentioned: book.lastMentionedAt ? (Date.now() - new Date(book.lastMentionedAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false
    }

    return {
      success: true,
      data: bookWithDetails,
      meta: {
        bookId: id,
        mentionCount: bookMentions.length,
        relatedBooksCount: relatedBooks.length,
        lastUpdated: new Date().toISOString(),
        source: 'mock_data'
      }
    }

  } catch (error) {
    
    // If it's already a createError, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    // Otherwise, create a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch book details',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
