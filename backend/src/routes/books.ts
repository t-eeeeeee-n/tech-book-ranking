import { Router } from 'express'
import booksController from '@/controllers/booksController'
import { validateQuery } from '@/middleware/validation'
import { bookQuerySchema } from '@/middleware/validation'

const router = Router()

// GET /api/books - Get books with filtering, sorting, and pagination
router.get(
  '/',
  validateQuery(bookQuerySchema),
  booksController.getBooks
)

// GET /api/books/:id - Get a specific book by ID (no validation needed as we handle both ObjectId and numeric)
router.get(
  '/:id',
  booksController.getBookById
)

export default router