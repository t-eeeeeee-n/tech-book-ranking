import { Request, Response } from 'express'
import { Book, Category, QiitaArticle, BookMention } from '@/models'

// サンプルデータ
const sampleCategories = [
  { name: 'プログラミング', slug: 'programming' },
  { name: 'Web開発', slug: 'web-development' },
  { name: 'AI・機械学習', slug: 'ai-machine-learning' },
  { name: 'インフラ・DevOps', slug: 'infrastructure-devops' },
  { name: 'データベース', slug: 'database' },
  { name: 'モバイル開発', slug: 'mobile-development' }
]

const sampleBooks = [
  {
    title: 'リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック',
    titleNormalized: 'readable code',
    author: ['Dustin Boswell', 'Trevor Foucher'],
    publisher: 'オライリージャパン',
    isbn13: '9784873115658',
    publishedYear: 2012,
    category: ['programming'],
    tags: ['clean-code', 'best-practices', 'programming'],
    mentionCount: 1250,
    uniqueArticleCount: 890,
    trendScore: 95.8,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=1',
    description: 'コードの品質を高めるための実践的なテクニックを学べる名著'
  },
  {
    title: 'JavaScript: The Good Parts ―「良いパーツ」によるベストプラクティス',
    titleNormalized: 'javascript the good parts',
    author: ['Douglas Crockford'],
    publisher: 'オライリージャパン',
    isbn13: '9784873113913',
    publishedYear: 2008,
    category: ['programming', 'web-development'],
    tags: ['javascript', 'web', 'best-practices'],
    mentionCount: 980,
    uniqueArticleCount: 720,
    trendScore: 85.2,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=2',
    description: 'JavaScriptの良い部分を理解し、効率的なコードを書くための必読書'
  },
  {
    title: 'Clean Code アジャイル開発によるソフトウェア品質向上',
    titleNormalized: 'clean code',
    author: ['Robert C. Martin'],
    publisher: 'KADOKAWA',
    isbn13: '9784048860819',
    publishedYear: 2017,
    category: ['programming'],
    tags: ['clean-code', 'agile', 'software-engineering'],
    mentionCount: 1150,
    uniqueArticleCount: 850,
    trendScore: 92.5,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=3',
    description: 'アジャイル開発における高品質なソフトウェア開発手法を学べる'
  },
  {
    title: 'Vue.js入門 基礎から実践アプリケーション開発まで',
    titleNormalized: 'vue js nyumon',
    author: ['川口和也', '手島拓也', '野田陽平'],
    publisher: '技術評論社',
    isbn13: '9784297100915',
    publishedYear: 2018,
    category: ['web-development'],
    tags: ['vue', 'frontend', 'javascript'],
    mentionCount: 675,
    uniqueArticleCount: 480,
    trendScore: 78.9,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=4',
    description: 'Vue.jsの基礎から実践的なアプリケーション開発まで学べる'
  },
  {
    title: 'ゼロから作るDeep Learning ―Pythonで学ぶディープラーニングの理論と実装',
    titleNormalized: 'zero kara tsukuru deep learning',
    author: ['斎藤康毅'],
    publisher: 'オライリージャパン',
    isbn13: '9784873117584',
    publishedYear: 2016,
    category: ['ai-machine-learning'],
    tags: ['deep-learning', 'python', 'ai'],
    mentionCount: 890,
    uniqueArticleCount: 650,
    trendScore: 88.7,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=5',
    description: 'Pythonを使ってディープラーニングの理論と実装を基礎から学べる'
  },
  {
    title: 'React開発 現場の教科書',
    titleNormalized: 'react kaihatsu genba no kyokasho',
    author: ['竹田陽一郎', '石田直樹'],
    publisher: 'マイナビ出版',
    isbn13: '9784839966706',
    publishedYear: 2018,
    category: ['web-development'],
    tags: ['react', 'frontend', 'javascript'],
    mentionCount: 756,
    uniqueArticleCount: 520,
    trendScore: 82.1,
    status: 'active',
    imageUrl: 'https://picsum.photos/300/400?random=6',
    description: 'Reactを使った現場レベルのアプリケーション開発を学べる'
  }
]

