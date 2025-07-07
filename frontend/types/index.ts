export interface Book {
    id: number
    title: string
    author: string
    isbn?: string
    publisher?: string
    publishDate?: string
    mentionCount: number
    category: string
    tags: string[]
    imageUrl?: string
    amazonUrl?: string
    description?: string
    firstMentionDate: string
    lastMentionDate: string
    trendScore?: number
    rank?: number
    topQiitaArticles?: QiitaArticle[]
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