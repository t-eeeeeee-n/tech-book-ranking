import { mockDatabase } from '../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
    const search = query.search as string
    const processed = query.processed as string
    const bookId = query.bookId as string
    const authorId = query.authorId as string
    const sort = query.sort as string || 'publishedAt'

    let articles = [...mockDatabase.qiita_articles]

    // Filter by processed status
    if (processed !== undefined) {
      const isProcessed = processed === 'true'
      articles = articles.filter(article => article.processed === isProcessed)
    }

    // Filter by book ID (articles that mention this book)
    if (bookId) {
      const mentionedArticleIds = mockDatabase.book_mentions
        .filter(mention => mention.bookId === bookId)
        .map(mention => mention.articleId)
      articles = articles.filter(article => mentionedArticleIds.includes(article._id))
    }

    // Filter by author ID
    if (authorId) {
      articles = articles.filter(article => article.authorId === authorId)
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase().trim()
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.authorName.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort
    articles.sort((a, b) => {
      switch (sort) {
        case 'publishedAt':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'likes':
          return b.likesCount - a.likesCount
        case 'stocks':
          return b.stocksCount - a.stocksCount
        case 'comments':
          return b.commentsCount - a.commentsCount
        case 'title':
          return a.title.localeCompare(b.title, 'ja')
        case 'author':
          return a.authorName.localeCompare(b.authorName, 'ja')
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = articles.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedArticles,
      pagination: {
        page,
        limit,
        total: articles.length,
        totalPages: Math.ceil(articles.length / limit),
        hasMore: endIndex < articles.length,
        hasNext: page < Math.ceil(articles.length / limit),
        hasPrev: page > 1
      },
      meta: {
        totalArticles: mockDatabase.qiita_articles.length,
        filteredCount: articles.length,
        appliedFilters: {
          search: search || null,
          processed: processed || null,
          bookId: bookId || null,
          authorId: authorId || null,
          sort
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
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})