import express from 'express'
import { authController } from '@/controllers/authController'
import { authenticateToken, requireAdmin } from '@/middleware/authMiddleware'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// More restrictive rate limiting for login
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
    error: 'Login rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true
})

/**
 * @route POST /api/auth/login
 * @desc Authenticate admin user
 * @access Public (but rate limited)
 */
router.post('/login', loginRateLimit, authController.login.bind(authController))

/**
 * @route POST /api/auth/logout
 * @desc Logout current user
 * @access Private
 */
router.post('/logout', authRateLimit, authController.logout.bind(authController))

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @access Private
 */
router.get('/me', authenticateToken, authController.getCurrentUser.bind(authController))

/**
 * @route POST /api/auth/verify
 * @desc Verify current session
 * @access Private
 */
router.post('/verify', authenticateToken, authController.verifySession.bind(authController))

/**
 * @route GET /api/auth/status
 * @desc Check authentication status (health check)
 * @access Public
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication service is operational',
    timestamp: new Date().toISOString()
  })
})

export { router as authRoutes }