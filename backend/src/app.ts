import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import { serverConfig } from '@/utils/config'
import { errorHandler } from '@/middleware/errorHandler'
import bookRoutes from '@/routes/books'
import rankingsRoutes from '@/routes/rankings'
import categoriesRoutes from '@/routes/categories'
import { authRoutes } from '@/routes/auth'
import seedRoutes from '@/routes/seedRoutes'

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(cors({
    origin: serverConfig.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

// Cookie parsing middleware
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
    windowMs: serverConfig.rateLimit.windowMs,
    max: serverConfig.rateLimit.max,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (serverConfig.env === 'development') {
    app.use(morgan('dev'))
} else {
    app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        env: serverConfig.env
    })
})

// API health check
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'API is operational',
        timestamp: new Date().toISOString(),
        services: {
            auth: 'available',
            books: 'available',
            rankings: 'available'
        }
    })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/rankings', rankingsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/seed', seedRoutes)

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.baseUrl} not found`
    })
})

// Global error handler (must be last)
app.use(errorHandler)

export default app