import { mockDatabase } from '../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
    const bookId = query.bookId as string
    const articleId = query.articleId as string
    const sentiment = query.sentiment as string
    const confidence = parseFloat(query.confidence as string)

    let mentions = [...mockDatabase.book_mentions]

    // Filter by book ID
    if (bookId) {
      mentions = mentions.filter(mention => mention.bookId === bookId)
    }

    // Filter by article ID
    if (articleId) {
      mentions = mentions.filter(mention => mention.articleId === articleId)
    }

    // Filter by sentiment
    if (sentiment && sentiment !== 'all') {
      mentions = mentions.filter(mention => mention.sentiment === sentiment)
    }

    // Filter by minimum confidence
    if (!isNaN(confidence) && confidence > 0) {
      mentions = mentions.filter(mention => mention.confidence >= confidence)
    }

    // Sort by creation date (newest first)
    mentions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Enrich with book and article details
    const enrichedMentions = mentions.map(mention => {
      const book = mockDatabase.books.find(b => b._id === mention.bookId)
      const article = mockDatabase.qiita_articles.find(a => a._id === mention.articleId)
      return {
        ...mention,
        book: book || null,
        article: article || null
      }
    }).filter(mention => mention.book && mention.article)

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMentions = enrichedMentions.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedMentions,
      pagination: {
        page,
        limit,
        total: enrichedMentions.length,
        totalPages: Math.ceil(enrichedMentions.length / limit),
        hasMore: endIndex < enrichedMentions.length,
        hasNext: page < Math.ceil(enrichedMentions.length / limit),
        hasPrev: page > 1
      },
      meta: {
        totalMentions: mockDatabase.book_mentions.length,
        filteredCount: enrichedMentions.length,
        appliedFilters: {
          bookId: bookId || null,
          articleId: articleId || null,
          sentiment: sentiment || null,
          minConfidence: !isNaN(confidence) ? confidence : null
        },
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch mentions',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})