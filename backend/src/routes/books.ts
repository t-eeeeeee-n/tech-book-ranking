import { Router } from 'express'
import bookController from '@/controllers/bookController'
import { validateQuery, validateBody } from '@/middleware/validation'
import { bookQuerySchema, idParamSchema, createBookSchema, updateBookSchema } from '@/middleware/validation'
import { authenticateToken, requireAdmin } from '@/middleware/authMiddleware'

const router = Router()

// GET /api/books - Get a paginated list of books with filtering
router.get(
    '/',
    validateQuery(bookQuerySchema),
    bookController.getBooks
)

// GET /api/books/:id - Get a specific book by ID
router.get(
    '/:id',
    validateQuery(idParamSchema),
    bookController.getBookById
)

// GET /api/books/:id/mentions - Get mentions for a specific book
router.get(
    '/:id/mentions',
    validateQuery(idParamSchema),
    bookController.getBookMentions
)

// POST /api/books - Create a new book (Admin only)
router.post(
    '/',
    authenticateToken,
    requireAdmin,
    validateBody(createBookSchema),
    bookController.createBook
)

// PUT /api/books/:id - Update an existing book (Admin only)
router.put(
    '/:id',
    authenticateToken,
    requireAdmin,
    validateQuery(idParamSchema),
    validateBody(updateBookSchema),
    bookController.updateBook
)

// DELETE /api/books/:id - Soft delete a book (Admin only)
router.delete(
    '/:id',
    authenticateToken,
    requireAdmin,
    validateQuery(idParamSchema),
    bookController.deleteBook
)

export default router