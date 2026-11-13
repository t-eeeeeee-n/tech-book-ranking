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

// GET /api/books/:id/mentions - Get mentions for a specific book
router.get(
  '/:id/mentions',
  booksController.getBookMentions
)

export default router