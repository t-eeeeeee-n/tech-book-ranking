export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book ID is required'
    })
  }

  // Mock book data - in real app, this would come from database
  const mockBooks = [
    {
      id: 1,
      title: 'リーダブルコード',
      author: 'Dustin Boswell, Trevor Foucher',
      imageUrl: 'https://m.media-amazon.com/images/I/51MgH8Jmr+L._SX350_BO1,204,203,200_.jpg',
      amazonUrl: 'https://www.amazon.co.jp/dp/4873115655',
      mentionCount: 892,
      rating: 4.6,
      category: 'プログラミング',
      description: 'より良いコードを書くための実践的なテクニック集。コードの可読性を向上させるための具体的な手法について詳しく解説しています。プログラマーが日々直面する問題に対する実用的な解決策を提供します。',
      tags: ['コーディング', '可読性', 'ベストプラクティス', 'プログラミング手法'],
      publishedDate: '2012-06-23',
      publisher: 'オライリージャパン',
      pages: 260,
      isbn: '978-4873115658',
      uniqueArticleCount: 156,
      trendScore: 95
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      imageUrl: 'https://m.media-amazon.com/images/I/41SH-SvWPxL._SX376_BO1,204,203,200_.jpg',
      amazonUrl: 'https://www.amazon.co.jp/dp/4048676881',
      mentionCount: 756,
      rating: 4.5,
      category: 'プログラミング',
      description: 'クリーンなコードの書き方について体系的に学べる一冊。ソフトウェア開発の名手が長年の経験から培った、保守性の高いコードを書くための原則と実践方法を詳しく解説します。',
      tags: ['クリーンコード', 'リファクタリング', '設計', 'アーキテクチャ'],
      publishedDate: '2017-12-28',
      publisher: 'アスキードワンゴ',
      pages: 464,
      isbn: '978-4048676885',
      uniqueArticleCount: 134,
      trendScore: 89
    },
    {
      id: 3,
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      imageUrl: 'https://m.media-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg',
      amazonUrl: 'https://www.amazon.co.jp/dp/4873113911',
      mentionCount: 673,
      rating: 4.4,
      category: 'JavaScript',
      description: 'JavaScriptの「良い部分」に焦点を当てた実践的ガイド。言語の核となる部分を理解し、より良いJavaScriptプログラムを書くための知識と技術を身につけることができます。',
      tags: ['JavaScript', 'プログラミング言語', 'Web開発', 'フロントエンド'],
      publishedDate: '2008-12-22',
      publisher: 'オライリージャパン',
      pages: 176,
      isbn: '978-4873113913',
      uniqueArticleCount: 98,
      trendScore: 76
    },
    {
      id: 4,
      title: 'Effective Java',
      author: 'Joshua Bloch',
      imageUrl: 'https://m.media-amazon.com/images/I/51WD-F3GobL._SX379_BO1,204,203,200_.jpg',
      amazonUrl: 'https://www.amazon.co.jp/dp/4621303252',
      mentionCount: 592,
      rating: 4.7,
      category: 'Java',
      description: 'Javaプログラミングのベストプラクティス集。Java言語の設計者の一人が、効果的なJavaプログラムを書くための90の項目を具体例とともに詳しく解説します。',
      tags: ['Java', 'ベストプラクティス', 'オブジェクト指向', 'プログラミング'],
      publishedDate: '2018-10-30',
      publisher: '丸善出版',
      pages: 552,
      isbn: '978-4621303252',
      uniqueArticleCount: 87,
      trendScore: 82
    },
    {
      id: 5,
      title: 'デザインパターン',
      author: 'Gang of Four',
      imageUrl: 'https://m.media-amazon.com/images/I/51szD9HC9pL._SX342_BO1,204,203,200_.jpg',
      amazonUrl: 'https://www.amazon.co.jp/dp/4797311126',
      mentionCount: 534,
      rating: 4.3,
      category: 'プログラミング',
      description: 'オブジェクト指向設計における23の基本的なデザインパターンを体系的に解説。ソフトウェア設計の問題に対する再利用可能な解決策を提供します。',
      tags: ['デザインパターン', 'オブジェクト指向', '設計', 'アーキテクチャ'],
      publishedDate: '1999-10-01',
      publisher: 'ソフトバンククリエイティブ',
      pages: 424,
      isbn: '978-4797311129',
      uniqueArticleCount: 76,
      trendScore: 71
    }
  ]

  // Additional mock books for pagination demo
  const additionalBooks = Array.from({ length: 45 }, (_, i) => ({
    id: i + 6,
    title: `技術書 ${i + 6}`,
    author: `著者 ${i + 6}`,
    imageUrl: 'https://m.media-amazon.com/images/I/51MgH8Jmr+L._SX350_BO1,204,203,200_.jpg',
    amazonUrl: `https://www.amazon.co.jp/dp/example${i + 6}`,
    mentionCount: Math.floor(Math.random() * 500) + 50,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    category: ['プログラミング', 'Web開発', 'AI・機械学習', 'インフラ'][Math.floor(Math.random() * 4)],
    description: `技術書 ${i + 6} の詳細説明です。この書籍は技術者にとって重要な知識を提供します。`,
    tags: ['技術', 'プログラミング', '学習'],
    publishedDate: '2023-01-01',
    publisher: 'テスト出版',
    pages: Math.floor(Math.random() * 400) + 200,
    isbn: `978-${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
    uniqueArticleCount: Math.floor(Math.random() * 50) + 10,
    trendScore: Math.floor(Math.random() * 100)
  }))

  const allBooks = [...mockBooks, ...additionalBooks]
  const book = allBooks.find(b => b.id === parseInt(id))

  if (!book) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found'
    })
  }

  return {
    success: true,
    data: book
  }
})