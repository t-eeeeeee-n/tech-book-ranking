#!/usr/bin/env ts-node

import { program } from 'commander'
import axios, { AxiosInstance } from 'axios'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Book, QiitaArticle, BookMention } from '@/models'

// Load environment variables
dotenv.config()

interface QiitaArticleResponse {
  id: string
  title: string
  url: string
  user: {
    id: string
    name?: string
  }
  created_at: string
  likes_count: number
  tags: Array<{
    name: string
  }>
  body?: string
}

interface BookMatch {
  book: any
  confidence: number
  matchedText: string
}

export class QiitaFetcher {
  private apiClient: AxiosInstance
  private bookTitleCache: Map<string, any> = new Map()

  constructor(token: string) {
    this.apiClient = axios.create({
      baseURL: 'https://qiita.com/api/v2',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
  }

  async connectToDatabase(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techbook-ranking'
    console.log('📦 Connecting to MongoDB...')
    
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    // Cache book titles for faster matching
    await this.buildBookTitleCache()
  }

  async buildBookTitleCache(): Promise<void> {
    console.log('🔍 Building book title cache...')
    const books = await Book.find({ status: 'active' }).lean()
    
    for (const book of books) {
      // Store normalized versions of titles for matching
      const normalizedTitle = this.normalizeTitle(book.title)
      this.bookTitleCache.set(normalizedTitle, book)
      
      // Also cache by words in title for partial matching
      const titleWords = normalizedTitle.split(/\s+/).filter(word => word.length > 2)
      for (const word of titleWords) {
        if (!this.bookTitleCache.has(word)) {
          this.bookTitleCache.set(word, book)
        }
      }
    }
    
    console.log(`📚 Cached ${books.length} books with ${this.bookTitleCache.size} searchable terms`)
  }

  normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  async fetchRecentArticles(query: string = '', page: number = 1, perPage: number = 20): Promise<QiitaArticleResponse[]> {
    try {
      console.log(`🔍 Fetching articles (page ${page}, per_page: ${perPage})${query ? ` for query: "${query}"` : ''}...`)
      
      const params: any = {
        page,
        per_page: perPage,
        query: query || 'created:>2024-01-01 stocks:>5' // Default: recent articles with some popularity
      }

      const response = await this.apiClient.get<QiitaArticleResponse[]>('/items', { params })
      console.log(`📄 Found ${response.data.length} articles`)
      
      return response.data
    } catch (error) {
      console.error('❌ Error fetching articles:', error)
      throw error
    }
  }

  findBookMatches(articleText: string, articleTitle: string): BookMatch[] {
    const matches: BookMatch[] = []
    const searchText = `${articleTitle} ${articleText}`.toLowerCase()
    
    // Direct title matching (high confidence)
    for (const [normalizedTitle, book] of this.bookTitleCache) {
      if (normalizedTitle.length > 10 && searchText.includes(normalizedTitle)) {
        matches.push({
          book,
          confidence: 0.9,
          matchedText: normalizedTitle
        })
      }
    }

    // Word-based matching (medium confidence)
    const words = searchText.split(/\s+/)
    const bookKeywords = ['本', 'book', '書籍', '参考書', 'おすすめ', 'recommend']
    
    if (words.some(word => bookKeywords.includes(word))) {
      for (const [term, book] of this.bookTitleCache) {
        if (term.length > 3) {
          const wordMatches = words.filter(word => word.includes(term)).length
          if (wordMatches > 0) {
            const existing = matches.find(m => m.book._id.toString() === book._id.toString())
            if (!existing) {
              matches.push({
                book,
                confidence: Math.min(0.7, wordMatches * 0.2),
                matchedText: term
              })
            }
          }
        }
      }
    }

    // Sort by confidence and remove duplicates
    const uniqueMatches = matches
      .filter((match, index, self) => 
        index === self.findIndex(m => m.book._id.toString() === match.book._id.toString())
      )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5) // Limit to top 5 matches

    return uniqueMatches.filter(match => match.confidence > 0.3) // Minimum confidence threshold
  }

  async saveArticle(article: QiitaArticleResponse): Promise<any> {
    try {
      const existingArticle = await QiitaArticle.findOne({ qiitaId: article.id })
      if (existingArticle) {
        console.log(`⏭️  Article already exists: ${article.title}`)
        return existingArticle
      }

      const qiitaArticleDoc = new QiitaArticle({
        qiitaId: article.id,
        title: article.title,
        url: article.url,
        author: article.user.name || article.user.id,
        publishedAt: article.created_at,
        likesCount: article.likes_count,
        tags: article.tags.map(tag => tag.name)
      })

      const savedArticle = await qiitaArticleDoc.save()
      console.log(`💾 Saved article: ${article.title}`)
      return savedArticle
    } catch (error) {
      console.error(`❌ Error saving article "${article.title}":`, error)
      throw error
    }
  }

  async saveMentions(articleId: mongoose.Types.ObjectId, bookMatches: BookMatch[]): Promise<void> {
    const mentionDate = new Date()
    let savedCount = 0

    for (const match of bookMatches) {
      try {
        const existingMention = await BookMention.findOne({
          bookId: match.book._id,
          articleId: articleId
        })

        if (existingMention) {
          console.log(`⏭️  Mention already exists for book: ${match.book.title}`)
          continue
        }

        const mentionDoc = new BookMention({
          bookId: match.book._id,
          articleId: articleId,
          mentionedAt: mentionDate
        })

        await mentionDoc.save()
        console.log(`📖 Saved mention: "${match.book.title}" (confidence: ${match.confidence.toFixed(2)})`)
        savedCount++

        // Update book statistics
        await this.updateBookStats(match.book._id)
        
      } catch (error) {
        console.error(`❌ Error saving mention for book "${match.book.title}":`, error)
      }
    }

    console.log(`✅ Saved ${savedCount} new mentions`)
  }

  async updateBookStats(bookId: mongoose.Types.ObjectId): Promise<void> {
    try {
      const mentionCount = await BookMention.countDocuments({ bookId })
      const uniqueArticleCount = await BookMention.distinct('articleId', { bookId }).then(ids => ids.length)
      
      const mentions = await BookMention.find({ bookId }).sort({ mentionedAt: 1 })
      const firstMention = mentions[0]
      const lastMention = mentions[mentions.length - 1]

      // Calculate trend score (mentions in last 30 days weighted more heavily)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const recentMentions = await BookMention.countDocuments({
        bookId,
        mentionedAt: { $gte: thirtyDaysAgo }
      })
      
      const trendScore = mentionCount + (recentMentions * 2)

      await Book.findByIdAndUpdate(bookId, {
        mentionCount,
        uniqueArticleCount,
        firstMentionedAt: firstMention?.createdAt,
        lastMentionedAt: lastMention?.createdAt,
        trendScore
      })
    } catch (error) {
      console.error(`❌ Error updating book stats for ${bookId}:`, error)
    }
  }

  async processArticles(articles: QiitaArticleResponse[], minConfidence: number = 0.5): Promise<void> {
    console.log(`🔄 Processing ${articles.length} articles...`)
    let processedCount = 0
    let mentionCount = 0

    for (const article of articles) {
      try {
        // Save the article
        const savedArticle = await this.saveArticle(article)
        
        // Skip processing if article already existed
        if (await QiitaArticle.findOne({ qiitaId: article.id })) {
          // Find book matches in article content
          const articleContent = article.body || ''
          const bookMatches = this.findBookMatches(articleContent, article.title)
          
          // Filter by confidence threshold
          const validMatches = bookMatches.filter(match => match.confidence >= minConfidence)
          
          if (validMatches.length > 0) {
            console.log(`📚 Found ${validMatches.length} book matches for: "${article.title}"`)
            await this.saveMentions(savedArticle._id, validMatches)
            mentionCount += validMatches.length
          }
        }
        
        processedCount++
      } catch (error) {
        console.error(`❌ Error processing article "${article.title}":`, error)
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   Articles processed: ${processedCount}`)
    console.log(`   Total mentions found: ${mentionCount}`)
  }

  async run(options: {
    query?: string
    pages?: number
    perPage?: number
    minConfidence?: number
  } = {}): Promise<void> {
    try {
      await this.connectToDatabase()
      
      const {
        query = '',
        pages = 1,
        perPage = 20,
        minConfidence = 0.5
      } = options

      console.log(`🚀 Starting Qiita fetch process...`)
      console.log(`   Query: "${query || 'default'}"`)
      console.log(`   Pages: ${pages}`)
      console.log(`   Per page: ${perPage}`)
      console.log(`   Min confidence: ${minConfidence}`)
      console.log('')

      let allArticles: QiitaArticleResponse[] = []

      for (let page = 1; page <= pages; page++) {
        const articles = await this.fetchRecentArticles(query, page, perPage)
        allArticles = allArticles.concat(articles)
        
        if (articles.length < perPage) {
          console.log('📄 Reached end of results')
          break
        }

        // Rate limiting - be nice to Qiita API
        if (page < pages) {
          console.log('⏳ Waiting 1 second before next request...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      await this.processArticles(allArticles, minConfidence)
      
    } catch (error) {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    } finally {
      await mongoose.connection.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// CLI setup
program
  .name('fetchQiita')
  .description('Fetch Qiita articles and match them to registered books')
  .version('1.0.0')

program
  .option('-t, --token <token>', 'Qiita API token (or set QIITA_TOKEN env var)')
  .option('-q, --query <query>', 'Search query for Qiita articles')
  .option('-p, --pages <pages>', 'Number of pages to fetch', '1')
  .option('--per-page <perPage>', 'Articles per page (max 100)', '20')
  .option('-c, --confidence <confidence>', 'Minimum confidence for book matches', '0.5')
  .option('--dry-run', 'Show what would be processed without saving')
  
program.action(async (options) => {
  const token = options.token || process.env.QIITA_TOKEN
  
  if (!token) {
    console.error('❌ Qiita API token is required. Use --token option or set QIITA_TOKEN environment variable')
    process.exit(1)
  }

  const fetcher = new QiitaFetcher(token)
  
  await fetcher.run({
    query: options.query,
    pages: parseInt(options.pages),
    perPage: parseInt(options.perPage),
    minConfidence: parseFloat(options.confidence)
  })
})

// Make the script executable
if (require.main === module) {
  program.parse()
}