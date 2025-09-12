import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'

interface AuthenticatedRequest extends Request {
  apiKey?: string
}

export const validateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get API key from header
    const providedKey = req.headers['x-api-key'] as string

    // Check if API key is provided
    if (!providedKey) {
      throw createError('API key is required', 401, 'MISSING_API_KEY')
    }

    // Get valid API keys from environment
    const validApiKeys = getValidApiKeys()

    // Check if any valid keys are configured
    if (validApiKeys.length === 0) {
      console.warn('⚠️  No API keys configured in environment variables')
      throw createError('API authentication not configured', 500, 'AUTH_NOT_CONFIGURED')
    }

    // Validate the provided key
    if (!validApiKeys.includes(providedKey)) {
      throw createError('Invalid API key', 401, 'INVALID_API_KEY')
    }

    // Store the validated API key in request for potential logging
    req.apiKey = providedKey

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Get valid API keys from environment variables
 * Supports multiple keys separated by commas
 */
function getValidApiKeys(): string[] {
  const apiKeysEnv = process.env.API_KEYS || process.env.X_API_KEY

  if (!apiKeysEnv) {
    return []
  }

  // Split by comma and clean up whitespace
  return apiKeysEnv
    .split(',')
    .map(key => key.trim())
    .filter(key => key.length > 0)
}

/**
 * Optional: Create a more lenient version for development
 */
export const validateApiKeyDev = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  // Use regular validation in other environments
  return validateApiKey(req, res, next)
}