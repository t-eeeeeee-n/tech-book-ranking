import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))
app.use(express.json())

// Sample data matching frontend expectations
const sampleBooks = [
    {
        _id: "67519a8f5e123456789abcde",
        title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック",
        author: ["Dustin Boswell", "Trevor Foucher"],
        publisher: "オライリージャパン",
        isbn13: "9784873115658",
        publishedYear: 2012,
        category: ["プログラミング", "ソフトウェア工学"],
        tags: ["コードリーディング", "リファクタリング", "プログラミング技法", "開発手法"],
        mentionCount: 1247,
        uniqueArticleCount: 892,
        firstMentionedAt: "2022-03-15T09:23:45.000Z",
        lastMentionedAt: "2024-12-08T14:32:12.000Z",
        trendScore: 92.5,
        amazonUrl: "https://www.amazon.co.jp/dp/4873115655",
        imageUrl: "https://m.media-amazon.com/images/I/51MgH8Jmr+L._SY346_.jpg",
        description: "美しいコードを見ると感動する。優れたプログラマーなら誰しも経験があることだ。では、そうしたコードはどこが優れているのだろうか？",
        status: "active",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2024-12-08T14:32:12.000Z",
        id: 1,
        rank: 1
    },
    {
        _id: "67519a8f5e123456789abcdf",
        title: "Clean Code アジャイル開発手法による実践的プログラミング",
        author: ["Robert C. Martin"],
        publisher: "KADOKAWA",
        isbn13: "9784048930592",
        publishedYear: 2017,
        category: ["プログラミング", "ソフトウェア工学"],
        tags: ["クリーンコード", "アジャイル", "TDD", "リファクタリング"],
        mentionCount: 1089,
        uniqueArticleCount: 743,
        firstMentionedAt: "2022-02-08T11:15:23.000Z",
        lastMentionedAt: "2024-12-07T16:45:33.000Z",
        trendScore: 89.2,
        amazonUrl: "https://www.amazon.co.jp/dp/4048930591",
        imageUrl: "https://m.media-amazon.com/images/I/515iEcDr1GL._SY346_.jpg",
        description: "ソフトウェア開発者が知るべきプログラミングの心得を説いた名著。より良いコードを書く実践的な方法を学べます。",
        status: "active",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2024-12-07T16:45:33.000Z",
        id: 2,
        rank: 2
    },
    {
        _id: "67519a8f5e123456789abce0",
        title: "達人プログラマー 熟達に向けたあなたの旅",
        author: ["David Thomas", "Andrew Hunt"],
        publisher: "オライリージャパン",
        isbn13: "9784873119038",
        publishedYear: 2020,
        category: ["プログラミング", "キャリア・スキル"],
        tags: ["プログラマー", "スキルアップ", "ソフトウェア開発", "実践的"],
        mentionCount: 923,
        uniqueArticleCount: 634,
        firstMentionedAt: "2022-04-12T13:27:56.000Z",
        lastMentionedAt: "2024-12-06T10:18:44.000Z",
        trendScore: 87.8,
        amazonUrl: "https://www.amazon.co.jp/dp/4873119030",
        imageUrl: "https://m.media-amazon.com/images/I/51O4EXvhMNL._SY346_.jpg",
        description: "プログラマーとしてのキャリアを積む上で必要な考え方とテクニックを体系的に学べる一冊。",
        status: "active",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2024-12-06T10:18:44.000Z",
        id: 3,
        rank: 3
    }
]

const sampleCategories = [
    { value: "programming", label: "プログラミング", bookCount: 150 },
    { value: "web", label: "Web開発", bookCount: 120 },
    { value: "ai", label: "AI・機械学習", bookCount: 80 },
    { value: "infrastructure", label: "インフラ・DevOps", bookCount: 95 }
]

const sampleMentions = [
    {
        id: "mention1",
        title: "コードレビューで気をつけるべきポイント",
        url: "https://qiita.com/sample/items/sample-article-1",
        context: "リーダブルコードに書かれている「変数名は意図を表現する」という原則を守ることが重要です。",
        confidence: 0.95,
        sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
        publishedAt: "2024-11-15T10:30:00Z",
        likesCount: 45,
        author: "サンプル太郎",
        authorId: "sample_author_1",
        mentionText: "リーダブルコードに書かれている「変数名は意図を表現する」という原則",
        extractionMethod: 'regex' as const,
        recommendationLevel: 5,
        mentionWeight: 1.2,
        tags: ["プログラミング", "コードレビュー", "リーダブルコード"]
    }
]

