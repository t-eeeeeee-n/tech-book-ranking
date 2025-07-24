import type { Book } from '~/types'
import { getGoodBookScore, type BookScoreInput } from '~/utils/bookScore'

const baseMockBooks: Book[] = [
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
    imageUrl: "",
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
  }
  // Add more base books here if needed
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
  
  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`
}

// 実際の技術書に似たタイトルを生成
const generateRealisticTitle = (id: number, category: string): string => {
  const getCategoryKey = (category: string): string => {
    if (category === 'プログラミング') return 'programming'
    if (category === 'Web開発') return 'web_development'
    if (category === 'モバイル開発') return 'mobile_development'
    if (category === 'AI・機械学習') return 'ai_ml'
    if (category === 'インフラ・DevOps') return 'infrastructure'
    if (category === 'データベース') return 'database'
    if (category === 'セキュリティ') return 'security'
    if (category === 'デザイン・UI/UX') return 'design'
    return 'programming'
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
  const articleCount = Math.min(50, Math.max(1, mentionCount + Math.floor(Math.random() * 10) - 5))
  const likesPerArticle = Math.floor(Math.random() * 20) + 5
  const totalLikes = articleCount * likesPerArticle + Math.floor(Math.random() * 100)
  
  const daysAgo = Math.floor(Math.random() * 730)
  const newestDate = new Date()
  newestDate.setDate(newestDate.getDate() - daysAgo)
  const newestArticleDate = newestDate.toISOString().split('T')[0]
  
  return { articleCount, totalLikes, newestArticleDate }
}

// 大きなデータセットを生成
export const generateAllMockBooks = (count: number = 500): Book[] => {
  const books = [...baseMockBooks]
  const categories = ['プログラミング', 'Web開発', 'モバイル開発', 'AI・機械学習', 'インフラ・DevOps', 'データベース', 'セキュリティ', 'デザイン・UI/UX']
  const publishers = ['オライリー・ジャパン', '技術評論社', '翔泳社', 'マイナビ出版', 'インプレス', 'SBクリエイティブ', '日経BP', 'アスキー']
  const authors = ['田中 太郎', '佐藤 花子', '山田 次郎', '鈴木 美咲', '高橋 健太', '渡辺 愛', 'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson']
  
  // 既存の書籍にスコアデータを追加
  books.forEach(book => {
    book.imageUrl = generateLocalImageUrl(book.id, book.category)
    
    if (!book.articleCount || !book.totalLikes || !book.newestArticleDate) {
      const scoreData = generateScoreData(book.id, book.mentionCount)
      book.articleCount = book.articleCount || scoreData.articleCount
      book.totalLikes = book.totalLikes || scoreData.totalLikes
      book.newestArticleDate = book.newestArticleDate || scoreData.newestArticleDate
    }
    
    const bookScoreInput: BookScoreInput = {
      id: book.id,
      title: book.title,
      articleCount: book.articleCount!,
      totalLikes: book.totalLikes!,
      newestArticleDate: book.newestArticleDate!
    }
    book.goodBookScore = getGoodBookScore(bookScoreInput)
    
    if (!book.rating) {
      book.rating = Math.round((book.goodBookScore / 100 * 2 + 3) * 10) / 10
    }
  })
  
  // 追加の書籍データを生成
  for (let i = books.length; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const publisher = publishers[Math.floor(Math.random() * publishers.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]
    const mentionCount = Math.floor(Math.random() * 100) + 10
    const title = generateRealisticTitle(i + 1, category)
    
    const scoreData = generateScoreData(i + 1, mentionCount)
    const bookScoreInput: BookScoreInput = {
      id: i + 1,
      title,
      articleCount: scoreData.articleCount,
      totalLikes: scoreData.totalLikes,
      newestArticleDate: scoreData.newestArticleDate
    }
    const goodBookScore = getGoodBookScore(bookScoreInput)
    const rating = Math.round((goodBookScore / 100 * 2 + 3) * 10) / 10
    
    books.push({
      id: i + 1,
      title,
      author,
      isbn: `978-4-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}-${Math.floor(Math.random() * 10)}`,
      publisher,
      publishDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      mentionCount,
      category,
      tags: [category, 'プログラミング', 'エンジニア'],
      imageUrl: generateLocalImageUrl(i + 1, category),
      amazonUrl: `https://amazon.co.jp/book-${i + 1}`,
      description: `${category}に関する技術書です。実践的な内容で、エンジニアのスキルアップに役立ちます。`,
      firstMentionDate: "2023-01-01",
      lastMentionDate: "2024-03-20",
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
  
  return books
}

// シングルトンパターンでデータを管理
let cachedBooks: Book[] | null = null

export const getAllMockBooks = (): Book[] => {
  if (!cachedBooks) {
    cachedBooks = generateAllMockBooks(500)
  }
  return cachedBooks
}

// 個別の書籍を取得
export const getMockBookById = (id: number): Book | undefined => {
  const books = getAllMockBooks()
  return books.find(book => book.id === id)
}