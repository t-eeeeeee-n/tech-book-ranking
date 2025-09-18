import { Request, Response } from 'express'
import { Book } from '@/models'
import { asyncHandler } from '@/middleware/errorHandler'
import type { Book as IBook } from '@/types'

interface BookQueryParams {
  page?: string
  limit?: string
  category?: string
  search?: string
  period?: string
  sort?: string
  sortOrder?: string
}

interface BookWithNumericId extends IBook {
  id: number
  rank?: number
}

class BooksController {
  getBooks = asyncHandler(async (req: Request<{}, {}, {}, BookQueryParams>, res: Response) => {
    const {
      page = '1',
      limit = '20',
      category,
      search,
      period = 'all',
      sort = 'mentionCount',
      sortOrder = 'desc'
    } = req.query

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))

    // Build query
    let query: any = { status: 'active' }

    // Category filter
    if (category && category !== 'all' && category.trim() !== '') {
      query.category = { $in: [category] }
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i')
      query.$or = [
        { title: searchRegex },
        { titleNormalized: searchRegex },
        { author: { $in: [searchRegex] } },
        { tags: { $in: [searchRegex] } },
        { description: searchRegex }
      ]
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

      query.lastMentionedAt = { $gte: dateThreshold }
    }

    // Build sort object
    let sortObj: any = {}
    switch (sort) {
      case 'mentionCount':
      case 'mentions':
        sortObj.mentionCount = sortOrder === 'asc' ? 1 : -1
        break
      case 'trendScore':
      case 'trend':
        sortObj.trendScore = sortOrder === 'asc' ? 1 : -1
        break
      case 'publishedYear':
      case 'newest':
        sortObj.publishedYear = sortOrder === 'asc' ? 1 : -1
        break
      case 'title':
        sortObj.title = sortOrder === 'asc' ? 1 : -1
        break
      case 'lastMentionedAt':
      case 'recent':
        sortObj.lastMentionedAt = sortOrder === 'asc' ? 1 : -1
        break
      default:
        sortObj.mentionCount = -1
    }

    // Execute query with pagination
    const skip = (pageNum - 1) * limitNum

    const [books, totalBooks] = await Promise.all([
      Book.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      Book.countDocuments(query)
    ])


    // Convert ObjectId to numeric ID and add rank
    const booksWithNumericId: BookWithNumericId[] = books.map((book, index) => {
      // Convert last 8 characters of ObjectId to numeric ID
      const hexSuffix = book._id.toString().slice(-8)
      const numericId = parseInt(hexSuffix, 16)

      return {
        ...book,
        id: numericId,
        rank: skip + index + 1,
        _id: book._id.toString()
      }
    })

    const totalPages = Math.ceil(totalBooks / limitNum)

    const response = {
      success: true,
      data: booksWithNumericId,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalBooks,
        totalPages,
        hasMore: pageNum < totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      meta: {
        totalBooks,
        filteredCount: totalBooks,
        appliedFilters: {
          category: category || null,
          search: search || null,
          period,
          sort
        },
        lastUpdated: new Date().toISOString()
      }
    }

    return res.json(response)
  })

  getBookById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params

    let book

    // Check if id is a valid ObjectId
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      // It's an ObjectId
      book = await Book.findById(id).lean().exec()
    } else {
      // It's a numeric ID, need to find by converting
      const numericId = parseInt(id)
      if (isNaN(numericId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid book ID format'
        })
      }

      // Find book by converting ObjectId to numeric
      const books = await Book.find({}).select('_id title').lean().limit(1000).exec()
      const foundBook = books.find(b => {
        const hexSuffix = b._id.toString().slice(-8)
        const derivedNumericId = parseInt(hexSuffix, 16)
        return derivedNumericId === numericId
      })

      if (foundBook) {
        book = await Book.findById(foundBook._id).lean().exec()
      }
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    // Convert to numeric ID format
    const hexSuffix = book._id.toString().slice(-8)
    const numericId = parseInt(hexSuffix, 16)

    const bookWithNumericId: BookWithNumericId = {
      ...book,
      id: numericId,
      _id: book._id.toString()
    }

    return res.json({
      success: true,
      data: bookWithNumericId
    })
  })
}

export default new BooksController()