// Health check
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    })
})

app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'API is operational',
        timestamp: new Date().toISOString()
    })
})

// Books API
app.get('/api/books', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))
    const category = req.query.category as string
    const search = req.query.search as string
    const sort = req.query.sort as string || 'mentions'

    let filteredBooks = [...sampleBooks]

    // Apply filters (basic implementation)
    if (category && category !== 'all') {
        // Simple category filter
        filteredBooks = filteredBooks.filter(book => 
            book.category.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
        )
    }

    if (search) {
        const searchLower = search.toLowerCase()
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.some(author => author.toLowerCase().includes(searchLower))
        )
    }

    // Sort
    filteredBooks.sort((a, b) => {
        switch (sort) {
            case 'mentions':
                return b.mentionCount - a.mentionCount
            case 'trend':
                return b.trendScore - a.trendScore
            case 'title':
                return a.title.localeCompare(b.title, 'ja')
            default:
                return b.mentionCount - a.mentionCount
        }
    })

    // Add ranking
    const rankedBooks = filteredBooks.map((book, index) => ({
        ...book,
        rank: index + 1
    }))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBooks = rankedBooks.slice(startIndex, endIndex)

    // Adjust rank for pagination
    const paginatedBooksWithCorrectRank = paginatedBooks.map((book, index) => ({
        ...book,
        rank: startIndex + index + 1
    }))

    res.json({
        success: true,
        data: paginatedBooksWithCorrectRank,
        pagination: {
            page,
            limit,
            total: filteredBooks.length,
            totalPages: Math.ceil(filteredBooks.length / limit),
            hasMore: endIndex < filteredBooks.length,
            hasNext: page < Math.ceil(filteredBooks.length / limit),
            hasPrev: page > 1
        },
        meta: {
            totalBooks: sampleBooks.length,
            filteredCount: filteredBooks.length,
            appliedFilters: {
                category: category || null,
                search: search || null,
                sort
            },
            lastUpdated: new Date().toISOString()
        }
    })
})

// Get book by ID
app.get('/api/books/:id', (req, res) => {
    const { id } = req.params
    const book = sampleBooks.find(b => b._id === id || b.id.toString() === id)
    
    if (!book) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        })
    }

    return res.json({
        success: true,
        data: book
    })
})

// Get book mentions
app.get('/api/books/:id/mentions', (req, res) => {
    const { id } = req.params
    const book = sampleBooks.find(b => b._id === id || b.id.toString() === id)
    
    if (!book) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        })
    }

    return res.json({
        success: true,
        data: sampleMentions,
        meta: {
            bookId: id,
            totalMentions: sampleMentions.length,
            sentimentBreakdown: {
                positive: sampleMentions.filter(m => m.sentiment === 'positive').length,
                neutral: sampleMentions.filter(m => m.sentiment === 'neutral').length,
                negative: sampleMentions.filter(m => m.sentiment === 'negative').length
            },
            averageConfidence: 0.95,
            totalLikes: sampleMentions.reduce((sum, m) => sum + m.likesCount, 0),
            lastUpdated: new Date().toISOString()
        }
    })
})

// Categories API
app.get('/api/categories', (_req, res) => {
    res.json({
        success: true,
        data: sampleCategories,
        meta: {
            total: sampleCategories.length,
            lastUpdated: new Date().toISOString()
        }
    })
})

// Rankings API
app.get('/api/rankings', (req, res) => {
    const type = req.query.type as string || 'overall'
    const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit as string) || 100))
    
    const rankings = sampleBooks.slice(0, limit).map((book, index) => ({
        rank: index + 1,
        bookId: book._id,
        mentionCount: book.mentionCount,
        trendScore: book.trendScore,
        change: 0,
        book: book
    }))

    res.json({
        success: true,
        data: {
            type,
            rankings,
            totalBooks: sampleBooks.length,
            generatedAt: new Date().toISOString()
        },
        meta: {
            requestedType: type,
            requestedLimit: limit,
            actualCount: rankings.length,
            lastUpdated: new Date().toISOString()
        }
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple Backend Server running on port ${PORT}`)
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`)
})

export default app