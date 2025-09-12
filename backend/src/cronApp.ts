import dotenv from 'dotenv'
import cronService from '@/services/cronService'

// Load environment variables
dotenv.config()

/**
 * Standalone cron application
 * This can be run separately from the main web server
 */
async function startCronApp() {
    console.log('🕒 Starting TechBook Ranking Cron Application...')
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    
    // Check if cron jobs are enabled
    const cronEnabled = process.env.ENABLE_CRON_JOBS?.toLowerCase() !== 'false'
    if (!cronEnabled) {
        console.log('⚠️ Cron jobs are disabled via ENABLE_CRON_JOBS environment variable')
        process.exit(0)
    }
    
    try {
        await cronService.start()
        console.log('✅ Cron application started successfully')
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 Received SIGINT, shutting down gracefully...')
            await cronService.stop()
            console.log('👋 Cron application stopped')
            process.exit(0)
        })

        process.on('SIGTERM', async () => {
            console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
            await cronService.stop()
            console.log('👋 Cron application stopped')
            process.exit(0)
        })

        // Handle uncaught exceptions
        process.on('uncaughtException', async (error) => {
            console.error('💥 Uncaught Exception:', error)
            await cronService.stop()
            process.exit(1)
        })

        process.on('unhandledRejection', async (reason, promise) => {
            console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
            await cronService.stop()
            process.exit(1)
        })

    } catch (error) {
        console.error('💥 Failed to start cron application:', error)
        process.exit(1)
    }
}

// Start the cron application if this file is run directly
if (require.main === module) {
    startCronApp()
}

export { startCronApp, cronService }