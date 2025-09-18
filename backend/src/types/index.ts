// Re-export frontend types for consistency
export interface Book {
    id: number
    _id?: string
    title: string
    author: string | string[]
    isbn?: string
    isbn10?: string
    isbn13?: string
    publisher?: string
    publishDate?: string
    publishedDate?: string
    publishedYear?: number
    mentionCount: number
    uniqueArticleCount?: number
    category: string | string[]
    tags: string[]
    imageUrl?: string
    amazonUrl?: string
    rakutenUrl?: string
    description?: string
    firstMentionDate?: string
    lastMentionDate?: string
    firstMentionedAt?: string
    lastMentionedAt?: string
    trendScore?: number
    rank?: number
    topQiitaArticles?: QiitaArticle[]
    status?: string
    mergedTo?: string | null
    createdAt?: string
    updatedAt?: string
    articleCount?: number
    totalLikes?: number
    newestArticleDate?: string
    goodBookScore?: number
    rating?: number
}

export interface QiitaArticle {
    id: string
    title: string
    url: string
    author: string
    publishedAt: string
    likesCount: number
    tags: string[]
}

export interface Favorite {
    _id: string
    userId: string
    bookId: string
    createdAt: string
    book?: FavoriteBook
}

export interface FavoriteBook {
    id: number
    title: string
    author: string[]
    imageUrl?: string
    category: string[]
    mentionCount: number
    goodBookScore: number
}

export interface FavoriteQueryParams {
    userId?: string
}

export interface AddFavoriteBody {
    userId: string
    bookId: string
}

export interface RemoveFavoriteBody {
    userId: string
    bookId: string
}

export interface FavoritesApiResponse {
    success: boolean
    data: Favorite[]
    total: number
}

export interface FavoriteActionResponse {
    success: boolean
    message: string
    data?: Favorite
}

export interface BookMention {
    id: string
    bookId: number
    articleId: string
    mentionedAt: string
    context?: string
}

export interface RankingPeriod {
    label: string
    value: 'all' | 'year' | 'month' | 'week' | 'today'
}

export interface Category {
    _id?: string
    label: string
    value: string
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

export interface BookApiResponse {
    success: boolean
    data: Book
    message?: string
}

export interface BooksListApiResponse {
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
        categories?: CategoryStats[]
        searchQuery?: string
        appliedFilters: BookFilters
    }
}

export interface BookFilters {
    category?: string
    search?: string
    period?: string
    sort?: string
    sortOrder?: 'asc' | 'desc'
}

// Backend-specific types
export interface DatabaseConfig {
    uri: string
    options?: {
        maxPoolSize?: number
        serverSelectionTimeoutMS?: number
        socketTimeoutMS?: number
        bufferCommands?: boolean
    }
}

export interface ServerConfig {
    port: number
    env: string
    corsOrigins: string[]
    rateLimit: {
        windowMs: number
        max: number
    }
}

// Request/Response interfaces for Express
export interface BookQueryParams {
    page?: string
    limit?: string
    category?: string
    search?: string
    period?: string
    sort?: string
    sortOrder?: string
}

export interface RankingsQueryParams {
    type?: string
    category?: string
    period?: string
    limit?: string
}

export interface ErrorResponse {
    success: false
    message: string
    error?: string
    code?: string
}

export interface CategoriesApiResponse {
    success: boolean
    data: Category[]
    meta: {
        total: number
        lastUpdated: string
    }
}

export interface CategoryApiResponse {
    success: boolean
    data: Category
    message?: string
}

// Amazon Product Advertising API types
export interface AmazonBookData {
    title?: string
    authors?: string[]
    imageUrl?: string
    amazonUrl?: string
    price?: {
        amount: number
        currency: string
        displayAmount?: string
    }
    isbn10?: string
    isbn13?: string
    asin?: string
    publisher?: string
    publicationDate?: string
    availability?: string
    binding?: string
}

export interface AmazonApiResponse {
    success: boolean
    data?: AmazonBookData
    error?: string
    message?: string
}

export interface AmazonApiCredentials {
    accessKey: string
    secretKey: string
    associateTag: string
    region?: string
    endpoint?: string
}