import mongoose from 'mongoose'
import { DatabaseConfig } from '@/types'

class DatabaseConnection {
    private static instance: DatabaseConnection
    private isConnected: boolean = false

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection()
        }
        return DatabaseConnection.instance
    }

    public async connect(config: DatabaseConfig): Promise<void> {
        if (this.isConnected) {
            console.log('Database already connected')
            return
        }

        try {
            const defaultOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false
            }

            const options = { ...defaultOptions, ...config.options }

            await mongoose.connect(config.uri, options)
            
            this.isConnected = true
            console.log('Connected to MongoDB successfully')

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                console.error('MongoDB connection error:', error)
                this.isConnected = false
            })

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected')
                this.isConnected = false
            })

            mongoose.connection.on('reconnected', () => {
                console.log('MongoDB reconnected')
                this.isConnected = true
            })

        } catch (error) {
            console.error('Failed to connect to MongoDB:', error)
            this.isConnected = false
            throw error
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return
        }

        try {
            await mongoose.disconnect()
            this.isConnected = false
            console.log('Disconnected from MongoDB')
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error)
            throw error
        }
    }

    public getConnectionStatus(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1
    }
}

export const database = DatabaseConnection.getInstance()
export default database