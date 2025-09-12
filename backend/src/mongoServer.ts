import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const app = express()
const PORT = 3001

// MongoDB Memory Server instance
let mongod: MongoMemoryServer

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))
app.use(express.json())

// Simple Book schema for testing
const bookSchema = new mongoose.Schema({
    title: String,
    author: [String],
    publisher: String,
    isbn13: String,
    publishedYear: Number,
    category: [String],
    tags: [String],
    mentionCount: Number,
    uniqueArticleCount: Number,
    firstMentionedAt: Date,
    lastMentionedAt: Date,
    trendScore: Number,
    amazonUrl: String,
    imageUrl: String,
    description: String,
    status: String
}, { timestamps: true })

const Book = mongoose.model('Book', bookSchema)

// Simple Category schema
const categorySchema = new mongoose.Schema({
    slug: String,
    name: String,
    description: String,
    color: String,
    icon: String,
    bookCount: Number,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)

// Sample data to seed the database
const sampleBooks = [
    {
        title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック",
        author: ["Dustin Boswell", "Trevor Foucher"],
        publisher: "オライリージャパン",
        isbn13: "9784873115658",
        publishedYear: 2012,
        category: ["プログラミング", "ソフトウェア工学"],
        tags: ["コードリーディング", "リファクタリング", "プログラミング技法", "開発手法"],
        mentionCount: 1247,
        uniqueArticleCount: 892,
        firstMentionedAt: new Date("2022-03-15T09:23:45.000Z"),
        lastMentionedAt: new Date("2024-12-08T14:32:12.000Z"),
        trendScore: 92.5,
        amazonUrl: "https://www.amazon.co.jp/dp/4873115655",
        imageUrl: "https://m.media-amazon.com/images/I/51MgH8Jmr+L._SY346_.jpg",
        description: "美しいコードを見ると感動する。優れたプログラマーなら誰しも経験があることだ。では、そうしたコードはどこが優れているのだろうか？",
        status: "active"
    },
    {
        title: "Clean Code アジャイル開発手法による実践的プログラミング",
        author: ["Robert C. Martin"],
        publisher: "KADOKAWA",
        isbn13: "9784048930592",
        publishedYear: 2017,
        category: ["プログラミング", "ソフトウェア工学"],
        tags: ["クリーンコード", "アジャイル", "TDD", "リファクタリング"],
        mentionCount: 1089,
        uniqueArticleCount: 743,
        firstMentionedAt: new Date("2022-02-08T11:15:23.000Z"),
        lastMentionedAt: new Date("2024-12-07T16:45:33.000Z"),
        trendScore: 89.2,
        amazonUrl: "https://www.amazon.co.jp/dp/4048930591",
        imageUrl: "https://m.media-amazon.com/images/I/515iEcDr1GL._SY346_.jpg",
        description: "ソフトウェア開発者が知るべきプログラミングの心得を説いた名著。より良いコードを書く実践的な方法を学べます。",
        status: "active"
    },
    {
        title: "達人プログラマー 熟達に向けたあなたの旅",
        author: ["David Thomas", "Andrew Hunt"],
        publisher: "オライリージャパン",
        isbn13: "9784873119038",
        publishedYear: 2020,
        category: ["プログラミング", "キャリア・スキル"],
        tags: ["プログラマー", "スキルアップ", "ソフトウェア開発", "実践的"],
        mentionCount: 923,
        uniqueArticleCount: 634,
        firstMentionedAt: new Date("2022-04-12T13:27:56.000Z"),
        lastMentionedAt: new Date("2024-12-06T10:18:44.000Z"),
        trendScore: 87.8,
        amazonUrl: "https://www.amazon.co.jp/dp/4873119030",
        imageUrl: "https://m.media-amazon.com/images/I/51O4EXvhMNL._SY346_.jpg",
        description: "プログラマーとしてのキャリアを積む上で必要な考え方とテクニックを体系的に学べる一冊。",
        status: "active"
    }
]

const sampleCategories = [
    { slug: "programming", name: "プログラミング", bookCount: 150, description: "プログラミング全般", color: "#3B82F6", icon: "code", isActive: true, displayOrder: 1 },
    { slug: "web", name: "Web開発", bookCount: 120, description: "Web開発技術", color: "#10B981", icon: "globe", isActive: true, displayOrder: 2 },
    { slug: "ai", name: "AI・機械学習", bookCount: 80, description: "人工知能と機械学習", color: "#8B5CF6", icon: "cpu", isActive: true, displayOrder: 3 },
    { slug: "infrastructure", name: "インフラ・DevOps", bookCount: 95, description: "インフラ構築とDevOps", color: "#F59E0B", icon: "server", isActive: true, displayOrder: 4 }
]

// Health checks
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    })
})

