import type { Book } from '~/types'
import { getMockBookById } from '../../utils/mockData'

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

    const bookId = parseInt(id)
    
    if (isNaN(bookId) || bookId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Book ID',
        data: {
          success: false,
          error: 'Invalid parameter',
          message: 'Book ID must be a positive integer'
        }
      })
    }

    console.log(`📖 Book Details API Request: bookId=${bookId}`)

    // Get individual book (in production, this would be a direct database query)
    const book = getMockBookById(bookId)

    if (!book) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found',
        data: {
          success: false,
          error: 'Book not found',
          message: `No book found with ID ${bookId}`
        }
      })
    }

    // Add additional computed data for detailed view
    const bookWithDetails = {
      ...book,
      // Add computed fields that might be useful for the detail page
      averageRating: book.rating || (book.goodBookScore ? Math.round((book.goodBookScore / 100 * 2 + 3) * 10) / 10 : 4.0),
      publicationYear: new Date(book.publishDate).getFullYear(),
      daysSinceLastMention: Math.floor((Date.now() - new Date(book.lastMentionDate).getTime()) / (1000 * 60 * 60 * 24)),
      isPopular: book.mentionCount >= 50,
      isRecentlyMentioned: (Date.now() - new Date(book.lastMentionDate).getTime()) < (30 * 24 * 60 * 60 * 1000), // within 30 days
      // Ensure consistent naming with other fields
      publishedDate: book.publishDate,
      uniqueArticleCount: book.articleCount,
      trendScore: book.goodBookScore
    }

    const result = {
      success: true,
      data: bookWithDetails,
      meta: {
        bookId,
        lastUpdated: new Date().toISOString(),
        source: 'mock_data'
      }
    }

    console.log(`📤 Book Details API Response: success=${result.success}, bookTitle="${book.title}"`)

    return result

  } catch (error) {
    console.error('❌ Book Details API Error:', error)
    
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