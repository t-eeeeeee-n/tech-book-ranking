import { mockDatabase } from '../utils/mockDatabase'
import { addNumericId } from '../utils/idConverter'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10))
    const category = query.category as string
    const search = query.search as string
    const period = query.period as string
    const sort = query.sort as string || 'mentions'

    let filteredBooks = [...mockDatabase.books.filter(book => book.status === 'active')].map(addNumericId)

    // Category filter
    if (category && category !== 'all' && category !== '') {
      // Map English category values to Japanese category names
      const categoryMapping: Record<string, string> = {
        'programming': 'プログラミング',
        'web': 'Web開発',
        'mobile': 'モバイル開発',
        'ai': 'AI・機械学習',
        'infrastructure': 'インフラ・DevOps',
        'database': 'データベース',
        'security': 'セキュリティ',
        'design': 'デザイン・UI/UX',
        'management': 'プロジェクト管理',
        'career': 'キャリア・スキル'
      }
      
      const searchCategory = categoryMapping[category.toLowerCase()] || category
      filteredBooks = filteredBooks.filter(book => 
        book.category.some(cat => {
          const catLower = cat.toLowerCase()
          const searchLower = searchCategory.toLowerCase()
          // Try the exact match first, then a partial match
          return catLower === searchLower || catLower.includes(searchLower)
        })
      )
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase().trim()
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.some(author => author.toLowerCase().includes(searchLower)) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (book.description && book.description.toLowerCase().includes(searchLower))
      )
    }

    // Period filter
    if (period && period !== 'all') {
      const now = new Date()
      let dateThreshold: Date

      switch (period) {
        case 'today':
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          dateThreshold = new Date(now.getFullYear(), 0, 1)
          break
        default:
          dateThreshold = new Date(0)
      }

      filteredBooks = filteredBooks.filter(book => 
        book.lastMentionedAt ? new Date(book.lastMentionedAt) >= dateThreshold : false
      )
    }

    // Sort
    filteredBooks.sort((a, b) => {
      switch (sort) {
        case 'mentions':
          return b.mentionCount - a.mentionCount
        case 'trend':
          return b.trendScore - a.trendScore
        case 'title':
          return a.title.localeCompare(b.title, 'ja')
        case 'author':
          return a.author[0].localeCompare(b.author[0], 'ja')
        case 'newest':
          return (b.publishedYear || 0) - (a.publishedYear || 0)
        case 'recent':
          return (b.lastMentionedAt ? new Date(b.lastMentionedAt).getTime() : 0) - (a.lastMentionedAt ? new Date(a.lastMentionedAt).getTime() : 0)
        default:
          return b.mentionCount - a.mentionCount
      }
    })

    // Add ranking
    const rankedBooks = filteredBooks.map((book, index) => ({
      ...book,
      rank: index + 1
    }))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBooks = rankedBooks.slice(startIndex, endIndex)

    // Adjust rank for pagination
    const paginatedBooksWithCorrectRank = paginatedBooks.map((book, index) => ({
      ...book,
      rank: startIndex + index + 1
    }))

    return {
      success: true,
      data: paginatedBooksWithCorrectRank,
      pagination: {
        page,
        limit,
        total: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limit),
        hasMore: endIndex < filteredBooks.length,
        hasNext: page < Math.ceil(filteredBooks.length / limit),
        hasPrev: page > 1
      },
      meta: {
        totalBooks: mockDatabase.books.length,
        filteredCount: filteredBooks.length,
        appliedFilters: {
          category: category || null,
          search: search || null,
          period: period || null,
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
        error: 'Failed to fetch books data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})