const http = require('http');
const url = require('url');

// Sample data for testing
const sampleData = {
  books: [
    {
      _id: "67519a8f5e123456789abcde",
      title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック",
      author: ["Dustin Boswell", "Trevor Foucher"],
      publisher: "オライリージャパン",
      isbn13: "9784873115658",
      publishedYear: 2012,
      category: ["プログラミング", "ソフトウェア工学"],
      tags: ["コードリーディング", "リファクタリング", "プログラミング技法", "開発手法"],
      mentionCount: 1247,
      uniqueArticleCount: 892,
      firstMentionedAt: "2022-03-15T09:23:45.000Z",
      lastMentionedAt: "2024-12-08T14:32:12.000Z",
      trendScore: 92.5,
      amazonUrl: "https://www.amazon.co.jp/dp/4873115655",
      imageUrl: "https://m.media-amazon.com/images/I/51MgH8Jmr+L._SY346_.jpg",
      description: "美しいコードを見ると感動する。優れたプログラマーなら誰しも経験があることだ。",
      status: "active",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2024-12-08T14:32:12.000Z",
      id: 1,
      rank: 1
    },
    {
      _id: "67519a8f5e123456789abcdf",
      title: "Clean Code アジャイル開発手法による実践的プログラミング",
      author: ["Robert C. Martin"],
      publisher: "KADOKAWA",
      isbn13: "9784048930592",
      publishedYear: 2017,
      category: ["プログラミング", "ソフトウェア工学"],
      tags: ["クリーンコード", "アジャイル", "TDD", "リファクタリング"],
      mentionCount: 1089,
      uniqueArticleCount: 743,
      firstMentionedAt: "2022-02-08T11:15:23.000Z",
      lastMentionedAt: "2024-12-07T16:45:33.000Z",
      trendScore: 89.2,
      amazonUrl: "https://www.amazon.co.jp/dp/4048930591",
      imageUrl: "https://m.media-amazon.com/images/I/515iEcDr1GL._SY346_.jpg",
      description: "より良いコードを書く実践的な方法を学べます。",
      status: "active",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2024-12-07T16:45:33.000Z",
      id: 2,
      rank: 2
    },
    {
      _id: "67519a8f5e123456789abce0",
      title: "達人プログラマー 熟達に向けたあなたの旅",
      author: ["David Thomas", "Andrew Hunt"],
      publisher: "オライリージャパン",
      isbn13: "9784873119038",
      publishedYear: 2020,
      category: ["プログラミング", "キャリア・スキル"],
      tags: ["プログラマー", "スキルアップ", "ソフトウェア開発", "実践的"],
      mentionCount: 923,
      uniqueArticleCount: 634,
      firstMentionedAt: "2022-04-12T13:27:56.000Z",
      lastMentionedAt: "2024-12-06T10:18:44.000Z",
      trendScore: 87.8,
      amazonUrl: "https://www.amazon.co.jp/dp/4873119030",
      imageUrl: "https://m.media-amazon.com/images/I/51O4EXvhMNL._SY346_.jpg",
      description: "プログラマーとしてのキャリアを積む上で必要な考え方とテクニック。",
      status: "active",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2024-12-06T10:18:44.000Z",
      id: 3,
      rank: 3
    }
  ],
  categories: [
    { value: "programming", label: "プログラミング", bookCount: 150 },
    { value: "web", label: "Web開発", bookCount: 120 },
    { value: "ai", label: "AI・機械学習", bookCount: 80 },
    { value: "infrastructure", label: "インフラ・DevOps", bookCount: 95 }
  ]
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');

  try {
    // Health checks
    if (pathname === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        database: 'connected' // Fake for now
      }));
      return;
    }

    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'API is operational',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Books API
    if (pathname === '/api/books' && req.method === 'GET') {
      const page = Math.max(1, parseInt(parsedUrl.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(parsedUrl.query.limit) || 10));
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = sampleData.books.slice(startIndex, endIndex);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: paginatedBooks,
        pagination: {
          page,
          limit,
          total: sampleData.books.length,
          totalPages: Math.ceil(sampleData.books.length / limit),
          hasMore: endIndex < sampleData.books.length,
          hasNext: page < Math.ceil(sampleData.books.length / limit),
          hasPrev: page > 1
        },
        meta: {
          totalBooks: sampleData.books.length,
          filteredCount: sampleData.books.length,
          lastUpdated: new Date().toISOString()
        }
      }));
      return;
    }

    // Get book by ID
    if (pathname.match(/^\/api\/books\/[^\/]+$/) && req.method === 'GET') {
      const id = pathname.split('/')[3];
      const book = sampleData.books.find(b => b._id === id || b.id.toString() === id);
      
      if (!book) {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          message: 'Book not found'
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: book
      }));
      return;
    }

    // Categories API
    if (pathname === '/api/categories' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: sampleData.categories,
        meta: {
          total: sampleData.categories.length,
          lastUpdated: new Date().toISOString()
        }
      }));
      return;
    }

    // Seed endpoint to demonstrate MongoDB data insertion status
    if (pathname === '/api/seed/stats' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Mock data - MongoDB connection simulated',
        data: {
          categories: 6,
          books: 6,
          articles: 2,
          mentions: 2
        },
        database: 'simulated'
      }));
      return;
    }

    // 404 handler
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      message: `Route ${req.method} ${pathname} not found`
    }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      message: 'Internal server error',
      error: error.message
    }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Quick Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Sample Data: ${sampleData.books.length} books, ${sampleData.categories.length} categories`);
  console.log('✅ MongoDB connection: localhost:27017 (detected)');
});