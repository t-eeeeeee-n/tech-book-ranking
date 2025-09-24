import { Book, Ranking, Category } from '@/models'
import mongoose from 'mongoose'

interface RankingGenerationOptions {
    periods?: Array<'all' | 'year' | 'month' | 'week'>
    types?: Array<'overall' | 'category' | 'trending' | 'newcomer'>
    categories?: string[]
    maxBooks?: number
    cacheHours?: number
}

interface RankingGenerationResult {
    success: boolean
    generatedRankings: number
    updatedRankings: number
    errors: string[]
    summary: string
    metadata: {
        totalBooks: number
        categories: number
        periods: string[]
        types: string[]
        processingTimeMs: number
    }
}

export class RankingGenerationService {
    async generateAllRankings(options: RankingGenerationOptions = {}): Promise<RankingGenerationResult> {
        const startTime = Date.now()
        const {
            periods = ['all', 'year', 'month', 'week'],
            types = ['overall', 'category', 'trending', 'newcomer'],
            maxBooks = 1000,
            cacheHours = 24
        } = options

        const errors: string[] = []
        let generatedRankings = 0
        let updatedRankings = 0

        try {
            // Get all active categories
            const categories = await Category.find({}).lean()
            const totalBooks = await Book.countDocuments({ status: 'active' })

            console.log(`🚀 Starting ranking generation for ${totalBooks} books`)
            console.log(`📊 Periods: ${periods.join(', ')}`)
            console.log(`🏆 Types: ${types.join(', ')}`)

            // Generate rankings for each combination
            for (const period of periods) {
                for (const type of types) {
                    try {
                        if (type === 'category') {
                            // Generate category-specific rankings
                            for (const category of categories) {
                                const result = await this.generateCategoryRanking(
                                    period,
                                    category.slug,
                                    category._id as mongoose.Types.ObjectId,
                                    maxBooks,
                                    cacheHours
                                )
                                if (result.isNew) {
                                    generatedRankings++
                                } else {
                                    updatedRankings++
                                }
                            }
                        } else {
                            // Generate overall, trending, or newcomer rankings
                            const result = await this.generateRankingByType(
                                type,
                                period,
                                maxBooks,
                                cacheHours
                            )
                            if (result.isNew) {
                                generatedRankings++
                            } else {
                                updatedRankings++
                            }
                        }
                    } catch (error) {
                        const errorMsg = `Failed to generate ${type} ranking for ${period}: ${error}`
                        console.error(errorMsg)
                        errors.push(errorMsg)
                    }
                }
            }

            const processingTime = Date.now() - startTime

            return {
                success: errors.length === 0,
                generatedRankings,
                updatedRankings,
                errors,
                summary: `Generated ${generatedRankings} new rankings and updated ${updatedRankings} existing ones`,
                metadata: {
                    totalBooks,
                    categories: categories.length,
                    periods,
                    types,
                    processingTimeMs: processingTime
                }
            }
        } catch (error: any) {
            const processingTime = Date.now() - startTime
            return {
                success: false,
                generatedRankings,
                updatedRankings,
                errors: [...errors, error.message || 'Unknown error'],
                summary: 'Ranking generation failed',
                metadata: {
                    totalBooks: 0,
                    categories: 0,
                    periods,
                    types,
                    processingTimeMs: processingTime
                }
            }
        }
    }

    private async generateRankingByType(
        type: 'overall' | 'trending' | 'newcomer',
        period: string,
        maxBooks: number,
        cacheHours: number
    ) {
        const now = new Date()
        const expiresAt = new Date(now.getTime() + cacheHours * 60 * 60 * 1000)

        // Check if we have a recent ranking
        const existing = await Ranking.findOne({
            type,
            period,
            categoryId: { $exists: false }
        }).sort({ generatedAt: -1 })

        const shouldRegenerate = !existing || 
            existing.expiresAt <= now ||
            (now.getTime() - existing.generatedAt.getTime()) > (cacheHours * 60 * 60 * 1000)

        if (!shouldRegenerate) {
            console.log(`⏭️  Skipping ${type} ranking for ${period} (still fresh)`)
            return { isNew: false }
        }

        console.log(`🔄 Generating ${type} ranking for ${period}...`)

        // Build query and sort based on type
        const query: any = { status: 'active' }
        let sortCriteria: any = {}

        // Apply period filter
        if (period !== 'all') {
            const periodStart = this.getPeriodStartDate(period)
            query.lastMentionedAt = { $gte: periodStart }
        }

        // Apply type-specific logic
        switch (type) {
            case 'overall':
                sortCriteria = { mentionCount: -1, trendScore: -1, _id: 1 }
                break
            case 'trending':
                sortCriteria = { trendScore: -1, mentionCount: -1, _id: 1 }
                break
            case 'newcomer': {
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                query.firstMentionedAt = { $gte: thirtyDaysAgo }
                sortCriteria = { firstMentionedAt: -1, mentionCount: -1, _id: 1 }
                break
            }
        }

        // Fetch and rank books
        const books = await Book.find(query)
            .sort(sortCriteria)
            .limit(maxBooks)
            .select('_id mentionCount trendScore firstMentionedAt')
            .lean()

        // Create ranking entries
        const rankings = books.map((book, index) => ({
            bookId: book._id,
            rank: index + 1,
            score: this.calculateScore(book, type),
            mentionCount: book.mentionCount || 0,
            trendScore: book.trendScore || 0
        }))

        // Save or update ranking
        if (existing) {
            await Ranking.findByIdAndUpdate(existing._id, {
                rankings,
                totalBooks: books.length,
                generatedAt: now,
                expiresAt
            })
            console.log(`✅ Updated ${type} ranking for ${period} (${books.length} books)`)
            return { isNew: false }
        } else {
            const ranking = new Ranking({
                type,
                period,
                rankings,
                totalBooks: books.length,
                generatedAt: now,
                expiresAt
            })
            await ranking.save()
            console.log(`✅ Generated new ${type} ranking for ${period} (${books.length} books)`)
            return { isNew: true }
        }
    }

