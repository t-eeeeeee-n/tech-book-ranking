// Mock database with comprehensive data for all collections aligned with MongoDB schema
export const mockDatabase = {
  "books": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "詳解 TypeScript",
      "titleNormalized": "詳解typescript",
      "author": ["山田太郎", "佐藤花子"],
      "publisher": "技術評論社",
      "isbn10": "4297123456",
      "isbn13": "9784297123456",
      "publishedYear": 2023,
      "category": ["プログラミング言語", "JavaScript"],
      "tags": ["TypeScript", "JavaScript", "Web開発", "型システム"],
      "mentionCount": 127,
      "uniqueArticleCount": 89,
      "firstMentionedAt": "2023-03-15T09:30:00.000Z",
      "lastMentionedAt": "2024-01-20T14:22:00.000Z",
      "trendScore": 85.7,
      "amazonUrl": "https://amazon.co.jp/dp/B0C1234567",
      "rakutenUrl": "https://books.rakuten.co.jp/rb/17123456",
      "imageUrl": "https://example.com/book-cover-1.jpg",
      "description": "TypeScriptの基礎から応用まで詳しく解説した実践書",
      "status": "active",
      "mergedTo": null,
      "createdAt": "2023-03-10T08:00:00.000Z",
      "updatedAt": "2024-01-20T14:22:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "React実践入門",
      "titleNormalized": "react実践入門",
      "author": ["田中一郎"],
      "publisher": "オライリー・ジャパン",
      "isbn10": "4873119456",
      "isbn13": "9784873119456",
      "publishedYear": 2022,
      "category": ["Web開発", "JavaScript"],
      "tags": ["React", "JavaScript", "フロントエンド", "SPA"],
      "mentionCount": 94,
      "uniqueArticleCount": 67,
      "firstMentionedAt": "2022-11-08T10:15:00.000Z",
      "lastMentionedAt": "2024-01-18T16:45:00.000Z",
      "trendScore": 72.3,
      "amazonUrl": "https://amazon.co.jp/dp/B0C2345678",
      "rakutenUrl": "https://books.rakuten.co.jp/rb/17234567",
      "imageUrl": "https://example.com/book-cover-2.jpg",
      "description": "Reactの実践的な開発手法を学べる入門書",
      "status": "active",
      "mergedTo": null,
      "createdAt": "2022-11-01T12:00:00.000Z",
      "updatedAt": "2024-01-18T16:45:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "title": "機械学習実装ハンドブック",
      "titleNormalized": "機械学習実装ハンドブック",
      "author": ["鈴木次郎", "高橋三郎"],
      "publisher": "翔泳社",
      "isbn10": "4798167890",
      "isbn13": "9784798167890",
      "publishedYear": 2023,
      "category": ["AI・機械学習", "Python"],
      "tags": ["機械学習", "Python", "AI", "深層学習", "データ分析"],
      "mentionCount": 156,
      "uniqueArticleCount": 112,
      "firstMentionedAt": "2023-05-20T07:30:00.000Z",
      "lastMentionedAt": "2024-01-22T11:15:00.000Z",
      "trendScore": 91.2,
      "amazonUrl": "https://amazon.co.jp/dp/B0C3456789",
      "rakutenUrl": null,
      "imageUrl": "https://example.com/book-cover-3.jpg",
      "description": "機械学習の実装に特化した実践的なハンドブック",
      "status": "active",
      "mergedTo": null,
      "createdAt": "2023-05-15T10:00:00.000Z",
      "updatedAt": "2024-01-22T11:15:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "title": "Clean Code アジャイル開発者の職人気質",
      "titleNormalized": "cleancode",
      "author": ["Robert C. Martin"],
      "publisher": "KADOKAWA",
      "isbn10": "4048860690",
      "isbn13": "9784048860697",
      "publishedYear": 2017,
      "category": ["プログラミング", "設計"],
      "tags": ["Clean Code", "設計", "リファクタリング", "保守性"],
      "mentionCount": 203,
      "uniqueArticleCount": 145,
      "firstMentionedAt": "2018-01-12T14:20:00.000Z",
      "lastMentionedAt": "2024-01-19T09:30:00.000Z",
      "trendScore": 68.9,
      "amazonUrl": "https://amazon.co.jp/dp/B0C4567890",
      "rakutenUrl": "https://books.rakuten.co.jp/rb/17345678",
      "imageUrl": "https://example.com/book-cover-4.jpg",
      "description": "プログラマーとして成長するための必読書",
      "status": "active",
      "mergedTo": null,
      "createdAt": "2018-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-19T09:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "title": "Vue.js 3 実践ガイド",
      "titleNormalized": "vuejs3実践ガイド",
      "author": ["山田太郎", "田中花子"],
      "publisher": "マイナビ出版",
      "isbn10": "4839975234",
      "isbn13": "9784839975234",
      "publishedYear": 2023,
      "category": ["Web開発", "JavaScript"],
      "tags": ["Vue.js", "JavaScript", "フロントエンド", "SPA"],
      "mentionCount": 78,
      "uniqueArticleCount": 55,
      "firstMentionedAt": "2023-07-12T11:20:00.000Z",
      "lastMentionedAt": "2024-01-21T15:30:00.000Z",
      "trendScore": 79.4,
      "amazonUrl": "https://amazon.co.jp/dp/B0C5678901",
      "rakutenUrl": null,
      "imageUrl": "https://example.com/book-cover-5.jpg",
      "description": "Vue.js 3の新機能と実践的な使い方を解説",
      "status": "active",
      "mergedTo": null,
      "createdAt": "2023-07-01T00:00:00.000Z",
      "updatedAt": "2024-01-21T15:30:00.000Z"
    }
  ],
  "qiita_articles": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9e0",
      "qiitaId": "1a2b3c4d5e6f",
      "title": "TypeScriptで型安全なAPI開発",
      "url": "https://qiita.com/user1/items/1a2b3c4d5e6f",
      "authorId": "user1",
      "authorName": "開発太郎",
      "likesCount": 45,
      "stocksCount": 23,
      "commentsCount": 8,
      "body": "TypeScriptを使ったAPI開発について詳しく解説します...",
      "excerpt": "TypeScriptを使ったAPI開発について詳しく解説します。型安全性を保ちながら効率的な開発を行う方法を紹介。",
      "tags": ["TypeScript", "API", "Node.js", "Express"],
      "publishedAt": "2023-12-15T09:30:00.000Z",
      "updatedAt": "2023-12-16T10:15:00.000Z",
      "processed": true,
      "processedAt": "2023-12-15T10:00:00.000Z",
      "bookExtractionStatus": "completed",
      "createdAt": "2023-12-15T09:30:00.000Z",
      "lastCheckedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9e1",
      "qiitaId": "2b3c4d5e6f7g",
      "title": "Reactの状態管理をマスターしよう",
      "url": "https://qiita.com/user2/items/2b3c4d5e6f7g",
      "authorId": "user2",
      "authorName": "フロント花子",
      "likesCount": 67,
      "stocksCount": 34,
      "commentsCount": 12,
      "body": "Reactの状態管理について包括的に解説...",
      "excerpt": "Reactの状態管理について包括的に解説します。useState、useReducer、Contextの使い分けを学びましょう。",
      "tags": ["React", "JavaScript", "状態管理", "Hooks"],
      "publishedAt": "2023-11-20T14:45:00.000Z",
      "updatedAt": "2023-11-21T08:30:00.000Z",
      "processed": true,
      "processedAt": "2023-11-20T15:00:00.000Z",
      "bookExtractionStatus": "completed",
      "createdAt": "2023-11-20T14:45:00.000Z",
      "lastCheckedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9e2",
      "qiitaId": "3c4d5e6f7g8h",
      "title": "Python機械学習ライブラリ完全ガイド",
      "url": "https://qiita.com/user3/items/3c4d5e6f7g8h",
      "authorId": "user3",
      "authorName": "データ次郎",
      "likesCount": 89,
      "stocksCount": 56,
      "commentsCount": 15,
      "body": "Pythonの機械学習ライブラリについて詳細解説...",
      "excerpt": "Pythonの機械学習ライブラリについて詳細解説。scikit-learn、pandas、NumPyの効果的な使い方を紹介。",
      "tags": ["Python", "機械学習", "scikit-learn", "pandas"],
      "publishedAt": "2023-10-05T16:20:00.000Z",
      "updatedAt": "2023-10-06T09:15:00.000Z",
      "processed": true,
      "processedAt": "2023-10-05T16:30:00.000Z",
      "bookExtractionStatus": "completed",
      "createdAt": "2023-10-05T16:20:00.000Z",
      "lastCheckedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "book_mentions": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9f0",
      "bookId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "articleId": "64f8a1b2c3d4e5f6a7b8c9e0",
      "mentionText": "詳解 TypeScript",
      "context": "型安全なAPI開発を学ぶなら「詳解 TypeScript」がおすすめです。基礎から応用まで網羅的に解説されています。",
      "confidence": 0.95,
      "extractionMethod": "nlp",
      "sentiment": "positive",
      "recommendationLevel": 5,
      "articlePopularity": 45.0,
      "authorCredibility": 8.5,
      "mentionWeight": 9.2,
      "createdAt": "2023-12-15T10:00:00.000Z",
      "verifiedAt": null,
      "verifiedBy": null
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9f1",
      "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "articleId": "64f8a1b2c3d4e5f6a7b8c9e1",
      "mentionText": "React実践入門",
      "context": "状態管理を学ぶために「React実践入門」を読み返しました。Hooksの使い方が分かりやすく説明されています。",
      "confidence": 0.88,
      "extractionMethod": "nlp",
      "sentiment": "positive",
      "recommendationLevel": 4,
      "articlePopularity": 67.0,
      "authorCredibility": 7.8,
      "mentionWeight": 8.1,
      "createdAt": "2023-11-20T15:00:00.000Z",
      "verifiedAt": null,
      "verifiedBy": null
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9f2",
      "bookId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "articleId": "64f8a1b2c3d4e5f6a7b8c9e2",
      "mentionText": "機械学習実装ハンドブック",
      "context": "実装方法について「機械学習実装ハンドブック」が非常に参考になりました。コード例が豊富で理解しやすいです。",
      "confidence": 0.92,
      "extractionMethod": "nlp",
      "sentiment": "positive",
      "recommendationLevel": 5,
      "articlePopularity": 89.0,
      "authorCredibility": 9.1,
      "mentionWeight": 9.8,
      "createdAt": "2023-10-05T16:30:00.000Z",
      "verifiedAt": null,
      "verifiedBy": null
    }
  ],
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9c0",
      "name": "プログラミング言語",
      "slug": "programming-languages",
      "description": "各種プログラミング言語に関する技術書",
      "parentId": null,
      "displayOrder": 1,
      "isActive": true,
      "color": "#007acc",
      "icon": "code",
      "bookCount": 125,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9c1",
      "name": "Web開発",
      "slug": "web-development",
      "description": "Webアプリケーション開発に関する技術書",
      "parentId": null,
      "displayOrder": 2,
      "isActive": true,
      "color": "#28a745",
      "icon": "globe",
      "bookCount": 89,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9c2",
      "name": "AI・機械学習",
      "slug": "ai-machine-learning",
      "description": "人工知能と機械学習に関する技術書",
      "parentId": null,
      "displayOrder": 3,
      "isActive": true,
      "color": "#dc3545",
      "icon": "brain",
      "bookCount": 67,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9c3",
      "name": "JavaScript",
      "slug": "javascript",
      "description": "JavaScript関連の技術書",
      "parentId": "64f8a1b2c3d4e5f6a7b8c9c0",
      "displayOrder": 1,
      "isActive": true,
      "color": "#f7df1e",
      "icon": "js",
      "bookCount": 45,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9c4",
      "name": "Python",
      "slug": "python",
      "description": "Python関連の技術書",
      "parentId": "64f8a1b2c3d4e5f6a7b8c9c0",
      "displayOrder": 2,
      "isActive": true,
      "color": "#3776ab",
      "icon": "python",
      "bookCount": 38,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-20T12:00:00.000Z"
    }
  ],
  "rankings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9r0",
      "type": "overall",
      "categoryId": null,
      "period": "all",
      "rankings": [
        {
          "rank": 1,
          "bookId": "64f8a1b2c3d4e5f6a7b8c9d3",
          "mentionCount": 203,
          "trendScore": 68.9,
          "change": 0,
          "book": null
        },
        {
          "rank": 2,
          "bookId": "64f8a1b2c3d4e5f6a7b8c9d2",
          "mentionCount": 156,
          "trendScore": 91.2,
          "change": 1,
          "book": null
        },
        {
          "rank": 3,
          "bookId": "64f8a1b2c3d4e5f6a7b8c9d0",
          "mentionCount": 127,
          "trendScore": 85.7,
          "change": -1,
          "book": null
        }
      ],
      "totalBooks": 125,
      "generatedAt": "2024-01-22T12:00:00.000Z",
      "expiresAt": "2024-01-23T12:00:00.000Z",
      "createdAt": "2024-01-22T12:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9r1",
      "type": "category",
      "categoryId": "64f8a1b2c3d4e5f6a7b8c9c1",
      "period": "month",
      "rankings": [
        {
          "rank": 1,
          "bookId": "64f8a1b2c3d4e5f6a7b8c9d1",
          "mentionCount": 94,
          "trendScore": 72.3,
          "change": 0,
          "book": null
        },
        {
          "rank": 2,
          "bookId": "64f8a1b2c3d4e5f6a7b8c9d4",
          "mentionCount": 78,
          "trendScore": 79.4,
          "change": 1,
          "book": null
        }
      ],
      "totalBooks": 89,
      "generatedAt": "2024-01-22T12:00:00.000Z",
      "expiresAt": "2024-01-23T12:00:00.000Z",
      "createdAt": "2024-01-22T12:00:00.000Z"
    }
  ],
  "favorites": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9fa",
      "userId": "64f8a1b2c3d4e5f6a7b8c9u0",
      "bookId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9fb",
      "userId": "64f8a1b2c3d4e5f6a7b8c9u0",
      "bookId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "createdAt": "2024-01-16T14:20:00.000Z"
    }
  ],
  "batch_logs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9l0",
      "batchType": "qiita_fetch",
      "status": "completed",
      "startedAt": "2024-01-22T01:00:00.000Z",
      "completedAt": "2024-01-22T01:15:30.000Z",
      "duration": 930,
      "processedCount": 150,
      "successCount": 148,
      "errorCount": 2,
      "errors": [
        {
          "articleId": "invalid_article_1",
          "error": "記事が見つかりません",
          "timestamp": "2024-01-22T01:05:15.000Z"
        },
        {
          "articleId": "invalid_article_2",
          "error": "アクセス権限がありません",
          "timestamp": "2024-01-22T01:08:22.000Z"
        }
      ],
      "config": {
        "maxArticles": 200,
        "dateRange": "2024-01-21",
        "tags": ["TypeScript", "React", "Vue.js"]
      },
      "createdAt": "2024-01-22T01:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9l1",
      "batchType": "book_extraction",
      "status": "completed",
      "startedAt": "2024-01-22T02:00:00.000Z",
      "completedAt": "2024-01-22T02:45:12.000Z",
      "duration": 2712,
      "processedCount": 148,
      "successCount": 145,
      "errorCount": 3,
      "errors": [
        {
          "articleId": "64f8a1b2c3d4e5f6a7b8c9e3",
          "error": "書籍抽出に失敗",
          "timestamp": "2024-01-22T02:15:30.000Z"
        }
      ],
      "config": {
        "extractionMethod": "nlp",
        "confidenceThreshold": 0.8
      },
      "createdAt": "2024-01-22T02:00:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9l2",
      "batchType": "ranking_update",
      "status": "running",
      "startedAt": "2024-01-22T12:00:00.000Z",
      "completedAt": null,
      "duration": null,
      "processedCount": 0,
      "successCount": 0,
      "errorCount": 0,
      "errors": null,
      "config": {
        "periods": ["all", "year", "month", "week"],
        "categories": ["all"]
      },
      "createdAt": "2024-01-22T12:00:00.000Z"
    }
  ]
};

