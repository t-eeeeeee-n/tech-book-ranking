import { mockDatabase } from '../utils/mockDatabase'
import { addNumericId } from '../utils/idConverter'
import type { SearchResults } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = query.q as string
    const type = query.type as string || 'all' // all, books, articles, categories
    const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 10))

    if (!q || q.trim().length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          success: false,
          error: 'Search query too short',
          message: 'Search query must be at least 2 characters long'
        }
      })
    }

    const searchLower = q.toLowerCase().trim()
    const results: SearchResults = {
      books: [],
      articles: [],
      categories: []
    }

    // Search books
    if (type === 'all' || type === 'books') {
      results.books = mockDatabase.books
        .filter(book => 
          book.status === 'active' && (
            book.title.toLowerCase().includes(searchLower) ||
            book.author.some(author => author.toLowerCase().includes(searchLower)) ||
            book.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            (book.description && book.description.toLowerCase().includes(searchLower))
          )
        )
        .sort((a, b) => {
          // Prioritize title matches
          const aInTitle = a.title.toLowerCase().includes(searchLower)
          const bInTitle = b.title.toLowerCase().includes(searchLower)
          if (aInTitle && !bInTitle) return -1
          if (!aInTitle && bInTitle) return 1
          // Then by mention count
          return b.mentionCount - a.mentionCount
        })
        .slice(0, limit)
        .map(book => ({
          ...addNumericId(book),
          author: [...book.author] as string[], // Convert readonly to mutable
          category: [...book.category] as string[], // Convert readonly to mutable
          tags: [...book.tags] as string[], // Convert readonly to mutable
          rakutenUrl: book.rakutenUrl || undefined, // Convert null to undefined
          amazonUrl: book.amazonUrl || undefined, // Convert null to undefined
          imageUrl: book.imageUrl || undefined, // Convert null to undefined
          isbn10: book.isbn10 || undefined, // Convert null to undefined
          isbn13: book.isbn13 || undefined, // Convert null to undefined
          publisher: book.publisher || undefined, // Convert null to undefined
          description: book.description || undefined, // Convert null to undefined
          type: 'book' as const
        } as import('~/types').BookSearchResult))
    }

    // Search articles
    if (type === 'all' || type === 'articles') {
      results.articles = mockDatabase.qiita_articles
        .filter(article =>
          article.title.toLowerCase().includes(searchLower) ||
          article.authorName.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
        .sort((a, b) => {
          // Prioritize title matches
          const aInTitle = a.title.toLowerCase().includes(searchLower)
          const bInTitle = b.title.toLowerCase().includes(searchLower)
          if (aInTitle && !bInTitle) return -1
          if (!aInTitle && bInTitle) return 1
          // Then by likes count
          return b.likesCount - a.likesCount
        })
        .slice(0, limit)
        .map(article => ({
          ...article,
          id: article.qiitaId, // Map qiitaId to id for compatibility
          author: article.authorName, // Map authorName to author for compatibility
          publishedAt: article.publishedAt,
          likesCount: article.likesCount,
          tags: [...article.tags] as string[], // Convert readonly to mutable
          type: 'article' as const
        } as import('~/types').ArticleSearchResult))
    }

    // Search categories
    if (type === 'all' || type === 'categories') {
      results.categories = mockDatabase.categories
        .filter(category =>
          category.isActive && (
            category.name.toLowerCase().includes(searchLower) ||
            (category.description && category.description.toLowerCase().includes(searchLower))
          )
        )
        .sort((a, b) => {
          // Prioritize name matches
          const aInName = a.name.toLowerCase().includes(searchLower)
          const bInName = b.name.toLowerCase().includes(searchLower)
          if (aInName && !bInName) return -1
          if (!aInName && bInName) return 1
          // Then by book count
          return b.bookCount - a.bookCount
        })
        .slice(0, limit)
        .map(category => ({
          ...category,
          type: 'category' as const
        }))
    }

    const totalResults = results.books.length + results.articles.length + results.categories.length

    return {
      success: true,
      data: results,
      meta: {
        query: q,
        type,
        totalResults,
        counts: {
          books: results.books.length,
          articles: results.articles.length,
          categories: results.categories.length
        },
        limit,
        searchTime: Date.now()
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
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})