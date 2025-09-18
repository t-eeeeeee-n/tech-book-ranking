import { Router } from 'express'
import favoritesController from '@/controllers/favoritesController'
import { validateQuery, validateBody } from '@/middleware/validation'
import { favoritesQuerySchema, addFavoriteSchema, removeFavoriteSchema } from '@/middleware/validation'

const router = Router()


// GET /api/favorites?userId=xxx - Get user's favorites
router.get(
    '/',
    validateQuery(favoritesQuerySchema),
    favoritesController.getFavorites
)

// POST /api/favorites - Add book to favorites
router.post(
    '/',
    validateBody(addFavoriteSchema),
    favoritesController.addFavorite
)

// DELETE /api/favorites - Remove book from favorites
router.delete(
    '/',
    validateBody(removeFavoriteSchema),
    favoritesController.removeFavorite
)

export default router