const sampleArticles = [
  {
    qiitaId: 'abc123',
    title: 'リーダブルコードを読んで実践してみた',
    url: 'https://qiita.com/user1/items/abc123',
    authorId: 'user1',
    authorName: 'developer1',
    likesCount: 45,
    stocksCount: 32,
    commentsCount: 8,
    excerpt: 'リーダブルコードの内容を実際のプロジェクトに適用した結果をまとめました',
    tags: ['リーダブルコード', 'プログラミング', 'best-practices'],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    processed: true,
    processedAt: new Date('2024-01-16'),
    bookExtractionStatus: 'completed' as const,
    lastCheckedAt: new Date('2024-01-16')
  },
  {
    qiitaId: 'def456',
    title: 'JavaScriptの良いパーツとは何か',
    url: 'https://qiita.com/user2/items/def456',
    authorId: 'user2',
    authorName: 'developer2',
    likesCount: 67,
    stocksCount: 48,
    commentsCount: 12,
    excerpt: 'JavaScript: The Good Partsを読んで理解した内容をまとめました',
    tags: ['JavaScript', 'フロントエンド', 'web'],
    publishedAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    processed: true,
    processedAt: new Date('2024-02-11'),
    bookExtractionStatus: 'completed' as const,
    lastCheckedAt: new Date('2024-02-11')
  }
]

export class SeedController {
  /**
   * データベースにサンプルデータを投入する
   */
  seedDatabase = async (req: Request, res: Response) => {
    try {
      // 既存データのクリア
      await Promise.all([
        BookMention.deleteMany({}),
        Book.deleteMany({}),
        Category.deleteMany({}),
        QiitaArticle.deleteMany({})
      ])
      

      // カテゴリーの投入
      const categories = await Category.insertMany(sampleCategories)
      
      // 本の投入
      const books = await Book.insertMany(sampleBooks)
      
      // 記事の投入
      const articles = await QiitaArticle.insertMany(sampleArticles)

      // BookMentionの投入
      const bookMentions = [
        {
          bookId: books[0]._id, // リーダブルコード
          articleId: articles[0]._id,
          mentionedAt: new Date('2024-01-15'),
          extractionMethod: 'manual',
          confidence: 0.95,
          context: 'リーダブルコードの原則について言及された記事',
          mentionText: 'リーダブルコード'
        },
        {
          bookId: books[1]._id, // JavaScript: The Good Parts
          articleId: articles[1]._id,
          mentionedAt: new Date('2024-02-10'),
          extractionMethod: 'manual',
          confidence: 0.90,
          context: 'JavaScript: The Good Partsについて解説された記事',
          mentionText: 'JavaScript: The Good Parts'
        }
      ]

      await BookMention.insertMany(bookMentions)

      // 投入されたデータの確認
      const stats = {
        categories: await Category.countDocuments(),
        books: await Book.countDocuments(),
        articles: await QiitaArticle.countDocuments(),
        mentions: await BookMention.countDocuments()
      }

      return res.json({
        success: true,
        message: 'Sample data inserted successfully',
        data: {
          inserted: {
            categories: categories.length,
            books: books.length,
            articles: articles.length,
            mentions: bookMentions.length
          },
          total: stats
        }
      })

    } catch (error) {
      console.error('Error seeding database:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * データベースの統計を取得
   */
  getStats = async (req: Request, res: Response) => {
    try {
      const stats = {
        categories: await Category.countDocuments(),
        books: await Book.countDocuments(),
        articles: await QiitaArticle.countDocuments(),
        mentions: await BookMention.countDocuments()
      }

      return res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Error getting stats:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to get stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export default new SeedController()