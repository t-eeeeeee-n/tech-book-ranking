import type { Book, PaginatedResponse } from '~/types'

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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const category = query.category as string
  const search = query.search as string
  const period = query.period as string

  let filteredBooks = [...mockBooks]

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

  return {
    success: true,
    data: paginatedBooks,
    total: filteredBooks.length,
    page,
    limit,
    hasMore: endIndex < filteredBooks.length
  }
})