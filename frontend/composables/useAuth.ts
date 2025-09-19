interface User {
  id: string
  username: string
  role: string
}

interface ApiError {
  data?: {
    message?: string
  }
  message?: string
  status?: number
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null &&
    ('data' in error || 'message' in error || 'status' in error)
}

interface LoginCredentials {
  username: string
  password: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
  error?: string
}

export const useAuth = () => {
  // State
  const user = useState<User | null>('auth.user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  // Runtime config
  const config = useRuntimeConfig()
  const backendUrl = config.public.backendUrl || 'http://localhost:3001'

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        baseURL: backendUrl,
        body: credentials,
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.success && response.data?.user) {
        user.value = response.data.user
        return true
      }

      return false
    } catch (error: unknown) {
      console.error('Login failed:', error)

      // Handle specific error messages
      if (isApiError(error) && error.data?.message) {
        throw new Error(error.data.message)
      }

      throw new Error('Login failed. Please check your credentials.')
    }
  }

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        baseURL: backendUrl,
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Clear user state regardless of API call success
      user.value = null
      
      // Redirect to login page
      await navigateTo('/admin/login')
    }
  }

  /**
   * Check current authentication status
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/verify', {
        method: 'POST',
        baseURL: backendUrl,
        credentials: 'include'
      })

      if (response.success && response.data?.user) {
        user.value = response.data.user
        return true
      }

      user.value = null
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      user.value = null
      return false
    }
  }

  /**
   * Get current user info
   */
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/me', {
        method: 'GET',
        baseURL: backendUrl,
        credentials: 'include'
      })

      if (response.success && response.data?.user) {
        user.value = response.data.user
        return response.data.user
      }

      return null
    } catch (error) {
      console.error('Get current user failed:', error)
      return null
    }
  }

  /**
   * Check if user has specific role
   */
  const hasRole = (requiredRole: string): boolean => {
    if (!user.value) return false
    return user.value.role === requiredRole || user.value.role === 'admin'
  }

  /**
   * Check if user is admin
   */
  const isAdmin = computed(() => hasRole('admin'))

  /**
   * Protected fetch wrapper that includes authentication
   */
  const authenticatedFetch = async <T = unknown>(url: string, options: Record<string, unknown> = {}): Promise<T> => {
    const defaultOptions = {
      credentials: 'include' as RequestCredentials,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
      }
    }

    try {
      return await $fetch<T>(url, {
        ...defaultOptions,
        ...options,
        baseURL: backendUrl
      }) as T
    } catch (error: unknown) {
      // If we get 401, user is not authenticated
      if (isApiError(error) && error.status === 401) {
        user.value = null
        await navigateTo('/admin/login')
        throw new Error('Authentication required')
      }
      
      throw error
    }
  }

  /**
   * Redirect to login if not authenticated
   */
  const requireAuth = async (): Promise<void> => {
    const isAuth = await checkAuth()
    
    if (!isAuth) {
      await navigateTo('/admin/login')
    }
  }

  /**
   * Redirect to login if not admin
   */
  const requireAdmin = async (): Promise<void> => {
    await requireAuth()
    
    if (!isAdmin.value) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    
    // Methods
    login,
    logout,
    checkAuth,
    getCurrentUser,
    hasRole,
    authenticatedFetch,
    requireAuth,
    requireAdmin
  }
}