#!/usr/bin/env ts-node

import { program } from 'commander'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Book } from '@/models'
import amazonApiService from '@/services/amazonApiService'
import { enrichBookData, enrichMultipleBooks, needsEnrichment, getEnrichmentPriority } from '@/utils/bookEnrichment'

// Load environment variables
dotenv.config()

class BookEnrichmentRunner {
    async connectToDatabase(): Promise<void> {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techbook-ranking'
        console.log('📦 Connecting to MongoDB...')
        
        await mongoose.connect(mongoUri)
        console.log('✅ Connected to MongoDB')
    }

    async testAmazonConnection(): Promise<void> {
        console.log('🔍 Testing Amazon API connection...')
        
        try {
            const isConnected = await amazonApiService.testConnection()
            if (isConnected) {
                console.log('✅ Amazon API connection successful')
            } else {
                console.log('❌ Amazon API connection failed')
                process.exit(1)
            }
        } catch (error) {
            console.error('💥 Amazon API test failed:', error)
            process.exit(1)
        }
    }

    async enrichSingleBook(isbn: string): Promise<void> {
        console.log(`🔍 Enriching book with ISBN: ${isbn}`)
        
        try {
            const result = await amazonApiService.getBookByIsbn(isbn)
            
            if (result.success && result.data) {
                console.log('📚 Book data retrieved:')
                console.log(`   Title: ${result.data.title}`)
                console.log(`   Authors: ${result.data.authors?.join(', ')}`)
                console.log(`   Publisher: ${result.data.publisher}`)
                console.log(`   Publication Date: ${result.data.publicationDate}`)
                console.log(`   Price: ${result.data.price?.displayAmount}`)
                console.log(`   Image: ${result.data.imageUrl}`)
                console.log(`   Amazon URL: ${result.data.amazonUrl}`)
            } else {
                console.log('❌ Failed to retrieve book data:')
                console.log(`   Error: ${result.error}`)
                console.log(`   Message: ${result.message}`)
            }
        } catch (error) {
            console.error('💥 Error enriching book:', error)
        }
    }

