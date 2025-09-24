import { Request, Response } from 'express'
import rankingsService from '@/services/rankingsService'
import { RankingsQueryParams } from '@/types'
import { asyncHandler } from '@/middleware/errorHandler'

interface RankingsFilters {
    type: 'overall' | 'category' | 'trending' | 'newcomer'
    category?: string
    period: 'all' | 'year' | 'month' | 'week'
    limit: number
}

class RankingsController {
    getRankings = asyncHandler(async (req: Request<any, any, any, RankingsQueryParams>, res: Response) => {
        const {
            type = 'overall',
            category,
            period = 'all',
            limit = '20'
        } = req.query

        const filters: RankingsFilters = {
            type: type as 'overall' | 'category' | 'trending' | 'newcomer',
            category: category || undefined,
            period: period as 'all' | 'year' | 'month' | 'week',
            limit: parseInt(limit, 10)
        }

        const result = await rankingsService.getRankings(filters)
        res.json(result)
    })
}

export default new RankingsController()