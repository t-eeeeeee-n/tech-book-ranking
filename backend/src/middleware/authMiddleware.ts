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

/**
 * Authorization middleware - checks user role
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
          error: 'No user in request'
        })
        return
      }

      if (!authService.hasRole(user, requiredRole)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          error: `Role '${requiredRole}' required`
        })
        return
      }

      next()
    } catch (error) {
      console.error('Authorization middleware error:', error)
      res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: 'Internal server error'
      })
    }
  }
}

/**
 * Admin role middleware - shorthand for requireRole('admin')
 */
export const requireAdmin = requireRole('admin')

/**
 * Optional authentication middleware - attaches user if token exists but doesn't fail if not
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.authToken

    if (token) {
      const user = authService.verifyToken(token)
      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    // Continue without authentication
    next()
  }
}