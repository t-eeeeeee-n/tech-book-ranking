import dotenv from 'dotenv'
import { DatabaseConfig, ServerConfig } from '@/types'

dotenv.config()

export const serverConfig: ServerConfig = {
    port: Number(process.env.PORT) || 3001,
    env: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    }
}

export const databaseConfig: DatabaseConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/techbook-ranking',
    options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
    }
}

export const apiConfig = {
    qiitaToken: process.env.QIITA_API_TOKEN,
    amazon: {
        accessKey: process.env.AMAZON_ACCESS_KEY,
        secretKey: process.env.AMAZON_SECRET_KEY,
        associateTag: process.env.AMAZON_ASSOCIATE_TAG
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    }
}