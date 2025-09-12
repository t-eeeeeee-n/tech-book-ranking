import { Book, Category, QiitaArticle, BookMention } from '@/models'
import database from '@/utils/database'
import { databaseConfig } from '@/utils/config'

interface MockBook {
    _id: string
    title: string
    author: string[]
    publisher?: string
    isbn13?: string
    publishedYear?: number
    category: string[]
    tags: string[]
    mentionCount: number
    uniqueArticleCount: number
    firstMentionedAt?: string
    lastMentionedAt?: string
    trendScore: number
    amazonUrl?: string
    imageUrl?: string
    description?: string
    status: string
    createdAt: string
    updatedAt: string
}

const sampleBooks: MockBook[] = [
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
        updatedAt: "2024-12-08T14:32:12.000Z"
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
        updatedAt: "2024-12-07T16:45:33.000Z"
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
        updatedAt: "2024-12-06T10:18:44.000Z"
    }
]

const sampleCategories = [
    {
        name: "プログラミング",
        slug: "programming",
        description: "プログラミング全般に関する書籍",
        displayOrder: 1,
        isActive: true,
        bookCount: 150
    },
    {
        name: "Web開発",
        slug: "web",
        description: "Webアプリケーション開発に関する書籍",
        displayOrder: 2,
        isActive: true,
        bookCount: 120
    },
    {
        name: "AI・機械学習",
        slug: "ai",
        description: "人工知能・機械学習に関する書籍",
        displayOrder: 3,
        isActive: true,
        bookCount: 80
    },
    {
        name: "ソフトウェア工学",
        slug: "software-engineering",
        description: "ソフトウェア工学・設計に関する書籍",
        displayOrder: 4,
        isActive: true,
        bookCount: 95
    }
]

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to database...')
        await database.connect(databaseConfig)

        console.log('🗑️ Clearing existing data...')
        await Promise.all([
            Book.deleteMany({}),
            Category.deleteMany({}),
            QiitaArticle.deleteMany({}),
            BookMention.deleteMany({})
        ])

        console.log('📚 Seeding categories...')
        await Category.insertMany(sampleCategories)

        console.log('📖 Seeding books...')
        const booksToInsert = sampleBooks.map(book => ({
            ...book,
            titleNormalized: book.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
        }))
        await Book.insertMany(booksToInsert)

        console.log('📝 Creating sample articles...')
        const sampleArticles = [
            {
                _id: "67519a8f5e123456789abc01",
                qiitaId: "sample-article-1",
                title: "コードレビューで気をつけるべきポイント",
                url: "https://qiita.com/sample/items/sample-article-1",
                authorId: "sample_author_1",
                authorName: "サンプル太郎",
                likesCount: 45,
                stocksCount: 23,
                commentsCount: 8,
                excerpt: "リーダブルコードを参考に、効果的なコードレビューのポイントをまとめました。",
                tags: ["プログラミング", "コードレビュー", "リーダブルコード"],
                publishedAt: new Date("2024-11-15T10:30:00Z"),
                updatedAt: new Date("2024-11-15T10:30:00Z"),
                processed: true,
                processedAt: new Date("2024-11-15T10:35:00Z"),
                bookExtractionStatus: 'completed',
                createdAt: new Date("2024-11-15T10:30:00Z"),
                lastCheckedAt: new Date("2024-11-15T10:35:00Z")
            },
            {
                _id: "67519a8f5e123456789abc02",
                qiitaId: "sample-article-2",
                title: "Clean Codeの原則をTypeScriptで実践する",
                url: "https://qiita.com/sample/items/sample-article-2",
                authorId: "sample_author_2",
                authorName: "サンプル花子",
                likesCount: 78,
                stocksCount: 45,
                commentsCount: 12,
                excerpt: "Clean Codeで紹介されている原則をTypeScriptプロジェクトで実践する方法を紹介します。",
                tags: ["TypeScript", "CleanCode", "プログラミング"],
                publishedAt: new Date("2024-12-01T14:20:00Z"),
                updatedAt: new Date("2024-12-01T14:20:00Z"),
                processed: true,
                processedAt: new Date("2024-12-01T14:25:00Z"),
                bookExtractionStatus: 'completed',
                createdAt: new Date("2024-12-01T14:20:00Z"),
                lastCheckedAt: new Date("2024-12-01T14:25:00Z")
            }
        ]
        await QiitaArticle.insertMany(sampleArticles)

        console.log('🔗 Creating book mentions...')
        const sampleMentions = [
            {
                bookId: "67519a8f5e123456789abcde",
                articleId: "67519a8f5e123456789abc01",
                mentionText: "リーダブルコードに書かれている「変数名は意図を表現する」という原則",
                context: "コードレビューにおいて最も重要なのは、リーダブルコードに書かれている「変数名は意図を表現する」という原則を守ることです。",
                confidence: 0.95,
                extractionMethod: 'regex' as const,
                sentiment: 'positive' as const,
                recommendationLevel: 5,
                articlePopularity: 45,
                authorCredibility: 0.8,
                mentionWeight: 1.2
            },
            {
                bookId: "67519a8f5e123456789abcdf",
                articleId: "67519a8f5e123456789abc02",
                mentionText: "Clean Codeで紹介されている単一責任の原則",
                context: "Clean Codeで紹介されている単一責任の原則を適用することで、TypeScriptのクラス設計が格段に改善されます。",
                confidence: 0.92,
                extractionMethod: 'regex' as const,
                sentiment: 'positive' as const,
                recommendationLevel: 5,
                articlePopularity: 78,
                authorCredibility: 0.85,
                mentionWeight: 1.3
            }
        ]
        await BookMention.insertMany(sampleMentions)

        console.log('✅ Database seeded successfully!')
        console.log(`📊 Created:`)
        console.log(`   - ${sampleCategories.length} categories`)
        console.log(`   - ${sampleBooks.length} books`)
        console.log(`   - ${sampleArticles.length} articles`)
        console.log(`   - ${sampleMentions.length} mentions`)

    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    } finally {
        await database.disconnect()
        console.log('🔌 Database disconnected')
        process.exit(0)
    }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
    seedDatabase()
}

export default seedDatabase