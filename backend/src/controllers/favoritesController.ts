import { Request, Response } from 'express'
import favoritesService from '@/services/favoritesService'
import {
  FavoriteQueryParams,
  AddFavoriteBody,
  RemoveFavoriteBody
} from '@/types'
import { asyncHandler } from '@/middleware/errorHandler'

class FavoritesController {
  // GET /api/favorites?userId=xxx
  getFavorites = asyncHandler(async (req: Request<{}, {}, {}, FavoriteQueryParams>, res: Response) => {
    const { userId } = req.query

    const result = await favoritesService.getUserFavorites(userId!)
    return res.json(result)
  })

  // POST /api/favorites
  addFavorite = asyncHandler(async (req: Request<{}, {}, AddFavoriteBody>, res: Response) => {
    const { userId, bookId } = req.body

    const result = await favoritesService.addFavorite(userId, bookId)

    return res.status(201).json(result)
  })

  // DELETE /api/favorites
  removeFavorite = asyncHandler(async (req: Request<{}, {}, RemoveFavoriteBody>, res: Response) => {
    const { userId, bookId } = req.body

    const result = await favoritesService.removeFavorite(userId, bookId)
    return res.json(result)
  })
}

export default new FavoritesController()