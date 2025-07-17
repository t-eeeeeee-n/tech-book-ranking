import type { Book, PaginatedResponse } from '~/types'
import { getGoodBookScore, type BookScoreInput } from '~/utils/bookScore'

const mockBooks: Book[] = [
  {
    id: 1,
    title: "リーダブルコード",
    author: "Dustin Boswell, Trevor Foucher",
    isbn: "9784873115658",
    publisher: "オライリー・ジャパン",
    publishDate: "2012-06-23",
    mentionCount: 128,
    category: "プログラミング",
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
    articleCount: 25,
    totalLikes: 590,
    newestArticleDate: "2024-03-20",
    topQiitaArticles: [
      {
        id: "1a2b3c4d",
        title: "リーダブルコードを実践してみた感想",
        url: "https://qiita.com/example/items/1a2b3c4d",
        author: "tech_writer",
        publishedAt: "2024-03-15",
        likesCount: 245,
        tags: ["JavaScript", "コード品質", "リファクタリング"]
      },
      {
        id: "2e3f4g5h",
        title: "新人エンジニアに読んでほしい本5選",
        url: "https://qiita.com/example/items/2e3f4g5h",
        author: "senior_dev",
        publishedAt: "2024-03-10",
        likesCount: 189,
        tags: ["新人", "書籍", "プログラミング"]
      },
      {
        id: "3i4j5k6l",
        title: "コードレビューで意識していること",
        url: "https://qiita.com/example/items/3i4j5k6l",
        author: "code_reviewer",
        publishedAt: "2024-03-05",
        likesCount: 156,
        tags: ["コードレビュー", "品質管理", "チーム開発"]
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
    category: "プログラミング",
    tags: ["オブジェクト指向", "設計", "プログラミング思考"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/oop-why",
    description: "オブジェクト指向の本質を理解するための入門書",
    firstMentionDate: "2023-02-10",
    lastMentionDate: "2024-03-18",
    articleCount: 18,
    totalLikes: 312,
    newestArticleDate: "2024-03-18",
    topQiitaArticles: [
      {
        id: "oop1a2b3c",
        title: "オブジェクト指向入門者が読むべき本",
        url: "https://qiita.com/example/items/oop1a2b3c",
        author: "oop_master",
        publishedAt: "2024-03-12",
        likesCount: 178,
        tags: ["オブジェクト指向", "設計", "入門"]
      },
      {
        id: "oop2d3e4f",
        title: "なぜオブジェクト指向が必要なのか",
        url: "https://qiita.com/example/items/oop2d3e4f",
        author: "design_guru",
        publishedAt: "2024-03-08",
        likesCount: 134,
        tags: ["設計思想", "プログラミング", "アーキテクチャ"]
      }
    ]
  },
  {
    id: 3,
    title: "現場で使える Ruby on Rails 5速習実践ガイド",
    author: "大場寧子, 松本拓也",
    isbn: "9784839962227",
    publisher: "マイナビ出版",
    publishDate: "2018-10-19",
    mentionCount: 82,
    category: "Web開発",
    tags: ["Rails", "Ruby", "Web開発"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/rails-guide",
    description: "Rails 5を使った実践的なWebアプリケーション開発",
    firstMentionDate: "2023-01-20",
    lastMentionDate: "2024-03-15",
    articleCount: 15,
    totalLikes: 390,
    newestArticleDate: "2024-03-15",
    topQiitaArticles: [
      {
        id: "rails1x2y3z",
        title: "Rails 5で始めるWebアプリ開発",
        url: "https://qiita.com/example/items/rails1x2y3z",
        author: "rails_dev",
        publishedAt: "2024-03-11",
        likesCount: 223,
        tags: ["Rails", "Ruby", "Web開発"]
      },
      {
        id: "rails4a5b6c",
        title: "Rails実践ガイドで学んだこと",
        url: "https://qiita.com/example/items/rails4a5b6c",
        author: "web_engineer",
        publishedAt: "2024-03-07",
        likesCount: 167,
        tags: ["Rails", "実践", "チュートリアル"]
      }
    ]
  },
  {
    id: 4,
    title: "達人プログラマー",
    author: "David Thomas, Andrew Hunt",
    isbn: "9784274219337",
    publisher: "オーム社",
    publishDate: "2016-10-20",
    mentionCount: 76,
    category: "プログラミング",
    tags: ["プログラミング", "ベストプラクティス", "キャリア"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/pragmatic-programmer",
    description: "システム開発の職人から名匠への道",
    firstMentionDate: "2023-03-05",
    lastMentionDate: "2024-03-12",
    articleCount: 12,
    totalLikes: 510,
    newestArticleDate: "2024-03-12",
    topQiitaArticles: [
      {
        id: "pragmatic1",
        title: "達人プログラマーで学んだベストプラクティス",
        url: "https://qiita.com/example/items/pragmatic1",
        author: "senior_engineer",
        publishedAt: "2024-03-09",
        likesCount: 312,
        tags: ["ベストプラクティス", "キャリア", "スキルアップ"]
      },
      {
        id: "pragmatic2",
        title: "プログラマーとして成長したい人へ",
        url: "https://qiita.com/example/items/pragmatic2",
        author: "tech_lead",
        publishedAt: "2024-03-04",
        likesCount: 198,
        tags: ["キャリア", "成長", "メンターシップ"]
      }
    ]
  },
  {
    id: 5,
    title: "JavaScript本格入門",
    author: "山田 祥寛",
    isbn: "9784774183961",
    publisher: "技術評論社",
    publishDate: "2016-11-11",
    mentionCount: 64,
    category: "JavaScript",
    tags: [
      "JavaScript", "JavaScript", "JavaScript", "TypeScript", "React", "Vue", "Angular",
      "Node.js", "Express", "フロントエンド", "バックエンド", "Web開発", "API",
      "REST", "GraphQL", "npm", "yarn", "webpack", "Vite", "Babel", "ESLint",
      "Jest", "testing", "デバッグ", "パフォーマンス", "セキュリティ", "PWA",
      "モバイル", "レスポンシブ", "アクセシビリティ", "SEO", "CSS", "HTML",
      "DOM", "非同期", "Promise", "async/await", "ES6", "ES2020", "モジュール"
    ],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/js-book",
    description: "モダンスタイルによる基礎から現場での応用まで",
    firstMentionDate: "2023-02-28",
    lastMentionDate: "2024-03-08",
    articleCount: 20,
    totalLikes: 510,
    newestArticleDate: "2024-03-08",
    topQiitaArticles: [
      {
        id: "js1book2",
        title: "JavaScript学習のロードマップ",
        url: "https://qiita.com/example/items/js1book2",
        author: "js_expert",
        publishedAt: "2024-03-06",
        likesCount: 276,
        tags: ["JavaScript", "学習", "ロードマップ"]
      },
      {
        id: "js3book4",
        title: "モダンJavaScriptの基礎知識",
        url: "https://qiita.com/example/items/js3book4",
        author: "frontend_dev",
        publishedAt: "2024-03-02",
        likesCount: 234,
        tags: ["JavaScript", "ES6", "フロントエンド"]
      }
    ]
  },
  {
    id: 6,
    title: "Effective Java",
    author: "Joshua Bloch",
    isbn: "9784621303252",
    publisher: "丸善出版",
    publishDate: "2018-10-30",
    mentionCount: 58,
    category: "Java",
    tags: ["Java", "ベストプラクティス", "プログラミング"],
    imageUrl: "https://images-fe.ssl-images-amazon.com/images/I/51MgH8Jmr3L._SL160_.jpg",
    amazonUrl: "https://amazon.co.jp/effective-java",
    description: "Javaプラットフォームでもっとも効果的な使い方",
    firstMentionDate: "2023-04-12",
    lastMentionDate: "2024-02-25",
    articleCount: 10,
    totalLikes: 345,
    newestArticleDate: "2024-02-25",
    topQiitaArticles: [
      {
        id: "java1eff2",
        title: "Effective Javaで学ぶJavaの深い知識",
        url: "https://qiita.com/example/items/java1eff2",
        author: "java_master",
        publishedAt: "2024-02-20",
        likesCount: 189,
        tags: ["Java", "ベストプラクティス", "上級者向け"]
      },
      {
        id: "java3eff4",
        title: "Javaエンジニアなら知っておきたいEffective Java",
        url: "https://qiita.com/example/items/java3eff4",
        author: "enterprise_dev",
        publishedAt: "2024-02-18",
        likesCount: 156,
        tags: ["Java", "設計", "プログラミング"]
      }
    ]
  }
]

// 完全に安全なローカル画像を生成（Data URI使用）
const generateLocalImageUrl = (bookId: number, category: string): string => {
  // カテゴリ表示名から内部キーへのマッピング関数
  const getCategoryKey = (category: string): string => {
    if (category === 'プログラミング') return 'programming'
    if (category === 'Web開発') return 'web_development'
    if (category === 'モバイル開発') return 'mobile_development'
    if (category === 'AI・機械学習') return 'ai_ml'
    if (category === 'インフラ・DevOps') return 'infrastructure'
    if (category === 'データベース') return 'database'
    if (category === 'セキュリティ') return 'security'
    if (category === 'デザイン・UI/UX') return 'design'
    return 'programming' // デフォルト
  }
  
  const categoryColors: Record<string, string> = {
    'programming': '#4f46e5',
    'web_development': '#059669', 
    'mobile_development': '#dc2626',
    'ai_ml': '#7c3aed',
    'infrastructure': '#ea580c',
    'database': '#0891b2',
    'security': '#be123c',
    'design': '#c2410c'
  }
  
  const categoryKey = getCategoryKey(category)
  const color = categoryColors[categoryKey] || '#6b7280'
  const icons = ['📚', '📖', '📝', '💻', '⚡']
  const icon = icons[bookId % icons.length]
  
  // SVG を Data URI として生成
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="${color}"/>
      <text x="150" y="200" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="150" y="280" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${category}</text>
      <text x="150" y="320" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">#${bookId}</text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// 安全なデフォルト画像を生成する関数
const generateSafeImageUrl = (bookId: number, category: string): string => {
  // 最優先でローカル生成のSVG画像を使用
  return generateLocalImageUrl(bookId, category)
}

// 書籍の画像URLを生成する関数
const generateBookImageUrl = (bookId: number, title: string, category: string): string => {
  // 常に安全な画像を返す
  return generateSafeImageUrl(bookId, category)
}

// 実際の技術書に似たタイトルを生成
const generateRealisticTitle = (id: number, category: string): string => {
  // カテゴリ表示名から内部キーへのマッピング関数
  const getCategoryKey = (category: string): string => {
    if (category === 'プログラミング') return 'programming'
    if (category === 'Web開発') return 'web_development'
    if (category === 'モバイル開発') return 'mobile_development'
    if (category === 'AI・機械学習') return 'ai_ml'
    if (category === 'インフラ・DevOps') return 'infrastructure'
    if (category === 'データベース') return 'database'
    if (category === 'セキュリティ') return 'security'
    if (category === 'デザイン・UI/UX') return 'design'
    return 'programming' // デフォルト
  }
  
  const titleTemplates: Record<string, string[]> = {
    'programming': [
      'プログラミング入門',
      'コードの書き方',
      'アルゴリズムとデータ構造',
      'プログラミング思考',
      'コーディング規約',
      'リファクタリング入門',
      'プログラミングパターン',
      'ソフトウェア設計'
    ],
    'web_development': [
      'Web開発入門',
      'フロントエンド開発',
      'バックエンド開発',
      'レスポンシブデザイン',
      'Web API設計',
      'フルスタック開発',
      'Webパフォーマンス',
      'モダンWeb開発'
    ],
    'ai_ml': [
      '機械学習入門',
      'AIプログラミング',
      '深層学習',
      'データサイエンス',
      '自然言語処理',
      'コンピュータビジョン',
      '機械学習実践',
      'AI開発手法'
    ],
    'infrastructure': [
      'DevOps入門',
      'クラウド設計',
      'Docker実践',
      'Kubernetes入門',
      'CI/CD実装',
      'インフラ自動化',
      '監視とログ',
      'セキュリティ対策'
    ]
  }
  
  const categoryKey = getCategoryKey(category)
  const templates = titleTemplates[categoryKey] || titleTemplates['programming']
  const template = templates[id % templates.length]
  
  return `${template} 第${Math.floor(id / templates.length) + 1}版`
}

// スコア計算用のリアルなデータを生成
const generateScoreData = (bookId: number, mentionCount: number): { articleCount: number, totalLikes: number, newestArticleDate: string } => {
  // 記事数は mentionCount をベースに調整（1-50の範囲）
  const articleCount = Math.min(50, Math.max(1, mentionCount + Math.floor(Math.random() * 10) - 5))
  
  // 総いいね数は記事数と相関がある（記事数 * 5-25の範囲）
  const likesPerArticle = Math.floor(Math.random() * 20) + 5
  const totalLikes = articleCount * likesPerArticle + Math.floor(Math.random() * 100)
  
  // 最新記事日を生成（過去2年以内）
  const daysAgo = Math.floor(Math.random() * 730) // 0-730日前
  const newestDate = new Date()
  newestDate.setDate(newestDate.getDate() - daysAgo)
  const newestArticleDate = newestDate.toISOString().split('T')[0]
  
  return { articleCount, totalLikes, newestArticleDate }
}

// 大きなデータセットを生成（無限スクロールテスト用）
const generateMockBooks = (count: number = 200): Book[] => {
  const baseBooks = [...mockBooks]
  const categories = ['プログラミング', 'Web開発', 'モバイル開発', 'AI・機械学習', 'インフラ・DevOps', 'データベース', 'セキュリティ', 'デザイン・UI/UX']
  const publishers = ['オライリー・ジャパン', '技術評論社', '翔泳社', 'マイナビ出版', 'インプレス', 'SBクリエイティブ', '日経BP', 'アスキー']
  const authors = ['田中 太郎', '佐藤 花子', '山田 次郎', '鈴木 美咲', '高橋 健太', '渡辺 愛', 'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson']
  
  // 既存の書籍にもスコアデータを追加
  baseBooks.forEach(book => {
    book.imageUrl = generateBookImageUrl(book.id, book.title, book.category)
    
    // スコア計算用データが既に存在する場合はそのまま使用、存在しない場合は生成
    if (!book.articleCount || !book.totalLikes || !book.newestArticleDate) {
      const scoreData = generateScoreData(book.id, book.mentionCount)
      book.articleCount = book.articleCount || scoreData.articleCount
      book.totalLikes = book.totalLikes || scoreData.totalLikes
      book.newestArticleDate = book.newestArticleDate || scoreData.newestArticleDate
    }
    
    // 「いい本スコア」を計算
    const bookScoreInput: BookScoreInput = {
      id: book.id,
      title: book.title,
      articleCount: book.articleCount!,
      totalLikes: book.totalLikes!,
      newestArticleDate: book.newestArticleDate!
    }
    book.goodBookScore = getGoodBookScore(bookScoreInput)
    
    // 既存のratingとの互換性維持
    if (!book.rating) {
      book.rating = Math.round((book.goodBookScore / 100 * 2 + 3) * 10) / 10 // 3.0-5.0の範囲
    }
  })
  
  // 追加の書籍データを生成
  for (let i = baseBooks.length; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const publisher = publishers[Math.floor(Math.random() * publishers.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]
    const mentionCount = Math.floor(Math.random() * 100) + 10
    const title = generateRealisticTitle(i + 1, category)
    
    // スコア計算用データを生成
    const scoreData = generateScoreData(i + 1, mentionCount)
    const bookScoreInput: BookScoreInput = {
      id: i + 1,
      title,
      articleCount: scoreData.articleCount,
      totalLikes: scoreData.totalLikes,
      newestArticleDate: scoreData.newestArticleDate
    }
    const goodBookScore = getGoodBookScore(bookScoreInput)
    const rating = Math.round((goodBookScore / 100 * 2 + 3) * 10) / 10 // 3.0-5.0の範囲
    
    baseBooks.push({
      id: i + 1,
      title,
      author,
      isbn: `978-4-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}-${Math.floor(Math.random() * 10)}`,
      publisher,
      publishDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      mentionCount,
      category,
      tags: [category, 'プログラミング', 'エンジニア'],
      imageUrl: generateBookImageUrl(i + 1, title, category),
      amazonUrl: `https://amazon.co.jp/book-${i + 1}`,
      description: `${category}に関する技術書です。実践的な内容で、エンジニアのスキルアップに役立ちます。`,
      firstMentionDate: "2023-01-01",
      lastMentionDate: "2024-03-20",
      // スコア関連データ
      articleCount: scoreData.articleCount,
      totalLikes: scoreData.totalLikes,
      newestArticleDate: scoreData.newestArticleDate,
      goodBookScore,
      rating,
      topQiitaArticles: [
        {
          id: `article-${i + 1}`,
          title: `技術書紹介: ${category}の学習について`,
          url: `https://qiita.com/example/items/article-${i + 1}`,
          author: `user_${i + 1}`,
          publishedAt: "2024-03-15",
          likesCount: Math.floor(Math.random() * 200) + 50,
          tags: [category, "書籍", "学習"]
        }
      ]
    })
  }
  
  return baseBooks
}

// 大きなデータセットを生成
const allMockBooks = generateMockBooks(500)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const category = query.category as string
  const search = query.search as string
  const period = query.period as string

  console.log('📚 API Request:', { page, limit, category, search, period })

  let filteredBooks = [...allMockBooks]

  if (category && category !== 'all') {
    filteredBooks = filteredBooks.filter(book => 
      book.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  if (search) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    )
  }

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

  filteredBooks.sort((a, b) => b.mentionCount - a.mentionCount)

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  const result = {
    success: true,
    data: paginatedBooks,
    total: filteredBooks.length,
    page,
    limit,
    hasMore: endIndex < filteredBooks.length
  }

  console.log('📤 API Response:', {
    total: result.total,
    page: result.page,
    limit: result.limit,
    hasMore: result.hasMore,
    dataLength: result.data.length,
    startIndex,
    endIndex
  })

  return result
})