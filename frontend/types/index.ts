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
    // 「いい本スコア」関連フィールド
    articleCount?: number        // 紹介記事数
    totalLikes?: number         // 記事のいいね合計
    newestArticleDate?: string  // 最新記事日（ISO形式）
    goodBookScore?: number      // 「いい本スコア」（0-100）
    rating?: number             // 既存の評価（互換性維持）
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
    label: string
    value: string
    description?: string
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