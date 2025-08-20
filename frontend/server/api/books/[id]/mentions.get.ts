import { mockDatabase, getBookMentions } from '../../../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const bookId = getRouterParam(event, 'id')
    
    if (!bookId) {
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

    // Find the book to make sure it exists
    const book = mockDatabase.books.find(b => b._id === bookId)
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

    // Get book mentions from the mockDatabase
    const bookMentions = getBookMentions(bookId)
    
    // Transform mentions to include article details
    const mentionsWithArticles = bookMentions.map(mention => {
      const article = mockDatabase.qiita_articles.find(a => a._id === mention.articleId)
      return {
        id: mention._id,
        title: article?.title || 'Unknown Article',
        url: article?.url || '',
        context: mention.context,
        confidence: mention.confidence,
        sentiment: mention.sentiment || 'neutral',
        publishedAt: article?.publishedAt || mention.createdAt,
        likesCount: article?.likesCount || 0,
        author: article?.authorName || 'Unknown',
        authorId: article?.authorId || '',
        mentionText: mention.mentionText,
        extractionMethod: mention.extractionMethod,
        recommendationLevel: mention.recommendationLevel,
        mentionWeight: mention.mentionWeight,
        tags: article?.tags || []
      }
    })

    // Sort by published date (newest first)
    mentionsWithArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return {
      success: true,
      data: mentionsWithArticles,
      meta: {
        bookId,
        totalMentions: mentionsWithArticles.length,
        sentimentBreakdown: {
          positive: mentionsWithArticles.filter(m => m.sentiment === 'positive').length,
          neutral: mentionsWithArticles.filter(m => m.sentiment === 'neutral').length,
          negative: mentionsWithArticles.filter(m => m.sentiment === 'negative').length
        },
        averageConfidence: mentionsWithArticles.length > 0 
          ? Math.round((mentionsWithArticles.reduce((sum, m) => sum + m.confidence, 0) / mentionsWithArticles.length) * 100) / 100
          : 0,
        totalLikes: mentionsWithArticles.reduce((sum, m) => sum + m.likesCount, 0),
        lastUpdated: new Date().toISOString()
      }
    }

  } catch (error) {
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch book mentions',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})