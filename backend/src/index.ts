import app from '@/app'
import database from '@/utils/database'
import { serverConfig, databaseConfig } from '@/utils/config'

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await database.connect(databaseConfig)
        console.log('✅ Database connection established')

        // Start Express server
        const server = app.listen(serverConfig.port, () => {
            console.log(`🚀 Server running on port ${serverConfig.port}`)
            console.log(`📝 Environment: ${serverConfig.env}`)
            console.log(`🔗 API Base URL: http://localhost:${serverConfig.port}/api`)
            console.log(`❤️  Health Check: http://localhost:${serverConfig.port}/health`)
        })

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n📢 Received ${signal}. Starting graceful shutdown...`)
            
            server.close(async () => {
                console.log('🔒 HTTP server closed')
                
                try {
                    await database.disconnect()
                    console.log('💾 Database disconnected')
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
        process.exit(1)
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error)
    process.exit(1)
})

// Start the server
startServer()