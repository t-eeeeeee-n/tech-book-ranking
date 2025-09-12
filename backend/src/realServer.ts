import app from '@/app'
import database from '@/utils/database'
import { databaseConfig } from '@/utils/config'
import { MongoMemoryServer } from 'mongodb-memory-server'

// MongoDB Memory Server instance
let mongod: MongoMemoryServer

const startServerWithMongoDB = async (): Promise<void> => {
    try {
        // Start MongoDB Memory Server
        console.log('🔄 Starting MongoDB Memory Server...')
        mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017, // Use standard MongoDB port
                dbName: 'techbook-ranking'
            }
        })
        
        const uri = mongod.getUri()
        console.log(`✅ MongoDB Memory Server started at: ${uri}`)

        // Override database config to use memory server
        const memoryDbConfig = {
            ...databaseConfig,
            uri: uri + 'techbook-ranking'
        }

        // Connect to MongoDB
        await database.connect(memoryDbConfig)
        console.log('✅ Database connection established')

        // Start Express server
        const server = app.listen(3001, () => {
            console.log('🚀 Server running on port 3001')
            console.log('📝 Environment: development with MongoDB Memory Server')
            console.log('🔗 API Base URL: http://localhost:3001/api')
            console.log('❤️  Health Check: http://localhost:3001/health')
        })

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n📢 Received ${signal}. Starting graceful shutdown...`)
            
            server.close(async () => {
                console.log('🔒 HTTP server closed')
                
                try {
                    await database.disconnect()
                    console.log('💾 Database disconnected')
                    
                    if (mongod) {
                        await mongod.stop()
                        console.log('🛑 MongoDB Memory Server stopped')
                    }
                    
                    process.exit(0)
                } catch (error) {
                    console.error('❌ Error during shutdown:', error)
                    process.exit(1)
                }
            })
        }

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    } catch (error) {
        console.error('❌ Failed to start server:', error)
        
        if (mongod) {
            try {
                await mongod.stop()
            } catch (stopError) {
                console.error('❌ Failed to stop MongoDB Memory Server:', stopError)
            }
        }
        
        process.exit(1)
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason)
    
    if (mongod) {
        try {
            await mongod.stop()
        } catch (stopError) {
            console.error('❌ Failed to stop MongoDB Memory Server:', stopError)
        }
    }
    
    process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('🚨 Uncaught Exception:', error)
    
    if (mongod) {
        try {
            await mongod.stop()
        } catch (stopError) {
            console.error('❌ Failed to stop MongoDB Memory Server:', stopError)
        }
    }
    
    process.exit(1)
})

// Start the server
startServerWithMongoDB()