export interface Book {
    _id: string
    title: string
    titleNormalized: string
    author: string[]
    publisher?: string | null
    isbn10?: string | null
    isbn13?: string | null
    publishedYear?: number | null
    category: string[]
    tags: string[]
    mentionCount: number
    uniqueArticleCount: number
    firstMentionedAt?: string | null
    lastMentionedAt?: string | null
    trendScore: number
    amazonUrl?: string | null
    rakutenUrl?: string | null
    imageUrl?: string | null
    description?: string | null
    status: 'active' | 'inactive' | 'merged'
    mergedTo?: string | null
    createdAt: string
    updatedAt: string
    // Additional fields for compatibility
    id?: number
    rank?: number
    topQiitaArticles?: QiitaArticle[]
    goodBookScore?: number
    rating?: number
    articleCount?: number
    totalLikes?: number
    newestArticleDate?: string
    publishDate?: string
    publishedDate?: string
    isbn?: string
}

export interface QiitaArticle {
    _id: string
    qiitaId: string
    title: string
    url: string
    authorId: string
    authorName: string
    likesCount: number
    stocksCount: number
    commentsCount: number
    body?: string | null
    excerpt: string
    tags: string[]
    publishedAt: string
    updatedAt: string
    processed: boolean
    processedAt?: string | null
    bookExtractionStatus: 'pending' | 'completed' | 'failed'
    createdAt: string
    lastCheckedAt: string
    // Compatibility fields
    id?: string
    author?: string
}

export interface BookMention {
    _id: string
    bookId: string
    articleId: string
    mentionText: string
    context: string
    confidence: number
    extractionMethod: 'regex' | 'nlp' | 'manual'
    sentiment?: 'positive' | 'neutral' | 'negative' | null
    recommendationLevel?: number | null
    articlePopularity: number
    authorCredibility: number
    mentionWeight: number
    createdAt: string
    verifiedAt?: string | null
    verifiedBy?: string | null
    // Compatibility fields
    id?: string
    mentionedAt?: string
}

export interface RankingPeriod {
    label: string
    value: 'all' | 'year' | 'month' | 'week' | 'today'
}

export interface Category {
    _id: string
    name: string
    slug: string
    description?: string | null
    parentId?: string | null
    displayOrder: number
    isActive: boolean
    color?: string | null
    icon?: string | null
    bookCount: number
    createdAt: string
    updatedAt: string
    // Compatibility fields
    label?: string
    value?: string
}

export interface CategoryOption {
    value: string
    label: string
    description?: string | null
    color?: string | null
    icon?: string | null
    bookCount: number
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success: boolean
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    hasMore: boolean
}

export interface RankingApiResponse {
    success: boolean
    data: Book[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasMore: boolean
        hasNext: boolean
        hasPrev: boolean
    }
    meta: {
        totalBooks: number
        filteredCount: number
        categories: CategoryStats[]
        searchQuery?: string
        appliedFilters: {
            category?: string
            search?: string
            period?: string
            sort?: string
        }
    }
}

export interface CategoryStats {
    category: string
    count: number
    label: string
}

// API Response Types
export interface BookApiResponse {
    success: boolean
    data: Book
    message?: string
}

export interface RankingItem {
    rank: number
    bookId: string
    mentionCount: number
    trendScore: number
    change: number
    book: Book | null
}

export interface RankingData {
    _id: string
    type: string
    categoryId: string | null
    period: string
    rankings: RankingItem[]
    totalBooks: number
    generatedAt: string
    expiresAt?: string
    createdAt: string
}

export interface DetailedRankingApiResponse {
    success: boolean
    data: RankingData
    meta: {
        requestedType: string
        requestedCategoryId?: string
        requestedPeriod: string
        requestedLimit: number
        actualCount: number
        lastUpdated: string
    }
}

export interface Mention {
    id: string
    title: string
    url: string
    context: string
    confidence: number
    sentiment: 'positive' | 'negative' | 'neutral'
    publishedAt: string
    likesCount: number
}

export interface MentionsApiResponse {
    success: boolean
    data: Mention[]
    message?: string
}

// Pagination Types
export interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
    hasNext: boolean
    hasPrev: boolean
}

export interface BooksListApiResponse {
    success: boolean
    data: Book[]
    pagination: PaginationInfo
    meta: {
        totalBooks: number
        filteredCount: number
        categories?: CategoryStats[]
        searchQuery?: string
        appliedFilters: BookFilters
    }
}

// Search API Types
export interface SearchResultItem {
    type: 'book' | 'article' | 'category'
}

export interface BookSearchResult extends Book, SearchResultItem {
    type: 'book'
}

export interface ArticleSearchResult extends QiitaArticle, SearchResultItem {
    type: 'article'
}

export interface CategorySearchResult extends SearchResultItem {
    type: 'category'
    _id: string
    name: string
    description?: string
    bookCount: number
    isActive: boolean
}

export interface SearchResults {
    books: BookSearchResult[]
    articles: ArticleSearchResult[]
    categories: CategorySearchResult[]
}

export interface SearchApiResponse {
    success: boolean
    data: SearchResults
    meta: {
        query: string
        type: string
        totalResults: number
        counts: {
            books: number
            articles: number
            categories: number
        }
        limit: number
        searchTime: number
    }
}

// New MongoDB-based interfaces
export interface Ranking {
    _id: string
    type: 'overall' | 'category' | 'trending' | 'newcomer'
    categoryId?: string | null
    period: 'all' | 'year' | 'month' | 'week'
    rankings: RankingItem[]
    totalBooks: number
    generatedAt: string
    expiresAt: string
    createdAt: string
}

export interface Favorite {
    _id: string
    userId: string
    bookId: string
    createdAt: string
}

export interface BatchLog {
    _id: string
    batchType: 'qiita_fetch' | 'book_extraction' | 'ranking_update' | 'cache_update'
    status: 'running' | 'completed' | 'failed' | 'cancelled'
    startedAt: string
    completedAt?: string | null
    duration?: number | null
    processedCount: number
    successCount: number
    errorCount: number
    errors?: any[] | null
    config?: any | null
    createdAt: string
}

// Filter Types
export interface BookFilters {
    category?: string
    search?: string
    period?: string
    sort?: string
}

// Generic Types for better type safety
export interface ExtendedHTMLElement extends HTMLElement {
    __observer?: IntersectionObserver
}