// Helper functions for accessing mock data
export function getBookById(id: string) {
  return mockDatabase.books.find(book => book._id === id) || null;
}

export function getQiitaArticleById(id: string) {
  return mockDatabase.qiita_articles.find(article => article._id === id) || null;
}

export function getCategoryById(id: string) {
  return mockDatabase.categories.find(category => category._id === id) || null;
}

export function getCategoryBySlug(slug: string) {
  return mockDatabase.categories.find(category => category.slug === slug) || null;
}

export function getBookMentions(bookId: string) {
  return mockDatabase.book_mentions.filter(mention => mention.bookId === bookId);
}

export function getArticleMentions(articleId: string) {
  return mockDatabase.book_mentions.filter(mention => mention.articleId === articleId);
}

export function getRankingsByType(type: string, categoryId?: string | null, period: string = 'all') {
  return mockDatabase.rankings.find(ranking => 
    ranking.type === type && 
    ranking.categoryId === categoryId &&
    ranking.period === period
  ) || null;
}

export function getActiveCategories() {
  return mockDatabase.categories.filter(category => category.isActive);
}

export function getBatchLogsByType(batchType: string) {
  return mockDatabase.batch_logs.filter(log => log.batchType === batchType);
}

export function getLatestBatchLog(batchType: string) {
  const logs = getBatchLogsByType(batchType);
  return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0] || null;
}

