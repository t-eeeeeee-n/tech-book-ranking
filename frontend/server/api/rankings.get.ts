import { mockDatabase } from '../utils/mockDatabase'
import { addNumericId } from '../utils/idConverter'
import type { RankingData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = (query.type as string) || 'overall'
    const categoryId = query.categoryId as string
    const category = query.category as string // category名（'programming'など）からのフィルタリングをサポート
    const period = (query.period as string) || 'all'
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 50))

    // Find matching ranking (注意：category名でのフィルタリングは静的データにはないので、常に動的生成になる)
    const foundRanking = mockDatabase.rankings.find(r => 
      r.type === type && 
      (categoryId ? r.categoryId === categoryId : (category ? false : r.categoryId === null)) &&
      r.period === period
    )
    
    // Convert readonly type to mutable RankingData if found
    let ranking: RankingData | undefined = foundRanking ? {
      _id: foundRanking._id,
      type: foundRanking.type,
      categoryId: foundRanking.categoryId,
      period: foundRanking.period,
      rankings: foundRanking.rankings.map(r => ({
        rank: r.rank,
        bookId: r.bookId,
        mentionCount: r.mentionCount,
        trendScore: r.trendScore,
        change: r.change,
        book: null
      })),
      totalBooks: foundRanking.totalBooks,
      generatedAt: foundRanking.generatedAt,
      expiresAt: foundRanking.expiresAt,
      createdAt: foundRanking.createdAt
    } : undefined

    // If static ranking exists but doesn't cover enough books compared to our database, generate dynamic ranking
    const totalBooksInDatabase = mockDatabase.books.length
    const shouldGenerateDynamic = !ranking || (ranking.totalBooks < Math.min(totalBooksInDatabase, limit))

    if (shouldGenerateDynamic) {
      // Generate a default ranking if not found
      const books = [...mockDatabase.books]
        .filter(book => {
          if (categoryId) {
            return book.category.some(cat => {
              const categoryObj = mockDatabase.categories.find(c => c._id === categoryId)
              return categoryObj && cat.toLowerCase().includes(categoryObj.name.toLowerCase())
            })
          }
          if (category) {
            // カテゴリ名でのフィルタリング（'programming' -> 'プログラミング'など）
            const categoryMapping: Record<string, string> = {
              'programming': 'プログラミング',
              'web-development': 'Web開発',
              'ai-machine-learning': 'AI・機械学習',
              'infrastructure': 'インフラ',
              'mobile-development': 'モバイル開発',
              'game-development': 'ゲーム開発',
              'data-science': 'データサイエンス',
              'security': 'セキュリティ',
              'devops': 'DevOps',
              'design': 'デザイン'
            }
            const mappedCategory = categoryMapping[category]
            if (mappedCategory) {
              return book.category.some(cat => cat.includes(mappedCategory))
            }
          }
          return true
        })
        .sort((a, b) => b.mentionCount - a.mentionCount)
        .slice(0, limit)

      const rankings = books.map((book, index) => ({
        rank: index + 1,
        bookId: book._id as string,
        mentionCount: book.mentionCount,
        trendScore: book.trendScore,
        change: 0,
        book: null
      }))

      ranking = {
        _id: 'generated',
        type: type,
        categoryId: categoryId || (category ? 'dynamic-category' : null),
        period: period,
        rankings: rankings,
        totalBooks: books.length,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      } satisfies RankingData
    }

    // At this point, ranking is guaranteed to be defined
    if (!ranking) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate ranking data'
      })
    }

    // Enrich ranking data with book details
    const enrichedRankings = ranking.rankings
      .slice(0, limit)
      .map(rankingItem => {
        const book = mockDatabase.books.find(b => b._id === rankingItem.bookId)
        return {
          ...rankingItem,
          book: book ? addNumericId(book) : null
        }
      })
      .filter(item => item.book !== null)

    return {
      success: true,
      data: {
        ...ranking,
        rankings: enrichedRankings
      },
      meta: {
        requestedType: type,
        requestedCategoryId: categoryId,
        requestedPeriod: period,
        requestedLimit: limit,
        actualCount: enrichedRankings.length,
        lastUpdated: ranking.generatedAt
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch rankings',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})