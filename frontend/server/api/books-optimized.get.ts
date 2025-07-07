import type { Book, RankingApiResponse } from '~/types'

// Extended mock data for demonstration
const mockBooks: Book[] = [
  {
    id: 1,
    title: "リーダブルコード",
    author: "Dustin Boswell, Trevor Foucher",
    isbn: "9784873115658",
    publisher: "オライリー・ジャパン",
    publishDate: "2012-06-23",
    mentionCount: 128,
    category: "programming",
    tags: [
      "プログラミング", "コード品質", "可読性", "JavaScript", "JavaScript", "Python", 
      "リファクタリング", "設計", "テスト", "チーム開発", "Git", "GitHub", 
      "コードレビュー", "ベストプラクティス", "新人", "入門", "中級者", 
      "上級者", "保守性", "メンテナンス", "ドキュメント", "コメント"
    ],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/readable-code",
    description: "より良いコードを書くためのシンプルで実践的なテクニック",
    firstMentionDate: "2023-01-15",
    lastMentionDate: "2024-03-20",
    trendScore: 95,
    topQiitaArticles: [
      {
        id: "1a2b3c4d",
        title: "リーダブルコードを実践してみた感想",
        url: "https://qiita.com/example/items/1a2b3c4d",
        author: "tech_writer",
        publishedAt: "2024-03-15",
        likesCount: 245,
        tags: ["JavaScript", "コード品質", "リファクタリング"]
      }
    ]
  },
  {
    id: 2,
    title: "オブジェクト指向でなぜつくるのか",
    author: "平澤 章",
    isbn: "9784822284695",
    publisher: "日経BP",
    publishDate: "2014-03-05",
    mentionCount: 95,
    category: "programming",
    tags: ["オブジェクト指向", "設計", "プログラミング思考"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/oop-why",
    description: "オブジェクト指向の本質を理解するための入門書",
    firstMentionDate: "2023-02-10",
    lastMentionDate: "2024-03-18",
    trendScore: 88,
    topQiitaArticles: []
  },
  {
    id: 3,
    title: "現場で使える Ruby on Rails 5速習実践ガイド",
    author: "大場寧子, 松本拓也",
    isbn: "9784839962227",
    publisher: "マイナビ出版",
    publishDate: "2018-10-19",
    mentionCount: 82,
    category: "web-development",
    tags: ["Rails", "Ruby", "Web開発"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/rails-guide",
    description: "Rails 5を使った実践的なWebアプリケーション開発",
    firstMentionDate: "2023-01-20",
    lastMentionDate: "2024-03-15",
    trendScore: 82,
    topQiitaArticles: []
  }
]

// Generate additional mock data for testing
const generateMockBooks = (count: number): Book[] => {
  const categories = ['programming', 'web-development', 'ai-machine-learning', 'infrastructure', 'database', 'mobile', 'security']
  const mockTitles = [
    "実践TypeScript", "モダンJavaScript入門", "Vue.js完全ガイド", "React実戦入門",
    "Python機械学習", "AWS実践ガイド", "Docker完全攻略", "Kubernetes入門",
    "データベース設計論", "SQL実践テクニック", "セキュリティ入門", "ネットワーク基礎",
    "アルゴリズム図鑑", "設計パターン", "テスト駆動開発", "アジャイル開発入門"
  ]
  const mockAuthors = [
    "山田太郎", "佐藤花子", "田中一郎", "鈴木美咲", "高橋健太", "渡辺由美"
  ]
  
  const additionalBooks: Book[] = []
  
  for (let i = 0; i < count; i++) {
    const id = mockBooks.length + i + 1
    const category = categories[Math.floor(Math.random() * categories.length)]
    const title = mockTitles[Math.floor(Math.random() * mockTitles.length)] + ` ${i + 1}`
    const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)]
    const mentionCount = Math.floor(Math.random() * 100) + 10
    const publishYear = 2018 + Math.floor(Math.random() * 6)
    
    additionalBooks.push({
      id,
      title,
      author,
      publisher: "技術評論社",
      publishDate: `${publishYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
      mentionCount,
      category,
      tags: [category, "プログラミング", "入門", "実践"],
      imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
      amazonUrl: `https://amazon.co.jp/book-${id}`,
      description: `${category}に関する実践的な技術書です。`,
      firstMentionDate: "2023-01-15",
      lastMentionDate: "2024-03-20",
      trendScore: Math.floor(Math.random() * 50) + 50,
      topQiitaArticles: []
    })
  }
  
  return additionalBooks
}

// Combine original and generated books
const allBooks = [...mockBooks, ...generateMockBooks(200)] // Total ~200 books for demo

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 24
  const category = query.category as string
  const search = query.search as string
  const period = query.period as string
  const sort = query.sort as string || 'popularity'

  let filteredBooks = [...allBooks]

  // Category filter
  if (category && category !== 'all') {
    filteredBooks = filteredBooks.filter(book => 
      book.category === category || book.category?.toLowerCase().includes(category.toLowerCase())
    )
  }

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      book.description?.toLowerCase().includes(searchLower)
    )
  }

  // Period filter
  if (period && period !== 'all') {
    const now = new Date()
    let dateThreshold: Date

    switch (period) {
      case 'today':
        dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        dateThreshold = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        dateThreshold = new Date(now.getFullYear(), 0, 1)
        break
      default:
        dateThreshold = new Date(0)
    }

    filteredBooks = filteredBooks.filter(book => 
      new Date(book.lastMentionDate) >= dateThreshold
    )
  }

  // Sort
  filteredBooks.sort((a, b) => {
    switch (sort) {
      case 'popularity':
        return b.mentionCount - a.mentionCount
      case 'recent':
        return new Date(b.lastMentionDate).getTime() - new Date(a.lastMentionDate).getTime()
      case 'newest':
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      case 'rating':
        return (b.trendScore || 0) - (a.trendScore || 0)
      default:
        return b.mentionCount - a.mentionCount
    }
  })

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  // Add ranking position
  const booksWithRank = paginatedBooks.map((book, index) => ({
    ...book,
    rank: startIndex + index + 1
  }))

  return {
    success: true,
    data: booksWithRank,
    pagination: {
      page,
      limit,
      total: filteredBooks.length,
      totalPages: Math.ceil(filteredBooks.length / limit),
      hasMore: endIndex < filteredBooks.length,
      hasNext: page < Math.ceil(filteredBooks.length / limit),
      hasPrev: page > 1
    },
    meta: {
      totalBooks: allBooks.length,
      filteredCount: filteredBooks.length,
      categories: getCategoryStats(allBooks),
      searchQuery: search,
      appliedFilters: {
        category,
        search,
        period,
        sort
      }
    }
  } as RankingApiResponse
})

// Helper function to get category statistics
function getCategoryStats(books: Book[]) {
  const stats = books.reduce((acc, book) => {
    const category = book.category || 'other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(stats).map(([category, count]) => ({
    category,
    count,
    label: getCategoryLabel(category)
  }))
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'programming': 'プログラミング',
    'web-development': 'Web開発',
    'ai-machine-learning': 'AI・機械学習',
    'infrastructure': 'インフラ',
    'database': 'データベース',
    'mobile': 'モバイル開発',
    'security': 'セキュリティ',
    'other': 'その他'
  }
  return labels[category] || category
}