    async enrichDatabaseBooks(options: {
        limit?: number
        priority?: boolean
        dryRun?: boolean
        forceUpdate?: boolean
    } = {}): Promise<void> {
        const { limit = 10, priority = true, dryRun = false, forceUpdate = false } = options
        
        console.log(`🔄 Enriching database books...`)
        console.log(`   Limit: ${limit}`)
        console.log(`   Priority-based: ${priority}`)
        console.log(`   Dry run: ${dryRun}`)
        console.log(`   Force update: ${forceUpdate}`)
        console.log('')

        // Find books that need enrichment
        let query: any = { status: 'active' }
        
        if (!forceUpdate) {
            // Only books that need enrichment
            query.$or = [
                { imageUrl: { $exists: false } },
                { imageUrl: null },
                { imageUrl: '' },
                { amazonUrl: { $exists: false } },
                { amazonUrl: null },
                { amazonUrl: '' },
                { publishedYear: { $exists: false } },
                { publishedYear: null }
            ]
        }

        let books = await Book.find(query)
            .select('title author isbn13 isbn10 publisher publishedYear imageUrl amazonUrl mentionCount trendScore')
            .lean()

        console.log(`📊 Found ${books.length} books to process`)

        if (books.length === 0) {
            console.log('✅ No books need enrichment')
            return
        }

        // Sort by priority if requested
        if (priority) {
            // Convert ObjectId to string for compatibility with getEnrichmentPriority
            const booksForSorting = books.map(book => ({
                ...book,
                _id: book._id.toString()
            }))
            const sortedBooks = booksForSorting.sort((a, b) => getEnrichmentPriority(b) - getEnrichmentPriority(a))
            // Map back to original structure but preserve sort order
            books = sortedBooks.map(sortedBook => {
                const originalBook = books.find(b => b._id.toString() === sortedBook._id)!
                return originalBook
            })
            console.log('📈 Books sorted by enrichment priority')
        }

        // Limit results
        books = books.slice(0, limit)

        let enrichedCount = 0
        let errorCount = 0

        console.log(`\n🚀 Starting enrichment of ${books.length} books...\n`)

        for (let i = 0; i < books.length; i++) {
            const book = books[i]
            console.log(`[${i + 1}/${books.length}] Processing: "${book.title}"`)
            
            try {
                // Convert ObjectId to string for compatibility
                const bookForEnrichment = {
                    ...book,
                    _id: book._id.toString()
                }
                const enrichmentResult = await enrichBookData(bookForEnrichment)
                
                if (enrichmentResult.success && enrichmentResult.enrichedData) {
                    console.log(`   ✅ Enrichment successful (source: ${enrichmentResult.source})`)
                    
                    // Show what would be updated
                    const changes: string[] = []
                    if (enrichmentResult.enrichedData.imageUrl && enrichmentResult.enrichedData.imageUrl !== book.imageUrl) {
                        changes.push('image URL')
                    }
                    if (enrichmentResult.enrichedData.amazonUrl && enrichmentResult.enrichedData.amazonUrl !== book.amazonUrl) {
                        changes.push('Amazon URL')
                    }
                    if (enrichmentResult.enrichedData.publishedYear && enrichmentResult.enrichedData.publishedYear !== book.publishedYear) {
                        changes.push(`published year (${enrichmentResult.enrichedData.publishedYear})`)
                    }
                    if (enrichmentResult.enrichedData.isbn10 && enrichmentResult.enrichedData.isbn10 !== book.isbn10) {
                        changes.push('ISBN-10')
                    }
                    if (enrichmentResult.enrichedData.publisher && enrichmentResult.enrichedData.publisher !== book.publisher) {
                        changes.push(`publisher (${enrichmentResult.enrichedData.publisher})`)
                    }

                    if (changes.length > 0) {
                        console.log(`   📝 Would update: ${changes.join(', ')}`)
                        
                        if (!dryRun) {
                            await Book.findByIdAndUpdate(book._id, enrichmentResult.enrichedData)
                            console.log(`   💾 Book updated in database`)
                        }
                        enrichedCount++
                    } else {
                        console.log(`   ⏭️  No new data found`)
                    }
                } else {
                    console.log(`   ❌ Enrichment failed: ${enrichmentResult.error}`)
                    errorCount++
                }
            } catch (error) {
                console.error(`   💥 Error processing book: ${error}`)
                errorCount++
            }

            // Rate limiting - be nice to Amazon API
            if (i < books.length - 1) {
                console.log('   ⏳ Waiting 1 second...')
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }

        console.log(`\n📊 Enrichment Summary:`)
        console.log(`   Books processed: ${books.length}`)
        console.log(`   Successfully enriched: ${enrichedCount}`)
        console.log(`   Errors: ${errorCount}`)
        console.log(`   Success rate: ${((enrichedCount / books.length) * 100).toFixed(1)}%`)
    }

    async run(options: any): Promise<void> {
        try {
            await this.connectToDatabase()
            
            if (options.testConnection) {
                await this.testAmazonConnection()
                return
            }

            if (options.isbn) {
                await this.enrichSingleBook(options.isbn)
                return
            }

            await this.enrichDatabaseBooks({
                limit: parseInt(options.limit || '10'),
                priority: !options.noPriority,
                dryRun: options.dryRun,
                forceUpdate: options.forceUpdate
            })
            
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
    .name('enrichBooks')
    .description('Enrich book data using Amazon Product Advertising API')
    .version('1.0.0')

program
    .option('--test-connection', 'Test Amazon API connection')
    .option('--isbn <isbn>', 'Enrich a single book by ISBN-13')
    .option('-l, --limit <limit>', 'Number of books to process', '10')
    .option('--no-priority', 'Disable priority-based sorting')
    .option('--dry-run', 'Show what would be updated without making changes')
    .option('--force-update', 'Update all books, not just those needing enrichment')

program.action(async (options) => {
    const runner = new BookEnrichmentRunner()
    await runner.run(options)
})

// Make the script executable
if (require.main === module) {
    program.parse()
}