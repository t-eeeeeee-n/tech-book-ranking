import { Router } from 'express'
import rankingsController from '@/controllers/rankingsController'
import { validateQuery } from '@/middleware/validation'
import { rankingsQuerySchema } from '@/middleware/validation'

const router = Router()

// GET /api/rankings - Get book rankings with filtering
router.get(
    '/',
    validateQuery(rankingsQuerySchema),
    rankingsController.getRankings
)

export default router