    private async generateCategoryRanking(
        period: string,
        categorySlug: string,
        categoryId: mongoose.Types.ObjectId,
        maxBooks: number,
        cacheHours: number
    ) {
        const now = new Date()
        const expiresAt = new Date(now.getTime() + cacheHours * 60 * 60 * 1000)

        // Check if we have a recent ranking
        const existing = await Ranking.findOne({
            type: 'category',
            period,
            categoryId
        }).sort({ generatedAt: -1 })

        const shouldRegenerate = !existing || 
            existing.expiresAt <= now ||
            (now.getTime() - existing.generatedAt.getTime()) > (cacheHours * 60 * 60 * 1000)

        if (!shouldRegenerate) {
            console.log(`⏭️  Skipping category ranking for ${categorySlug}/${period} (still fresh)`)
            return { isNew: false }
        }

        console.log(`🔄 Generating category ranking for ${categorySlug}/${period}...`)

        // Build query for category books
        const query: any = {
            status: 'active',
            category: { $in: [categorySlug] }
        }

        // Apply period filter
        if (period !== 'all') {
            const periodStart = this.getPeriodStartDate(period)
            query.lastMentionedAt = { $gte: periodStart }
        }

        const books = await Book.find(query)
            .sort({ mentionCount: -1, trendScore: -1, _id: 1 })
            .limit(maxBooks)
            .select('_id mentionCount trendScore')
            .lean()

        // Create ranking entries
        const rankings = books.map((book, index) => ({
            bookId: book._id,
            rank: index + 1,
            score: book.mentionCount || 0,
            mentionCount: book.mentionCount || 0,
            trendScore: book.trendScore || 0
        }))

        // Save or update ranking
        if (existing) {
            await Ranking.findByIdAndUpdate(existing._id, {
                rankings,
                totalBooks: books.length,
                generatedAt: now,
                expiresAt
            })
            console.log(`✅ Updated category ranking for ${categorySlug}/${period} (${books.length} books)`)
            return { isNew: false }
        } else {
            const ranking = new Ranking({
                type: 'category',
                categoryId,
                period,
                rankings,
                totalBooks: books.length,
                generatedAt: now,
                expiresAt
            })
            await ranking.save()
            console.log(`✅ Generated new category ranking for ${categorySlug}/${period} (${books.length} books)`)
            return { isNew: true }
        }
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
                return new Date(0)
        }
    }

    private calculateScore(book: any, type: string): number {
        switch (type) {
            case 'trending':
                return book.trendScore || 0
            case 'newcomer': {
                const daysSinceFirst = book.firstMentionedAt
                    ? Math.max(1, Math.floor((Date.now() - new Date(book.firstMentionedAt).getTime()) / (1000 * 60 * 60 * 24)))
                    : 365
                return Math.floor((book.mentionCount || 0) * (30 / daysSinceFirst))
            }
            default:
                return book.mentionCount || 0
        }
    }

    /**
     * Clean up old/expired rankings
     */
    async cleanupOldRankings(): Promise<{ deletedCount: number }> {
        const now = new Date()
        const result = await Ranking.deleteMany({
            expiresAt: { $lt: now }
        })
        
        console.log(`🧹 Cleaned up ${result.deletedCount} expired rankings`)
        return { deletedCount: result.deletedCount || 0 }
    }
}

export default new RankingGenerationService()