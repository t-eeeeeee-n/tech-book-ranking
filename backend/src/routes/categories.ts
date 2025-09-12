import { Router } from 'express'
import categoryController from '@/controllers/categoryController'

const router = Router()

// GET /api/categories - Get all categories
router.get(
    '/',
    categoryController.getCategories
)

// GET /api/categories/:id - Get a specific category by ID or slug
router.get(
    '/:id',
    categoryController.getCategoryById
)

export default router