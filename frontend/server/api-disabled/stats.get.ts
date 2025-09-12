import { mockDatabase } from '../utils/mockDatabase'

export default defineEventHandler(async () => {
  try {
    const totalBooks = mockDatabase.books.filter(book => book.status === 'active').length
    const totalArticles = mockDatabase.qiita_articles.length
    const totalMentions = mockDatabase.book_mentions.length
    const totalCategories = mockDatabase.categories.filter(cat => cat.isActive).length

    // Get recent activities
    const recentMentions = [...mockDatabase.book_mentions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(mention => {
        const book = mockDatabase.books.find(b => b._id === mention.bookId)
        const article = mockDatabase.qiita_articles.find(a => a._id === mention.articleId)
        return {
          ...mention,
          book: book || null,
          article: article || null
        }
      })
      .filter(mention => mention.book && mention.article)

    // Top categories by book count
    const categoryStats = mockDatabase.categories
      .filter(cat => cat.isActive && cat.parentId === null)
      .sort((a, b) => b.bookCount - a.bookCount)
      .slice(0, 10)

    // Trending books (high trend score)
    const trendingBooks = mockDatabase.books
      .filter(book => book.status === 'active')
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 10)

    // Recent batch logs
    const recentBatchLogs = [...mockDatabase.batch_logs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Calculate growth metrics
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const weeklyNewMentions = mockDatabase.book_mentions
      .filter(mention => new Date(mention.createdAt) >= lastWeek).length

    const monthlyNewBooks = mockDatabase.books
      .filter(book => new Date(book.createdAt) >= lastMonth).length

    return {
      success: true,
      data: {
        overview: {
          totalBooks,
          totalArticles,
          totalMentions,
          totalCategories,
          weeklyNewMentions,
          monthlyNewBooks
        },
        recentActivity: recentMentions,
        categories: categoryStats,
        trending: trendingBooks,
        batchLogs: recentBatchLogs
      },
      meta: {
        generatedAt: new Date().toISOString(),
        source: 'mock_data'
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})