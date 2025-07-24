import {getMockBookById} from '../../utils/mockData'

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
      publicationYear: book.publishDate ? new Date(book.publishDate as string).getFullYear() : new Date().getFullYear(),
      daysSinceLastMention: book.lastMentionDate ? Math.floor((Date.now() - new Date(book.lastMentionDate as string).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      isPopular: book.mentionCount >= 50,
      isRecentlyMentioned: book.lastMentionDate ? (Date.now() - new Date(book.lastMentionDate as string).getTime()) < (30 * 24 * 60 * 60 * 1000) : false, // within 30 days
      // Ensure consistent naming with other fields
      publishedDate: book.publishDate,
      uniqueArticleCount: book.articleCount,
      trendScore: book.goodBookScore
    }

    return {
      success: true,
      data: bookWithDetails,
      meta: {
        bookId,
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
