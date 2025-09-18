import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'

export const validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query)
        
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ')
            throw createError(`Invalid query parameters: ${message}`, 400, 'VALIDATION_ERROR')
        }
        
        next()
    }
}

export const validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body)
        
        if (error) {
            const message = error.details.map(detail => detail.message).join(', ')
            throw createError(`Invalid request body: ${message}`, 400, 'VALIDATION_ERROR')
        }
        
        next()
    }
}

// Common validation schemas
export const bookQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    category: Joi.string().max(50).optional(),
    search: Joi.string().max(200).optional(),
    period: Joi.string().valid('all', 'year', 'month', 'week', 'today').default('all'),
    sort: Joi.string().valid('mentionCount', 'trendScore', 'publishedYear', 'mentions', 'trend', 'newest', 'oldest', 'title').default('mentionCount'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
})

export const idParamSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid ObjectId format'
    })
})

export const createBookSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    author: Joi.alternatives().try(
        Joi.string().min(1),
        Joi.array().items(Joi.string().min(1)).min(1)
    ).required(),
    publisher: Joi.string().max(100).optional(),
    isbn10: Joi.string().length(10).pattern(/^[0-9]{10}$/).optional(),
    isbn13: Joi.string().length(13).pattern(/^[0-9]{13}$/).optional(),
    publishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear() + 1).optional(),
    category: Joi.alternatives().try(
        Joi.string().min(1),
        Joi.array().items(Joi.string().min(1)).min(1)
    ).required(),
    tags: Joi.array().items(Joi.string().min(1)).default([]),
    amazonUrl: Joi.string().uri().max(500).optional(),
    rakutenUrl: Joi.string().uri().max(500).optional(),
    imageUrl: Joi.string().uri().max(500).optional(),
    description: Joi.string().max(1000).optional()
})

export const updateBookSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    author: Joi.alternatives().try(
        Joi.string().min(1),
        Joi.array().items(Joi.string().min(1)).min(1)
    ).optional(),
    publisher: Joi.string().max(100).optional(),
    isbn10: Joi.string().length(10).pattern(/^[0-9]{10}$/).optional(),
    isbn13: Joi.string().length(13).pattern(/^[0-9]{13}$/).optional(),
    publishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear() + 1).optional(),
    category: Joi.alternatives().try(
        Joi.string().min(1),
        Joi.array().items(Joi.string().min(1)).min(1)
    ).optional(),
    tags: Joi.array().items(Joi.string().min(1)).optional(),
    amazonUrl: Joi.string().uri().max(500).optional(),
    rakutenUrl: Joi.string().uri().max(500).optional(),
    imageUrl: Joi.string().uri().max(500).optional(),
    description: Joi.string().max(1000).optional()
})

export const rankingsQuerySchema = Joi.object({
    type: Joi.string().valid('overall', 'category', 'trending', 'newcomer').default('overall'),
    category: Joi.string().max(50).optional(),
    period: Joi.string().valid('all', 'year', 'month', 'week').default('all'),
    limit: Joi.number().integer().min(1).max(100).default(20)
})

// Favorites validation schemas
export const favoritesQuerySchema = Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid userId format - must be a valid ObjectId',
        'any.required': 'userId query parameter is required'
    })
})

export const addFavoriteSchema = Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid userId format - must be a valid ObjectId',
        'any.required': 'userId is required'
    }),
    bookId: Joi.alternatives().try(
        Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // ObjectId format
        Joi.string().pattern(/^[0-9]+$/), // Numeric string format
        Joi.number().integer().min(1) // Numeric format
    ).required().messages({
        'alternatives.match': 'Invalid bookId format - must be ObjectId or numeric value',
        'any.required': 'bookId is required'
    })
})

export const removeFavoriteSchema = Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid userId format - must be a valid ObjectId',
        'any.required': 'userId is required'
    }),
    bookId: Joi.alternatives().try(
        Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // ObjectId format
        Joi.string().pattern(/^[0-9]+$/), // Numeric string format
        Joi.number().integer().min(1) // Numeric format
    ).required().messages({
        'alternatives.match': 'Invalid bookId format - must be ObjectId or numeric value',
        'any.required': 'bookId is required'
    })
})