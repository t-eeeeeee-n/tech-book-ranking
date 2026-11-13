import request from 'supertest'
import mongoose from 'mongoose'
import createTestApp from './utils/testApp'
import { createTestBook } from './utils/testHelpers'
import { Book, Ranking, Category } from '@/models'

const app = createTestApp()

describe.skip('/api/rankings', () => {
  let testBooks: any[]
  let testCategory: any

  beforeEach(async () => {
    // Create test categories
    testCategory = new Category({
      name: 'Programming',
      slug: 'programming'
    })
    await testCategory.save()

    // Also create web-development category for test data
    const webDevCategory = new Category({
      name: 'Web Development',
      slug: 'web-development'
    })
    await webDevCategory.save()

    // Create test books with different mention counts and categories
    testBooks = [
      await createTestBook({
        title: 'Clean Code',
        mentionCount: 100,
        trendScore: 150,
        category: ['programming'],
        firstMentionedAt: new Date('2024-01-01').toISOString(),
        lastMentionedAt: new Date('2024-01-15').toISOString()
      }),
      await createTestBook({
        title: 'Design Patterns',
        mentionCount: 80,
        trendScore: 120,
        category: ['programming'],
        firstMentionedAt: new Date('2024-01-02').toISOString(),
        lastMentionedAt: new Date('2024-01-10').toISOString()
      }),
      await createTestBook({
        title: 'JavaScript Guide',
        mentionCount: 60,
        trendScore: 100,
        category: ['web-development'],
        firstMentionedAt: new Date('2024-01-03').toISOString(),
        lastMentionedAt: new Date('2024-01-12').toISOString()
      }),
      await createTestBook({
        title: 'New React Book',
        mentionCount: 30,
        trendScore: 80,
        category: ['programming'],
        firstMentionedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        lastMentionedAt: new Date().toISOString()
      })
    ]
  })

  describe('GET /api/rankings', () => {
    it('should return overall rankings by default', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(4)
      expect(response.body.meta.type).toBe('overall')
      expect(response.body.meta.period).toBe('all')
      expect(response.body.meta.fromCache).toBe(false)

      // Should be sorted by mention count descending
      expect(response.body.data[0].title).toBe('Clean Code')
      expect(response.body.data[0].mentionCount).toBe(100)
      expect(response.body.data[0].rank).toBe(1)
      
      expect(response.body.data[1].title).toBe('Design Patterns')
      expect(response.body.data[1].mentionCount).toBe(80)
      expect(response.body.data[1].rank).toBe(2)
    })

    it('should return trending rankings', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ type: 'trending' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.type).toBe('trending')

      // Should be sorted by trend score descending
      expect(response.body.data[0].title).toBe('Clean Code')
      expect(response.body.data[0].trendScore).toBe(150)
      expect(response.body.data[1].title).toBe('Design Patterns')
      expect(response.body.data[1].trendScore).toBe(120)
    })

    it('should return category-specific rankings', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ type: 'category', category: 'programming' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.type).toBe('category')
      expect(response.body.meta.category).toBe('programming')

      // Should only include programming books
      expect(response.body.data).toHaveLength(3)
      expect(response.body.data.every((book: any) => 
        book.category.includes('programming')
      )).toBe(true)

      // Should not include web-development book
      expect(response.body.data.find((book: any) => 
        book.title === 'JavaScript Guide'
      )).toBeUndefined()
    })

    it('should return newcomer rankings', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ type: 'newcomer' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.type).toBe('newcomer')

      // Should include the recent book
      const recentBook = response.body.data.find((book: any) => 
        book.title === 'New React Book'
      )
      expect(recentBook).toBeTruthy()
    })

    it('should limit results based on limit parameter', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ limit: 2 })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.meta.limit).toBe(2)
    })

    it('should filter by period', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ period: 'week' })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.period).toBe('week')
      
      // Only books mentioned in the last week should be included
      // Based on our test data, only "New React Book" has recent mentions
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toBe('New React Book')
    })

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ type: 'invalid-type' })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })

    it('should validate limit parameter', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ limit: 150 }) // Over max limit
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid query parameters')
    })

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .query({ type: 'category', category: 'non-existent' })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Category not found')
    })

    it('should use cached rankings when available', async () => {
      // Create a cached ranking
      const cachedRanking = new Ranking({
        type: 'overall',
        period: 'all',
        rankings: [
          {
            bookId: testBooks[0]._id,
            rank: 1,
            score: 100,
            mentionCount: 100,
            trendScore: 150
          }
        ],
        totalBooks: 1,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now
      })
      await cachedRanking.save()

      const response = await request(app)
        .get('/api/rankings')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.fromCache).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toBe('Clean Code')
    })

    it('should regenerate rankings when cache is expired', async () => {
      // Create an expired cached ranking
      const expiredRanking = new Ranking({
        type: 'overall',
        period: 'all',
        rankings: [],
        totalBooks: 0,
        generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() - 1000) // Expired 1 second ago
      })
      await expiredRanking.save()

      const response = await request(app)
        .get('/api/rankings')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.meta.fromCache).toBe(false)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    it('should handle empty rankings gracefully', async () => {
      // Clear all books
      await Book.deleteMany({})

      const response = await request(app)
        .get('/api/rankings')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(0)
      expect(response.body.meta.totalBooks).toBe(0)
    })

    it('should return books with proper ranking data', async () => {
      const response = await request(app)
        .get('/api/rankings')
        .expect(200)

      const firstBook = response.body.data[0]
      
      // Check that book has all required fields
      expect(firstBook).toHaveProperty('id')
      expect(firstBook).toHaveProperty('title')
      expect(firstBook).toHaveProperty('author')
      expect(firstBook).toHaveProperty('rank')
      expect(firstBook).toHaveProperty('mentionCount')
      expect(firstBook).toHaveProperty('trendScore')
      
      // Check ranking-specific fields
      expect(typeof firstBook.rank).toBe('number')
      expect(firstBook.rank).toBeGreaterThan(0)
    })
  })

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Close the database connection to simulate an error
      await mongoose.connection.close()

      const response = await request(app)
        .get('/api/rankings')
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Failed to fetch rankings')

      // Reconnect for other tests
      if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI)
      }
    })
  })
})