import { Request, Response, NextFunction } from 'express'
import { authService, AdminUser } from '@/services/authService'

// Extend Express Request type to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AdminUser
    }
  }
}

/**
 * Authentication middleware - verifies JWT token from cookies
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from cookie
    const token = req.cookies?.authToken

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No token provided'
      })
      return
    }

    // Verify token
    const user = authService.verifyToken(token)
    
    if (!user) {
      // Clear invalid cookie
      res.clearCookie('authToken')
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: 'Token verification failed'
      })
      return
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: 'Internal server error'
    })
  }
}


