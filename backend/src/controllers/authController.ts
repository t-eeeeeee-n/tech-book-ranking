import { Request, Response } from 'express'
import { authService, LoginCredentials } from '@/services/authService'
import Joi from 'joi'

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(100).required()
})

export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate admin user and set secure cookie
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = loginSchema.validate(req.body)
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          error: error.details[0].message
        })
        return
      }

      const credentials: LoginCredentials = value

      // Attempt authentication
      const result = await authService.login(credentials)
      
      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          error: 'Username or password is incorrect'
        })
        return
      }

      const { user, tokens } = result

      // Set secure HTTP-only cookie
      const isProduction = process.env.NODE_ENV === 'production'
      const cookieOptions = authService.getCookieOptions(isProduction)
      
      res.cookie('authToken', tokens.accessToken, cookieOptions)

      // Return success response (without token in body for security)
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: 'Internal server error'
      })
    }
  }

  /**
   * POST /api/auth/logout
   * Clear authentication cookie
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear the auth cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: 'Internal server error'
      })
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user info
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
          error: 'No user found in request'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      })
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user info',
        error: 'Internal server error'
      })
    }
  }

  /**
   * POST /api/auth/verify
   * Verify if current session is valid (used by frontend)
   */
  async verifySession(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Session invalid',
          authenticated: false
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Session valid',
        authenticated: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      })
    } catch (error) {
      console.error('Verify session error:', error)
      res.status(500).json({
        success: false,
        message: 'Session verification failed',
        error: 'Internal server error'
      })
    }
  }
}

export const authController = new AuthController()