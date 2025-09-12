import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { apiConfig } from '@/utils/config'

export interface AdminUser {
  id: string
  username: string
  role: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export class AuthService {
  private readonly jwtSecret: string
  private readonly jwtExpiry: string = '24h'
  private readonly saltRounds: number = 12

  // In a real application, these would come from a database
  // For simplicity, we're using hardcoded admin credentials
  private readonly adminUsers: Record<string, { id: string; username: string; passwordHash: string; role: string }> = {
    admin: {
      id: 'admin-001',
      username: 'admin',
      passwordHash: '',
      role: 'admin',
    },
  }

  constructor() {
    // ← ここで「必ず」存在確認して型を string に絞る
    const secret = apiConfig.jwt.secret ?? process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT secret is not configured')
    }
    this.jwtSecret = secret

    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123'
    // constructor で await できないので、同期的に済ませるなら hashSync を使うのもアリ
    this.initializeAdminUser(defaultPassword)
  }

  private async initializeAdminUser(password: string): Promise<void> {
    try {
      const passwordHash = await bcrypt.hash(password, this.saltRounds)
      this.adminUsers.admin.passwordHash = passwordHash
    } catch (error) {
      console.error('Failed to initialize admin user:', error)
      throw new Error('Authentication system initialization failed')
    }
  }

  /**
   * Authenticate user with username and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: AdminUser; tokens: AuthTokens } | null> {
    try {
      const { username, password } = credentials

      // Find user
      const userRecord = this.adminUsers[username.toLowerCase()]
      if (!userRecord) {
        return null
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash)
      if (!isPasswordValid) {
        return null
      }

      // Create user object (without password hash)
      const user: AdminUser = {
        id: userRecord.id,
        username: userRecord.username,
        role: userRecord.role
      }

      // Generate tokens
      const tokens = this.generateTokens(user)

      return { user, tokens }
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  /**
   * Generate JWT access token
   */
  private generateTokens(user: AdminUser): AuthTokens {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    }

    // jwtSecret は上で string に絞れているので OK
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
      issuer: 'techbook-ranking',
      audience: 'admin'
    } as jwt.SignOptions)

    return { accessToken }
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): AdminUser | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'techbook-ranking',
        audience: 'admin'
      }) as jwt.JwtPayload & {
        id: string
        username: string
        role: string
      }

      return {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return null
    }
  }

  /**
   * Check if user has required role
   */
  hasRole(user: AdminUser, requiredRole: string): boolean {
    return user.role === requiredRole || user.role === 'admin'
  }

  /**
   * Generate secure cookie options
   */
  getCookieOptions(isProduction: boolean = false) {
    return {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    }
  }
}

export const authService = new AuthService()