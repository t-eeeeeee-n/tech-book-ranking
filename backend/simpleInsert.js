const mongoose = require('./node_modules/mongoose');

const uri = 'mongodb://localhost:27017/techbook-ranking';

const sampleData = {
  categories: [
    { name: 'プログラミング', slug: 'programming' },
    { name: 'Web開発', slug: 'web-development' },
    { name: 'AI・機械学習', slug: 'ai-machine-learning' },
  ],
  books: [
    {
      title: 'リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック',
      titleNormalized: 'readable code',
      author: ['Dustin Boswell', 'Trevor Foucher'],
      publisher: 'オライリージャパン',
      isbn13: '9784873115658',
      publishedYear: 2012,
      category: ['programming'],
      tags: ['clean-code', 'best-practices', 'programming'],
      mentionCount: 1250,
      uniqueArticleCount: 890,
      trendScore: 95.8,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'JavaScript: The Good Parts ―「良いパーツ」によるベストプラクティス',
      titleNormalized: 'javascript the good parts',
      author: ['Douglas Crockford'],
      publisher: 'オライリージャパン',
      isbn13: '9784873113913',
      publishedYear: 2008,
      category: ['programming', 'web-development'],
      tags: ['javascript', 'web', 'best-practices'],
      mentionCount: 980,
      uniqueArticleCount: 720,
      trendScore: 85.2,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  articles: [
    {
      qiitaId: 'abc123',
      title: 'リーダブルコードを読んで実践してみた',
      url: 'https://qiita.com/user1/items/abc123',
      authorId: 'user1',
      authorName: 'developer1',
      likesCount: 45,
      stocksCount: 32,
      commentsCount: 8,
      tags: ['リーダブルコード', 'プログラミング'],
      publishedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      processed: true,
      processedAt: new Date('2024-01-16'),
      bookExtractionStatus: 'completed',
      lastCheckedAt: new Date('2024-01-16')
    }
  ]
};

async function insertData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await mongoose.connection.db.collection('categories').deleteMany({});
    await mongoose.connection.db.collection('books').deleteMany({});
    await mongoose.connection.db.collection('qiita_articles').deleteMany({});
    await mongoose.connection.db.collection('book_mentions').deleteMany({});
    
    // Insert sample data
    const categoriesResult = await mongoose.connection.db.collection('categories').insertMany(sampleData.categories);
    console.log(`${categoriesResult.insertedCount} categories inserted`);
    
    const booksResult = await mongoose.connection.db.collection('books').insertMany(sampleData.books);
    console.log(`${booksResult.insertedCount} books inserted`);
    
    const articlesResult = await mongoose.connection.db.collection('qiita_articles').insertMany(sampleData.articles);
    console.log(`${articlesResult.insertedCount} articles inserted`);
    
    // Create a book mention
    const bookMention = {
      bookId: booksResult.insertedIds[0],
      articleId: articlesResult.insertedIds[0],
      mentionedAt: new Date('2024-01-15')
    };
    
    const mentionResult = await mongoose.connection.db.collection('book_mentions').insertOne(bookMention);
    console.log(`1 book mention inserted`);
    
    // Show final counts
    const stats = {
      categories: await mongoose.connection.db.collection('categories').countDocuments(),
      books: await mongoose.connection.db.collection('books').countDocuments(),
      articles: await mongoose.connection.db.collection('qiita_articles').countDocuments(),
      mentions: await mongoose.connection.db.collection('book_mentions').countDocuments()
    };
    
    console.log('Final database stats:', stats);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

insertData();