app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'API is operational with MongoDB',
        timestamp: new Date().toISOString(),
        database: {
            status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            collections: mongoose.connection.db ? Object.keys(mongoose.connection.db.collection) : []
        }
    })
})

// Books API - now powered by MongoDB
app.get('/api/books', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))
        const category = req.query.category as string
        const search = req.query.search as string
        const sort = req.query.sort as string || 'mentions'

        let query: any = {}

        // Apply filters
        if (category && category !== 'all') {
            query.category = { $in: [new RegExp(category, 'i')] }
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $in: [new RegExp(search, 'i')] } }
            ]
        }

        // Sort options
        let sortOptions: any = {}
        switch (sort) {
            case 'mentions':
                sortOptions = { mentionCount: -1 }
                break
            case 'trend':
                sortOptions = { trendScore: -1 }
                break
            case 'title':
                sortOptions = { title: 1 }
                break
            default:
                sortOptions = { mentionCount: -1 }
        }

        // Get total count for pagination
        const total = await Book.countDocuments(query)

        // Get books with pagination
        const books = await Book.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        // Add rankings
        const booksWithRank = books.map((book, index) => ({
            ...book,
            _id: book._id.toString(),
            id: index + 1,
            rank: (page - 1) * limit + index + 1
        }))

        res.json({
            success: true,
            data: booksWithRank,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            meta: {
                totalBooks: total,
                filteredCount: total,
                appliedFilters: {
                    category: category || null,
                    search: search || null,
                    sort
                },
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('Error fetching books:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id).lean()
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        return res.json({
            success: true,
            data: {
                ...book,
                _id: book._id.toString()
            }
        })
    } catch (error) {
        console.error('Error fetching book:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// Get book mentions (sample data for now)
app.get('/api/books/:id/mentions', async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        // For now, return sample mentions data
        const sampleMentions = [
            {
                id: "mention1",
                title: "コードレビューで気をつけるべきポイント",
                url: "https://qiita.com/sample/items/sample-article-1",
                context: `${book.title}に書かれている「変数名は意図を表現する」という原則を守ることが重要です。`,
                confidence: 0.95,
                sentiment: 'positive' as const,
                publishedAt: "2024-11-15T10:30:00Z",
                likesCount: 45,
                author: "サンプル太郎",
                authorId: "sample_author_1",
                mentionText: `${book.title}に書かれている「変数名は意図を表現する」という原則`,
                extractionMethod: 'regex' as const,
                recommendationLevel: 5,
                mentionWeight: 1.2,
                tags: ["プログラミング", "コードレビュー", "リーダブルコード"]
            }
        ]

        return res.json({
            success: true,
            data: sampleMentions,
            meta: {
                bookId: id,
                totalMentions: sampleMentions.length,
                sentimentBreakdown: {
                    positive: 1,
                    neutral: 0,
                    negative: 0
                },
                averageConfidence: 0.95,
                totalLikes: 45,
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('Error fetching mentions:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// Categories API - now powered by MongoDB
app.get('/api/categories', async (_req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ displayOrder: 1, name: 1 })
            .lean()

        const transformedCategories = categories.map(category => ({
            value: category.slug,
            label: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
            bookCount: category.bookCount
        }))

        res.json({
            success: true,
            data: transformedCategories,
            meta: {
                total: categories.length,
                lastUpdated: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    })
})

// Seed database with sample data
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Book.deleteMany({})
        await Category.deleteMany({})

        // Insert sample data
        await Book.insertMany(sampleBooks)
        await Category.insertMany(sampleCategories)

        console.log('✅ Database seeded with sample data')
    } catch (error) {
        console.error('❌ Error seeding database:', error)
    }
}

// Start server with MongoDB Memory Server
const startServerWithMongoDB = async (): Promise<void> => {
    try {
        // Start MongoDB Memory Server
        console.log('🔄 Starting MongoDB Memory Server...')
        mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017,
                dbName: 'techbook-ranking'
            }
        })
        
        const uri = mongod.getUri()
        console.log(`✅ MongoDB Memory Server started at: ${uri}`)

        // Connect to MongoDB
        await mongoose.connect(uri + 'techbook-ranking')
        console.log('✅ Connected to MongoDB Memory Server')

        // Seed database
        await seedDatabase()

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`🚀 MongoDB Server running on port ${PORT}`)
            console.log('📝 Environment: development with MongoDB Memory Server')
            console.log('🔗 API Base URL: http://localhost:3001/api')
            console.log('❤️  Health Check: http://localhost:3001/health')
        })

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            console.log(`\n📢 Received ${signal}. Starting graceful shutdown...`)
            
            server.close(async () => {
                console.log('🔒 HTTP server closed')
                
                try {
                    await mongoose.disconnect()
                    console.log('💾 Mongoose disconnected')
                    
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

// Start the server
startServerWithMongoDB()

export default app