import { Request, Response } from 'express'
import bookService from '@/services/bookService'
import { BookQueryParams, BookFilters, Book } from '@/types'
import { asyncHandler } from '@/middleware/errorHandler'
import { BookMention, QiitaArticle } from '@/models'

class BookController {
    getBooks = asyncHandler(async (req: Request<any, any, any, BookQueryParams>, res: Response) => {
        const { 
            page = '1', 
            limit = '20', 
            category, 
            search, 
            period = 'all', 
            sort = 'mentionCount',
            sortOrder = 'desc'
        } = req.query

        const filters: BookFilters = {
            category: category || undefined,
            search: search || undefined,
            period: period || 'all',
            sort: sort || 'mentionCount',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
        }

        const pageNum = parseInt(page, 10)
        const limitNum = parseInt(limit, 10)

        const result = await bookService.getBooks(filters, pageNum, limitNum)
        res.json(result)
    })

    getBookById = asyncHandler(async (req: Request<any, any, any>, res: Response) => {
        const { id } = req.params
        const result = await bookService.getBookById(id)
        res.json(result)
    })

    createBook = asyncHandler(async (req: Request<any, any, Partial<Book>>, res: Response) => {
        const bookData = req.body
        const result = await bookService.createBook(bookData)
        res.status(201).json(result)
    })

    updateBook = asyncHandler(async (req: Request<any, any, Partial<Book>>, res: Response) => {
        const { id } = req.params
        const bookData = req.body
        const result = await bookService.updateBook(id, bookData)
        res.json(result)
    })

    deleteBook = asyncHandler(async (req: Request<any, any, any>, res: Response) => {
        const { id } = req.params
        await bookService.deleteBook(id)
        res.status(204).send()
    })

    getBookMentions = asyncHandler(async (req: Request<any, any, any>, res: Response) => {
        const { id } = req.params

        // Find book mentions for this book
        const bookMentions = await BookMention.find({ bookId: id })
            .lean()
            .exec()

        // Get all article IDs to fetch article details
        const articleIds = bookMentions.map(mention => mention.articleId)
        
        // Fetch all articles in one query
        const articles = await QiitaArticle.find({ 
            _id: { $in: articleIds } 
        }).lean().exec()

        // Create a map for quick lookup
        const articleMap = new Map(articles.map(article => [article._id.toString(), article]))

        // Transform mentions to include article details
        const mentionsWithArticles = bookMentions.map(mention => {
            const article = articleMap.get(mention.articleId)
            return {
                id: mention._id.toString(),
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

        res.json({
            success: true,
            data: mentionsWithArticles,
            meta: {
                bookId: id,
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
        })
    })
}

export default new BookController()