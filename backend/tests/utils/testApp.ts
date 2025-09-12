import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { errorHandler } from '@/middleware/errorHandler'
import bookRoutes from '@/routes/books'
import rankingsRoutes from '@/routes/rankings'

// Create test app without rate limiting and logging
const createTestApp = () => {
  const app = express()

  // Basic security middleware
  app.use(helmet())

  // Simple CORS for tests
  app.use(cors())

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Compression middleware
  app.use(compression())

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'Test server is healthy',
      timestamp: new Date().toISOString(),
      env: 'test'
    })
  })

  // API routes
  app.use('/api/books', bookRoutes)
  app.use('/api/rankings', rankingsRoutes)

  // Handle 404 routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    })
  })

  // Global error handler (must be last)
  app.use(errorHandler)

  return app
}

export default createTestApp