// Search helpers
export function searchBooks(query: string, categoryFilter?: string, limit: number = 20) {
  let filteredBooks = mockDatabase.books.filter(book => book.status === 'active');
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.titleNormalized.toLowerCase().includes(lowerQuery) ||
      book.author.some(author => author.toLowerCase().includes(lowerQuery)) ||
      book.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  if (categoryFilter && categoryFilter !== 'all') {
    filteredBooks = filteredBooks.filter(book => 
      book.category.includes(categoryFilter)
    );
  }
  
  return filteredBooks
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);
}

export function searchArticles(query: string, limit: number = 10) {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockDatabase.qiita_articles
    .filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, limit);
}

export function searchCategories(query: string, limit: number = 5) {
  if (!query) return mockDatabase.categories.filter(cat => cat.isActive);
  
  const lowerQuery = query.toLowerCase();
  return mockDatabase.categories
    .filter(category => 
      category.isActive &&
      (category.name.toLowerCase().includes(lowerQuery) ||
       category.slug.toLowerCase().includes(lowerQuery) ||
       (category.description && category.description.toLowerCase().includes(lowerQuery)))
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, limit);
}

// Pagination helpers
export function paginateBooks<T>(books: T[], page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  const paginatedBooks = books.slice(offset, offset + limit);
  const total = books.length;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: paginatedBooks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

// Trend calculation helpers
export function calculateTrendScore(mentionCount: number, uniqueArticleCount: number, lastMentionedAt?: string | null): number {
  const baseMentionScore = Math.log(mentionCount + 1) * 10;
  const uniqueBonus = Math.log(uniqueArticleCount + 1) * 5;
  
  let recencyBonus = 0;
  if (lastMentionedAt) {
    const daysSinceLastMention = (Date.now() - new Date(lastMentionedAt).getTime()) / (1000 * 60 * 60 * 24);
    recencyBonus = Math.max(0, 20 - daysSinceLastMention * 0.1);
  }
  
  return Math.min(100, baseMentionScore + uniqueBonus + recencyBonus);
}

// Category statistics
export function getCategoryStats() {
  return mockDatabase.categories
    .filter(cat => cat.isActive)
    .map(category => ({
      category: category.slug,
      count: category.bookCount,
      label: category.name
    }));
}