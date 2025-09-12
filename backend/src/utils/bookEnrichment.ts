import amazonApiService from '@/services/amazonApiService'
import { Book as IBook, AmazonBookData } from '@/types'

interface BookEnrichmentResult {
    success: boolean
    enrichedData?: Partial<IBook>
    source?: 'amazon'
    error?: string
}

/**
 * Enrich book data using external APIs (Amazon)
 */
export async function enrichBookData(book: Partial<IBook>): Promise<BookEnrichmentResult> {
    try {
        // Try to get data from Amazon if we have an ISBN-13
        if (book.isbn13) {
            const amazonResult = await amazonApiService.getBookByIsbn(book.isbn13)
            
            if (amazonResult.success && amazonResult.data) {
                const enrichedData = mergeAmazonData(book, amazonResult.data)
                return {
                    success: true,
                    enrichedData,
                    source: 'amazon'
                }
            }
        }

        // If no ISBN-13 or Amazon lookup failed, try search by title and author
        if (book.title && book.author) {
            const authorString = Array.isArray(book.author) ? book.author[0] : book.author
            const searchResult = await amazonApiService.searchBooks(book.title, authorString)
            
            if (searchResult.success && searchResult.data) {
                const enrichedData = mergeAmazonData(book, searchResult.data)
                return {
                    success: true,
                    enrichedData,
                    source: 'amazon'
                }
            }
        }

        // No enrichment data found
        return {
            success: false,
            error: 'No enrichment data available'
        }

    } catch (error: any) {
        console.error('Error enriching book data:', error)
        return {
            success: false,
            error: error.message || 'Book enrichment failed'
        }
    }
}

/**
 * Merge Amazon data with existing book data
 * Prioritizes existing data over Amazon data to avoid overwriting good data
 */
function mergeAmazonData(existingBook: Partial<IBook>, amazonData: AmazonBookData): Partial<IBook> {
    const enriched: Partial<IBook> = { ...existingBook }

    // Only update fields that are missing or empty
    if (!enriched.title && amazonData.title) {
        enriched.title = amazonData.title
    }

    if ((!enriched.author || enriched.author.length === 0) && amazonData.authors) {
        enriched.author = amazonData.authors
    }

    if (!enriched.imageUrl && amazonData.imageUrl) {
        enriched.imageUrl = amazonData.imageUrl
    }

    if (!enriched.amazonUrl && amazonData.amazonUrl) {
        enriched.amazonUrl = amazonData.amazonUrl
    }

    if (!enriched.isbn10 && amazonData.isbn10) {
        enriched.isbn10 = amazonData.isbn10
    }

    if (!enriched.isbn13 && amazonData.isbn13) {
        enriched.isbn13 = amazonData.isbn13
    }

    if (!enriched.publisher && amazonData.publisher) {
        enriched.publisher = amazonData.publisher
    }

    // Parse publication date if available
    if (!enriched.publishedYear && amazonData.publicationDate) {
        const year = extractYearFromDate(amazonData.publicationDate)
        if (year) {
            enriched.publishedYear = year
        }
    }

    return enriched
}

/**
 * Extract year from various date formats
 */
function extractYearFromDate(dateString: string): number | undefined {
    // Try to extract year from various formats: YYYY-MM-DD, MM/DD/YYYY, etc.
    const yearMatch = dateString.match(/\b(19|20)\d{2}\b/)
    if (yearMatch) {
        return parseInt(yearMatch[0], 10)
    }
    return undefined
}

/**
 * Batch enrich multiple books
 */
export async function enrichMultipleBooks(
    books: Partial<IBook>[], 
    options: { 
        maxConcurrent?: number
        delayMs?: number 
    } = {}
): Promise<BookEnrichmentResult[]> {
    const { maxConcurrent = 3, delayMs = 1000 } = options
    const results: BookEnrichmentResult[] = []
    
    // Process books in batches to respect API rate limits
    for (let i = 0; i < books.length; i += maxConcurrent) {
        const batch = books.slice(i, i + maxConcurrent)
        
        const batchPromises = batch.map(book => enrichBookData(book))
        const batchResults = await Promise.allSettled(batchPromises)
        
        // Process results
        for (const result of batchResults) {
            if (result.status === 'fulfilled') {
                results.push(result.value)
            } else {
                results.push({
                    success: false,
                    error: result.reason?.message || 'Enrichment failed'
                })
            }
        }
        
        // Add delay between batches to respect rate limits
        if (i + maxConcurrent < books.length && delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
    }
    
    return results
}

/**
 * Check if a book needs enrichment
 */
export function needsEnrichment(book: Partial<IBook>): boolean {
    return (
        !book.imageUrl ||
        !book.amazonUrl ||
        !book.isbn10 ||
        !book.publisher ||
        !book.publishedYear
    )
}

/**
 * Get enrichment priority score (higher score = more important to enrich)
 */
export function getEnrichmentPriority(book: Partial<IBook>): number {
    let score = 0
    
    // Books with higher mention counts get priority
    if (book.mentionCount) {
        score += Math.min(book.mentionCount * 10, 100)
    }
    
    // Books with trend score get priority
    if (book.trendScore) {
        score += Math.min(book.trendScore * 5, 50)
    }
    
    // Books with ISBN-13 are easier to enrich
    if (book.isbn13) {
        score += 20
    }
    
    // Books missing critical data get priority
    if (!book.imageUrl) score += 30
    if (!book.amazonUrl) score += 20
    if (!book.publishedYear) score += 10
    
    return score
}

export default {
    enrichBookData,
    enrichMultipleBooks,
    needsEnrichment,
    getEnrichmentPriority
}