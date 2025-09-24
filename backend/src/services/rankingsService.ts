import { Book, Ranking, Category } from '@/models'
import { Book as IBook } from '@/types'
import { createError } from '@/middleware/errorHandler'
import mongoose from 'mongoose'

interface RankingsFilters {
    type: 'overall' | 'category' | 'trending' | 'newcomer'
    category?: string
    period: 'all' | 'year' | 'month' | 'week'
    limit: number
}

interface RankingsResponse {
    success: boolean
    data: IBook[]
    meta: {
        type: string
        category?: string
        period: string
        limit: number
        totalBooks: number
        generatedAt?: string
        fromCache: boolean
    }
}

export class RankingsService {
    async getRankings(filters: RankingsFilters): Promise<RankingsResponse> {
        try {
            // Try to get from cache first
            const cachedRanking = await this.getCachedRanking(filters)
            
            if (cachedRanking && !this.isCacheExpired(cachedRanking.expiresAt)) {
                const books = await this.getBooksFromRanking(cachedRanking, filters.limit)
                return {
                    success: true,
                    data: books,
                    meta: {
                        type: filters.type,
                        category: filters.category,
                        period: filters.period,
                        limit: filters.limit,
                        totalBooks: cachedRanking.totalBooks,
                        generatedAt: cachedRanking.generatedAt.toISOString(),
                        fromCache: true
                    }
                }
            }

            // Generate fresh ranking if no valid cache
            const freshRanking = await this.generateFreshRanking(filters)
            const books = await this.getBooksFromRanking(freshRanking, filters.limit)

            return {
                success: true,
                data: books,
                meta: {
                    type: filters.type,
                    category: filters.category,
                    period: filters.period,
                    limit: filters.limit,
                    totalBooks: freshRanking.totalBooks,
                    generatedAt: freshRanking.generatedAt.toISOString(),
                    fromCache: false
                }
            }
        } catch (error) {
            console.error('Error in RankingsService.getRankings:', error)
            throw createError('Failed to fetch rankings', 500)
        }
    }

    private async getCachedRanking(filters: RankingsFilters) {
        const query: any = {
            type: filters.type,
            period: filters.period,
            expiresAt: { $gt: new Date() } // Not expired
        }

        // Handle category filter
        if (filters.type === 'category' && filters.category) {
            // Find category by slug or name
            const category = await Category.findOne({
                $or: [
                    { slug: filters.category },
                    { name: { $regex: new RegExp(`^${filters.category}$`, 'i') } }
                ]
            })

            if (category) {
                query.categoryId = category._id
            } else {
                // No matching category found
                return null
            }
        } else if (filters.type !== 'category') {
            query.categoryId = { $exists: false }
        }

        return await Ranking.findOne(query).sort({ generatedAt: -1 }).lean()
    }

    private isCacheExpired(expiresAt: Date): boolean {
        return new Date() > expiresAt
    }

    private async getBooksFromRanking(ranking: any, limit: number): Promise<IBook[]> {
        // Get book IDs from ranking, limited by requested limit
        const bookIds = ranking.rankings
            .slice(0, limit)
            .map((r: any) => r.bookId)

        // Fetch full book details
        const books = await Book.find({
            _id: { $in: bookIds },
            status: 'active'
        }).lean()

        // Create a map for quick lookup
        const bookMap = new Map(books.map(book => [book._id.toString(), book]))

        // Return books in ranking order with rank information
        const rankedBooks: IBook[] = []
        
        for (let i = 0; i < Math.min(ranking.rankings.length, limit); i++) {
            const rankingEntry = ranking.rankings[i]
            const book = bookMap.get(rankingEntry.bookId.toString())
            
            if (book) {
                rankedBooks.push({
                    ...book.toObject(),
                    id: book._id.toString(),
                    _id: book._id.toString(),
                    rank: rankingEntry.rank,
                    mentionCount: rankingEntry.mentionCount,
                    trendScore: rankingEntry.trendScore || book.trendScore
                } as IBook & { rank: number })
            }
        }

        return rankedBooks
    }

    private async generateFreshRanking(filters: RankingsFilters) {
        const now = new Date()
        const cacheExpiration = new Date(now.getTime() + 1000 * 60 * 60) // 1 hour cache

        const query: any = { status: 'active' }
        let sortCriteria: any = {}
        let categoryId: mongoose.Types.ObjectId | undefined

        // Handle category filtering
        if (filters.type === 'category' && filters.category) {
            const category = await Category.findOne({
                $or: [
                    { slug: filters.category },
                    { name: { $regex: new RegExp(`^${filters.category}$`, 'i') } }
                ]
            })

            if (category) {
                query.category = { $in: [filters.category] }
                categoryId = category._id as mongoose.Types.ObjectId
            } else {
                throw createError('Category not found', 404)
            }
        }

        // Handle period filtering
        if (filters.period !== 'all') {
            const periodStartDate = this.getPeriodStartDate(filters.period)
            query.lastMentionedAt = { $gte: periodStartDate }
        }

        // Handle ranking type
        switch (filters.type) {
            case 'overall':
            case 'category':
                sortCriteria = { mentionCount: -1, trendScore: -1 }
                break
            case 'trending':
                sortCriteria = { trendScore: -1, mentionCount: -1 }
                break
            case 'newcomer': {
                // Books mentioned for the first time recently
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                query.firstMentionedAt = { $gte: thirtyDaysAgo }
                sortCriteria = { firstMentionedAt: -1, mentionCount: -1 }
                break
            }
        }

        // Fetch and rank books
        const books = await Book.find(query)
            .sort(sortCriteria)
            .limit(1000) // Reasonable limit for ranking generation
            .lean()

        // Create ranking entries
        const rankings = books.map((book, index) => ({
            bookId: book._id,
            rank: index + 1,
            score: this.calculateScore(book, filters.type),
            mentionCount: book.mentionCount || 0,
            trendScore: book.trendScore || 0
        }))

        // Save to cache
        const rankingDoc = new Ranking({
            type: filters.type,
            categoryId,
            period: filters.period,
            rankings,
            totalBooks: books.length,
            generatedAt: now,
            expiresAt: cacheExpiration
        })

        await rankingDoc.save()
        return rankingDoc.toObject()
    }

    private getPeriodStartDate(period: string): Date {
        const now = new Date()
        
        switch (period) {
            case 'week':
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), 1)
            case 'year':
                return new Date(now.getFullYear(), 0, 1)
            default:
                return new Date(0) // Beginning of time
        }
    }

    private calculateScore(book: any, type: string): number {
        switch (type) {
            case 'trending':
                return book.trendScore || 0
            case 'newcomer': {
                // Score based on recency and initial popularity
                const daysSinceFirst = book.firstMentionedAt
                    ? Math.max(1, Math.floor((Date.now() - new Date(book.firstMentionedAt).getTime()) / (1000 * 60 * 60 * 24)))
                    : 365
                return Math.floor(book.mentionCount * (30 / daysSinceFirst))
            }
            default:
                return book.mentionCount || 0
        }
    }
}

export default new RankingsService()