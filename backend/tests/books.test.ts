import request from 'supertest'
import mongoose from 'mongoose'
import createTestApp from './utils/testApp'
import { createTestBook, createMultipleTestBooks } from './utils/testHelpers'
import { mockBookData, mockBookData2, invalidBookData, duplicateIsbnData } from './fixtures/books'
import { Book } from '@/models'

const app = createTestApp()

// Test API key for authenticated routes
const TEST_API_KEY = 'test-api-key-123'

// Helper function to add API key header
const authenticatedRequest = (method: 'post' | 'put' | 'delete', url: string) => {
  return request(app)[method](url).set('x-api-key', TEST_API_KEY)
}

describe('/api/books', () => {
  describe('GET /api/books', () => {
    it('should return empty list when no books exist', async () => {
      const response = await request(app)
        .get('/api/books')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(0)
      expect(response.body.pagination.total).toBe(0)
    })

    it('should return list of books with pagination', async () => {
      await createMultipleTestBooks(5)

      const response = await request(app)
        .get('/api/books')
        .query({ page: 1, limit: 3 })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(3)
      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(3)
      expect(response.body.pagination.total).toBe(5)
      expect(response.body.pagination.totalPages).toBe(2)
      expect(response.body.pagination.hasNext).toBe(true)
      expect(response.body.pagination.hasPrev).toBe(false)
    })

    it('should filter books by category', async () => {
      await createTestBook({ category: ['programming'] })
      await createTestBook({ category: ['design'] })

      const response = await request(app)
        .get('/api/books')
        .query({ category: 'programming' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].category).toContain('programming')
    })

    it('should search books by text', async () => {
      await createTestBook({ title: 'Clean Code Principles' })
      await createTestBook({ title: 'Design Patterns' })

      const response = await request(app)
        .get('/api/books')
        .query({ search: 'Clean' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toContain('Clean')
    })

    it('should sort books by mention count descending by default', async () => {
      const books = await createMultipleTestBooks(3)

      const response = await request(app)
        .get('/api/books')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(3)
      expect(response.body.data[0].mentionCount).toBeGreaterThan(response.body.data[1].mentionCount)
      expect(response.body.data[1].mentionCount).toBeGreaterThan(response.body.data[2].mentionCount)
    })

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/api/books')
        .query({ page: -1, limit: 1000 })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })
  })

  describe('GET /api/books/:id', () => {
    it('should return a single book by valid ID', async () => {
      const book = await createTestBook()

      const response = await request(app)
        .get(`/api/books/${book._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBe(book._id.toString())
      expect(response.body.data.title).toBe(book.title)
    })

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .get(`/api/books/${nonExistentId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })

    it('should return 400 for invalid book ID format', async () => {
      const response = await request(app)
        .get('/api/books/invalid-id')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })
  })

  describe('POST /api/books', () => {
    it('should create a new book with valid data', async () => {
      const response = await authenticatedRequest('post', '/api/books')
        .send(mockBookData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(mockBookData.title)
      expect(response.body.data.author).toEqual(mockBookData.author)
      expect(response.body.data.isbn13).toBe(mockBookData.isbn13)
      expect(response.body.data.status).toBe('active')
      expect(response.body.data.mentionCount).toBe(0)
      expect(response.body.message).toBe('Book created successfully')

      // Verify book was saved to database
      const savedBook = await Book.findById(response.body.data.id)
      expect(savedBook).toBeTruthy()
      expect(savedBook?.title).toBe(mockBookData.title)
    })

    it('should handle author as string or array', async () => {
      const bookWithStringAuthor = {
        ...mockBookData,
        author: 'Single Author',
        isbn13: '9780123456789'
      }

      const response = await authenticatedRequest('post', '/api/books')
        .send(bookWithStringAuthor)
        .expect(201)

      expect(response.body.data.author).toEqual(['Single Author'])
    })

    it('should handle category as string or array', async () => {
      const bookWithStringCategory = {
        ...mockBookData,
        category: 'programming',
        isbn13: '9780123456788'
      }

      const response = await authenticatedRequest('post', '/api/books')
        .send(bookWithStringCategory)
        .expect(201)

      expect(response.body.data.category).toEqual(['programming'])
    })

    it('should reject invalid book data', async () => {
      const response = await authenticatedRequest('post', '/api/books')
        .send(invalidBookData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid request body')
    })

    it('should reject duplicate ISBN13', async () => {
      // Create first book
      await authenticatedRequest('post', '/api/books')
        .send(mockBookData)
        .expect(201)

      // Try to create second book with same ISBN13
      const response = await authenticatedRequest('post', '/api/books')
        .send(duplicateIsbnData)
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('A book with this ISBN13 already exists')
    })

    it('should create books with no ISBN (allow duplicates)', async () => {
      const bookWithoutIsbn = {
        title: 'Book Without ISBN 1',
        author: ['Author 1'],
        category: ['programming']
      }

      const book2WithoutIsbn = {
        title: 'Book Without ISBN 2',
        author: ['Author 2'],
        category: ['programming']
      }

      await authenticatedRequest('post', '/api/books')
        .send(bookWithoutIsbn)
        .expect(201)

      await authenticatedRequest('post', '/api/books')
        .send(book2WithoutIsbn)
        .expect(201)

      const books = await Book.find({ isbn13: { $exists: false } })
      expect(books).toHaveLength(2)
    })

    it('should return 401 without API key', async () => {
      const response = await request(app)
        .post('/api/books')
        .send(mockBookData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('API key is required')
    })

    it('should return 401 with invalid API key', async () => {
      const response = await request(app)
        .post('/api/books')
        .set('x-api-key', 'invalid-key')
        .send(mockBookData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid API key')
    })
  })

  describe('PUT /api/books/:id', () => {
    it('should update an existing book with valid data', async () => {
      const book = await createTestBook()
      const updateData = {
        title: 'Updated Clean Code',
        description: 'Updated description'
      }

      const response = await authenticatedRequest('put', `/api/books/${book._id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe('Updated Clean Code')
      expect(response.body.data.description).toBe('Updated description')
      expect(response.body.data.isbn13).toBe(book.isbn13) // Unchanged
      expect(response.body.message).toBe('Book updated successfully')

      // Verify database update
      const updatedBook = await Book.findById(book._id)
      expect(updatedBook?.title).toBe('Updated Clean Code')
      expect(updatedBook?.description).toBe('Updated description')
    })

    it('should allow partial updates', async () => {
      const book = await createTestBook()
      const originalTitle = book.title

      const response = await authenticatedRequest('put', `/api/books/${book._id}`)
        .send({ description: 'Only updating description' })
        .expect(200)

      expect(response.body.data.title).toBe(originalTitle) // Unchanged
      expect(response.body.data.description).toBe('Only updating description')
    })

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await authenticatedRequest('put', `/api/books/${nonExistentId}`)
        .send({ title: 'Updated Title' })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })

    it('should return 400 for invalid book ID', async () => {
      const response = await authenticatedRequest('put', '/api/books/invalid-id')
        .send({ title: 'Updated Title' })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })

    it('should reject duplicate ISBN13 on update', async () => {
      const book1 = await createTestBook({ isbn13: '9780132350884' })
      const book2 = await createTestBook({ isbn13: '9780201616224' })

      const response = await authenticatedRequest('put', `/api/books/${book2._id}`)
        .send({ isbn13: '9780132350884' }) // Try to use book1's ISBN
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('A book with this ISBN13 already exists')
    })

    it('should validate update data', async () => {
      const book = await createTestBook()

      const response = await authenticatedRequest('put', `/api/books/${book._id}`)
        .send({ isbn13: 'invalid-isbn-format' })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid request body')
    })

    it('should return 401 without API key', async () => {
      const book = await createTestBook()

      const response = await request(app)
        .put(`/api/books/${book._id}`)
        .send({ title: 'Updated Title' })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('API key is required')
    })
  })

  describe('DELETE /api/books/:id', () => {
    it('should soft delete an existing book', async () => {
      const book = await createTestBook()

      const response = await authenticatedRequest('delete', `/api/books/${book._id}`)
        .expect(204)

      // Verify no response body for 204
      expect(response.body).toEqual({})

      // Verify book is soft deleted (status = inactive)
      const deletedBook = await Book.findById(book._id)
      expect(deletedBook).toBeTruthy()
      expect(deletedBook?.status).toBe('inactive')

      // Verify book doesn't appear in GET requests
      const getResponse = await request(app)
        .get('/api/books')
        .expect(200)

      expect(getResponse.body.data).toHaveLength(0)
    })

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = new mongoose.Types.ObjectId()

      const response = await authenticatedRequest('delete', `/api/books/${nonExistentId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })

    it('should return 404 for already deleted book', async () => {
      const book = await createTestBook()

      // First deletion should succeed
      await authenticatedRequest('delete', `/api/books/${book._id}`)
        .expect(204)

      // Second deletion should return 404
      const response = await authenticatedRequest('delete', `/api/books/${book._id}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Book not found')
    })

    it('should return 400 for invalid book ID', async () => {
      const response = await authenticatedRequest('delete', '/api/books/invalid-id')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })

    it('should return 401 without API key', async () => {
      const book = await createTestBook()

      const response = await request(app)
        .delete(`/api/books/${book._id}`)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('API key is required')
    })
  })

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Close the database connection to simulate an error
      await mongoose.connection.close()

      const response = await request(app)
        .get('/api/books')
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Failed to fetch books')

      // Reconnect for other tests
      if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI)
      }
    })

    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Route GET /api/nonexistent not found')
    })
  })
})