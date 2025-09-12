import { Router } from 'express'
import seedController from '@/controllers/seedController'

const router = Router()

/**
 * @route   POST /api/seed/database
 * @desc    Seed database with sample data
 * @access  Public (開発環境のみ)
 */
router.post('/database', seedController.seedDatabase)

/**
 * @route   GET /api/seed/stats
 * @desc    Get database statistics
 * @access  Public
 */
router.get('/stats', seedController.getStats)

export default router