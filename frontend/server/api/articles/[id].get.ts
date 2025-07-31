import { mockDatabase } from '../../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          success: false,
          error: 'Article ID is required'
        }
      })
    }

    const article = mockDatabase.qiita_articles.find(a => a._id === id || a.qiitaId === id)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        data: {
          success: false,
          error: 'Article not found'
        }
      })
    }

    // Get book mentions for this article
    const bookMentions = mockDatabase.book_mentions
      .filter(mention => mention.articleId === article._id)
      .map(mention => {
        const book = mockDatabase.books.find(b => b._id === mention.bookId)
        return {
          ...mention,
          book: book || null
        }
      })
      .filter(mention => mention.book !== null)

    return {
      success: true,
      data: {
        ...article,
        bookMentions
      },
      meta: {
        mentionCount: bookMentions.length,
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
        error: 'Failed to fetch article',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})