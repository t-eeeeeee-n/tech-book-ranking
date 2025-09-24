import { Request, Response, NextFunction } from 'express'
import { ErrorResponse } from '@/types'

export interface AppError extends Error {
    statusCode?: number
    code?: string
    isOperational?: boolean
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response<ErrorResponse>
): void => {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server Error'
    
    // Log error details for debugging
    console.error('Error occurred:', {
        method: req.method,
        url: req.url,
        statusCode,
        message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    })

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    const response: ErrorResponse = {
        success: false,
        message: isDevelopment ? message : 'An error occurred',
        ...(isDevelopment && { error: error.stack }),
        ...(error.code && { code: error.code })
    }

    res.status(statusCode).json(response)
}

export const createError = (message: string, statusCode: number = 500, code?: string): AppError => {
    const error: AppError = new Error(message)
    error.statusCode = statusCode
    error.code = code
    error.isOperational = true
    return error
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}