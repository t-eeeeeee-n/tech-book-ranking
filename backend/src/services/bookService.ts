import { Book } from '@/models'
import { BookFilters, BooksListApiResponse, BookApiResponse, CategoryStats, Book as IBook } from '@/types'
import { createError } from '@/middleware/errorHandler'
import mongoose from 'mongoose'

export class BookService {
    async getBooks(filters: BookFilters, page: number = 1, limit: number = 20): Promise<BooksListApiResponse> {
        try {
            const skip = (page - 1) * limit

            // Build query based on filters
            const query: any = { status: 'active' }

            // Category filter
            if (filters.category) {
                query.category = { $in: [filters.category] }
            }

            // Search filter
            if (filters.search) {
                query.$text = { $search: filters.search }
            }

            // Period filter (based on lastMentionedAt)
            if (filters.period && filters.period !== 'all') {
                const now = new Date()
                let startDate: Date

                switch (filters.period) {
                    case 'today':
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                        break
                    case 'week':
                        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        break
                    case 'month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                        break
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1)
                        break
                    default:
                        startDate = new Date(0)
                }

                query.lastMentionedAt = { $gte: startDate }
            }

            // Build sort criteria
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1
            let sortCriteria: any = {}
            
            switch (filters.sort) {
                case 'mentionCount':
                    sortCriteria = { mentionCount: sortOrder, trendScore: sortOrder }
                    break
                case 'trendScore':
                    sortCriteria = { trendScore: sortOrder, mentionCount: sortOrder }
                    break
                case 'publishedYear':
                    sortCriteria = { publishedYear: sortOrder, mentionCount: -1 }
                    break
                // Legacy support for existing frontend values
                case 'mentions':
                    sortCriteria = { mentionCount: sortOrder, trendScore: sortOrder }
                    break
                case 'trend':
                    sortCriteria = { trendScore: sortOrder, mentionCount: sortOrder }
                    break
                case 'newest':
                    sortCriteria = { lastMentionedAt: -1 }
                    break
                case 'oldest':
                    sortCriteria = { firstMentionedAt: 1 }
                    break
                case 'title':
                    sortCriteria = { title: sortOrder }
                    break
                default:
                    sortCriteria = { mentionCount: sortOrder, trendScore: sortOrder }
            }

            // Execute queries in parallel
            const [books, total, totalBooks, categories] = await Promise.all([
                Book.find(query)
                    .sort(sortCriteria)
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                Book.countDocuments(query),
                Book.countDocuments({ status: 'active' }),
                this.getCategoryStats()
            ])

            // Add rank to books and convert ObjectId to string
            const booksWithRank = books.map((book: any, index: number) => ({
                ...book,
                id: book._id.toString(),
                _id: book._id.toString(),
                rank: skip + index + 1
            }))

            const totalPages = Math.ceil(total / limit)
            const hasNext = page < totalPages
            const hasPrev = page > 1

            return {
                success: true,
                data: booksWithRank,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasMore: hasNext,
                    hasNext,
                    hasPrev
                },
                meta: {
                    totalBooks,
                    filteredCount: total,
                    categories,
                    searchQuery: filters.search,
                    appliedFilters: filters
                }
            }
        } catch (error) {
            console.error('Error in BookService.getBooks:', error)
            throw createError('Failed to fetch books', 500)
        }
    }

    async getBookById(id: string): Promise<BookApiResponse> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw createError('Invalid book ID format', 400)
            }

            const book = await Book.findOne({ 
                _id: id, 
                status: 'active' 
            }).lean().exec()

            if (!book) {
                throw createError('Book not found', 404)
            }

            return {
                success: true,
                data: {
                    ...book,
                    id: book._id.toString(),
                    _id: book._id.toString()
                } as any
            }
        } catch (error) {
            if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('not found'))) {
                throw error
            }
            console.error('Error in BookService.getBookById:', error instanceof Error ? error.message : 'Unknown error')
            throw createError('Failed to fetch book', 500)
        }
    }

    async createBook(bookData: Partial<IBook>): Promise<BookApiResponse> {
        try {
            // Check for duplicates by isbn13 first
            if (bookData.isbn13) {
                const existingBook = await Book.findOne({ 
                    isbn13: bookData.isbn13,
                    status: { $ne: 'merged' } // Don't count merged books
                }).lean().exec()

                if (existingBook) {
                    throw createError('A book with this ISBN13 already exists', 409, 'DUPLICATE_BOOK')
                }
            }

            // Normalize title for better duplicate detection
            const titleNormalized = bookData.title
                ?.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim()

            // Ensure arrays are properly formatted
            const author = Array.isArray(bookData.author) ? bookData.author : [bookData.author as string]
            const category = Array.isArray(bookData.category) ? bookData.category : [bookData.category as string]
            const tags = bookData.tags || []

            // Create the book document
            const newBook = new Book({
                title: bookData.title,
                titleNormalized,
                author: author.filter(Boolean),
                publisher: bookData.publisher,
                isbn10: bookData.isbn10,
                isbn13: bookData.isbn13,
                publishedYear: bookData.publishedYear,
                category: category.filter(Boolean),
                tags: tags.filter(Boolean),
                amazonUrl: bookData.amazonUrl,
                rakutenUrl: bookData.rakutenUrl,
                imageUrl: bookData.imageUrl,
                description: bookData.description,
                mentionCount: 0,
                uniqueArticleCount: 0,
                trendScore: 0,
                status: 'active'
            })

            const savedBook = await newBook.save()

            return {
                success: true,
                data: {
                    ...savedBook.toObject(),
                    id: savedBook._id.toString(),
                    _id: savedBook._id.toString()
                } as any,
                message: 'Book created successfully'
            }
        } catch (error) {
            if (error instanceof Error) {
                // Handle duplicate key errors from MongoDB
                if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
                    throw createError('A book with this ISBN already exists', 409, 'DUPLICATE_BOOK')
                }
                // Re-throw custom errors
                if (error.message.includes('already exists') || error.message.includes('ISBN13')) {
                    throw error
                }
            }
            console.error('Error in BookService.createBook:', error instanceof Error ? error.message : 'Unknown error')
            throw createError('Failed to create book', 500)
        }
    }

    async updateBook(id: string, updateData: Partial<IBook>): Promise<BookApiResponse> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw createError('Invalid book ID format', 400)
            }

            // Check for ISBN13 duplicates if updating ISBN13
            if (updateData.isbn13) {
                const existingBook = await Book.findOne({ 
                    isbn13: updateData.isbn13,
                    _id: { $ne: id },
                    status: { $ne: 'merged' }
                }).lean().exec()

                if (existingBook) {
                    throw createError('A book with this ISBN13 already exists', 409, 'DUPLICATE_BOOK')
                }
            }

            // Prepare update object
            const updateObject: any = {}

            // Handle title normalization if title is being updated
            if (updateData.title) {
                updateObject.title = updateData.title
                updateObject.titleNormalized = updateData.title
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
            }

            // Handle array/string conversions
            if (updateData.author !== undefined) {
                updateObject.author = Array.isArray(updateData.author) 
                    ? updateData.author.filter(Boolean)
                    : [updateData.author as string].filter(Boolean)
            }

            if (updateData.category !== undefined) {
                updateObject.category = Array.isArray(updateData.category) 
                    ? updateData.category.filter(Boolean)
                    : [updateData.category as string].filter(Boolean)
            }

            if (updateData.tags !== undefined) {
                updateObject.tags = updateData.tags.filter(Boolean)
            }

            // Add other fields directly
            const directFields = [
                'publisher', 'isbn10', 'isbn13', 'publishedYear',
                'amazonUrl', 'rakutenUrl', 'imageUrl', 'description'
            ]

            directFields.forEach(field => {
                if (updateData[field as keyof IBook] !== undefined) {
                    updateObject[field] = updateData[field as keyof IBook]
                }
            })

            // Find and update the book
            const updatedBook = await Book.findOneAndUpdate(
                { _id: id, status: 'active' },
                { $set: updateObject },
                { new: true, runValidators: true }
            ).lean().exec()

            if (!updatedBook) {
                throw createError('Book not found', 404)
            }

            return {
                success: true,
                data: {
                    ...updatedBook,
                    id: updatedBook._id.toString(),
                    _id: updatedBook._id.toString()
                } as any,
                message: 'Book updated successfully'
            }
        } catch (error) {
            if (error instanceof Error) {
                // Handle duplicate key errors from MongoDB
                if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
                    throw createError('A book with this ISBN already exists', 409, 'DUPLICATE_BOOK')
                }
                // Re-throw custom errors (validation, not found, etc.)
                if (error.message.includes('Invalid') || 
                    error.message.includes('not found') || 
                    error.message.includes('already exists')) {
                    throw error
                }
            }
            console.error('Error in BookService.updateBook:', error instanceof Error ? error.message : 'Unknown error')
            throw createError('Failed to update book', 500)
        }
    }

    async deleteBook(id: string): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw createError('Invalid book ID format', 400)
            }

            // Soft delete: set status to 'inactive'
            const deletedBook = await Book.findOneAndUpdate(
                { _id: id, status: 'active' },
                { $set: { status: 'inactive' } },
                { new: true }
            ).lean().exec()

            if (!deletedBook) {
                throw createError('Book not found', 404)
            }

            // No return value for 204 No Content
        } catch (error) {
            if (error instanceof Error) {
                // Re-throw custom errors (validation, not found)
                if (error.message.includes('Invalid') || error.message.includes('not found')) {
                    throw error
                }
            }
            console.error('Error in BookService.deleteBook:', error instanceof Error ? error.message : 'Unknown error')
            throw createError('Failed to delete book', 500)
        }
    }

    private async getCategoryStats(): Promise<CategoryStats[]> {
        try {
            const stats = await Book.aggregate([
                { $match: { status: 'active' } },
                { $unwind: '$category' },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        category: '$_id',
                        count: 1,
                        label: '$_id',
                        _id: 0
                    }
                },
                { $sort: { count: -1 } }
            ])

            return stats
        } catch (error) {
            console.error('Error getting category stats:', error instanceof Error ? error.message : 'Unknown error')
            return []
        }
    }
}

export default new BookService()