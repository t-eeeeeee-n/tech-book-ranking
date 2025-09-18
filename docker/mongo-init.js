// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the techbook-ranking database
db = db.getSiblingDB('techbook-ranking');

// Create application user with read/write permissions
db.createUser({
  user: 'techbook_app',
  pwd: 'app_password_change_me',
  roles: [
    { role: 'readWrite', db: 'techbook-ranking' }
  ]
});

// =============================================================================
// COLLECTION CREATION WITH VALIDATION
// =============================================================================
print('Creating collections with validation schemas...');

// Books collection
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "titleNormalized", "author", "category", "tags", "mentionCount", "uniqueArticleCount", "trendScore", "status", "createdAt", "updatedAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        title: {
          bsonType: "string",
          maxLength: 200,
          description: "書籍の正式タイトル（必須、最大200文字）"
        },
        titleNormalized: {
          bsonType: "string",
          maxLength: 200,
          description: "検索用正規化タイトル（必須、最大200文字）"
        },
        author: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "著者名の配列（必須）"
        },
        publisher: {
          bsonType: ["string", "null"],
          maxLength: 100,
          description: "出版社名（任意、最大100文字）"
        },
        isbn10: {
          bsonType: ["string", "null"],
          maxLength: 10,
          description: "ISBN-10コード（任意、10文字）"
        },
        isbn13: {
          bsonType: ["string", "null"],
          maxLength: 13,
          description: "ISBN-13コード（任意、13文字）"
        },
        publishedYear: {
          bsonType: ["int", "null"],
          minimum: 1900,
          maximum: 2100,
          description: "出版年（任意、1900-2100）"
        },
        category: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "技術分野カテゴリ（必須）"
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "技術タグ（必須）"
        },
        mentionCount: {
          bsonType: "int",
          minimum: 0,
          description: "総言及回数（必須、0以上）"
        },
        uniqueArticleCount: {
          bsonType: "int",
          minimum: 0,
          description: "言及した記事の数（必須、0以上）"
        },
        firstMentionedAt: {
          bsonType: ["date", "null"],
          description: "最初に言及された日時（任意）"
        },
        lastMentionedAt: {
          bsonType: ["date", "null"],
          description: "最後に言及された日時（任意）"
        },
        trendScore: {
          bsonType: "double",
          minimum: 0,
          description: "時間重み付きスコア（必須、0以上）"
        },
        amazonUrl: {
          bsonType: ["string", "null"],
          maxLength: 500,
          description: "Amazon商品ページURL（任意、最大500文字）"
        },
        rakutenUrl: {
          bsonType: ["string", "null"],
          maxLength: 500,
          description: "楽天商品ページURL（任意、最大500文字）"
        },
        imageUrl: {
          bsonType: ["string", "null"],
          maxLength: 500,
          description: "書籍画像URL（任意、最大500文字）"
        },
        description: {
          bsonType: ["string", "null"],
          maxLength: 1000,
          description: "書籍の説明文（任意、最大1000文字）"
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive", "merged"],
          description: "ステータス（必須、active/inactive/merged）"
        },
        mergedTo: {
          bsonType: ["objectId", "null"],
          description: "統合先書籍のID（任意）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        },
        updatedAt: {
          bsonType: "date",
          description: "レコード更新日時（必須）"
        }
      }
    }
  }
});

// Qiita articles collection
db.createCollection("qiita_articles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["qiitaId", "title", "url", "authorId", "authorName", "likesCount", "stocksCount", "commentsCount", "excerpt", "tags", "publishedAt", "updatedAt", "processed", "bookExtractionStatus", "createdAt", "lastCheckedAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        qiitaId: {
          bsonType: "string",
          maxLength: 50,
          description: "Qiita固有の記事ID（必須、ユニーク、最大50文字）"
        },
        title: {
          bsonType: "string",
          maxLength: 200,
          description: "記事のタイトル（必須、最大200文字）"
        },
        url: {
          bsonType: "string",
          maxLength: 500,
          description: "記事のURL（必須、最大500文字）"
        },
        authorId: {
          bsonType: "string",
          maxLength: 50,
          description: "記事著者のQiitaID（必須、最大50文字）"
        },
        authorName: {
          bsonType: "string",
          maxLength: 100,
          description: "記事著者の表示名（必須、最大100文字）"
        },
        likesCount: {
          bsonType: "int",
          minimum: 0,
          description: "記事のいいね数（必須、0以上）"
        },
        stocksCount: {
          bsonType: "int",
          minimum: 0,
          description: "記事のストック数（必須、0以上）"
        },
        commentsCount: {
          bsonType: "int",
          minimum: 0,
          description: "記事のコメント数（必須、0以上）"
        },
        body: {
          bsonType: ["string", "null"],
          description: "記事の本文（任意、容量大）"
        },
        excerpt: {
          bsonType: "string",
          maxLength: 500,
          description: "記事の抜粋（必須、最大500文字）"
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "記事に付けられたタグ（必須）"
        },
        publishedAt: {
          bsonType: "date",
          description: "記事の投稿日時（必須）"
        },
        updatedAt: {
          bsonType: "date",
          description: "記事の更新日時（必須）"
        },
        processed: {
          bsonType: "bool",
          description: "書籍抽出処理済みか（必須）"
        },
        processedAt: {
          bsonType: ["date", "null"],
          description: "書籍抽出処理実行日時（任意）"
        },
        bookExtractionStatus: {
          bsonType: "string",
          enum: ["pending", "completed", "failed"],
          description: "抽出ステータス（必須、pending/completed/failed）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        },
        lastCheckedAt: {
          bsonType: "date",
          description: "最終確認日時（必須）"
        }
      }
    }
  }
});

// Book mentions collection
db.createCollection("book_mentions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["bookId", "articleId", "mentionText", "context", "confidence", "extractionMethod", "articlePopularity", "authorCredibility", "mentionWeight", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        bookId: {
          bsonType: "objectId",
          description: "書籍ID（必須、参照先：books._id）"
        },
        articleId: {
          bsonType: "objectId",
          description: "記事ID（必須、参照先：qiita_articles._id）"
        },
        mentionText: {
          bsonType: "string",
          maxLength: 200,
          description: "記事内で言及された文言（必須、最大200文字）"
        },
        context: {
          bsonType: "string",
          maxLength: 300,
          description: "言及箇所の前後文脈（必須、最大300文字）"
        },
        confidence: {
          bsonType: "double",
          minimum: 0.0,
          maximum: 1.0,
          description: "抽出結果の信頼度（必須、0.0-1.0）"
        },
        extractionMethod: {
          bsonType: "string",
          enum: ["regex", "nlp", "manual"],
          description: "抽出方法（必須、regex/nlp/manual）"
        },
        sentiment: {
          bsonType: ["string", "null"],
          enum: ["positive", "neutral", "negative", null],
          description: "感情分析結果（任意、positive/neutral/negative）"
        },
        recommendationLevel: {
          bsonType: ["int", "null"],
          minimum: 1,
          maximum: 5,
          description: "推薦度（任意、1-5）"
        },
        articlePopularity: {
          bsonType: "double",
          minimum: 0,
          description: "記事のいいね数等から算出（必須、0以上）"
        },
        authorCredibility: {
          bsonType: "double",
          minimum: 0,
          description: "著者の信頼度スコア（必須、0以上）"
        },
        mentionWeight: {
          bsonType: "double",
          minimum: 0,
          description: "最終的な言及の重み（必須、0以上）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        },
        verifiedAt: {
          bsonType: ["date", "null"],
          description: "手動検証実施日時（任意）"
        },
        verifiedBy: {
          bsonType: ["string", "null"],
          maxLength: 50,
          description: "検証を行った人（任意、最大50文字）"
        }
      }
    }
  }
});

// Categories collection
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug", "displayOrder", "isActive", "bookCount", "createdAt", "updatedAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        name: {
          bsonType: "string",
          maxLength: 100,
          description: "カテゴリの表示名（必須、最大100文字）"
        },
        slug: {
          bsonType: "string",
          maxLength: 50,
          description: "URL用のスラッグ（必須、ユニーク、最大50文字）"
        },
        description: {
          bsonType: ["string", "null"],
          maxLength: 500,
          description: "カテゴリの説明文（任意、最大500文字）"
        },
        parentId: {
          bsonType: ["objectId", "null"],
          description: "階層構造の親ID（任意）"
        },
        displayOrder: {
          bsonType: "int",
          minimum: 0,
          description: "表示順序（必須、0以上）"
        },
        isActive: {
          bsonType: "bool",
          description: "カテゴリが有効か（必須）"
        },
        color: {
          bsonType: ["string", "null"],
          maxLength: 20,
          description: "カテゴリの表示色（任意、最大20文字）"
        },
        icon: {
          bsonType: ["string", "null"],
          maxLength: 50,
          description: "カテゴリのアイコン名（任意、最大50文字）"
        },
        bookCount: {
          bsonType: "int",
          minimum: 0,
          description: "このカテゴリの書籍数（必須、0以上）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        },
        updatedAt: {
          bsonType: "date",
          description: "レコード更新日時（必須）"
        }
      }
    }
  }
});

// Rankings collection
db.createCollection("rankings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "period", "rankings", "totalBooks", "generatedAt", "expiresAt", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        type: {
          bsonType: "string",
          enum: ["overall", "category", "trending", "newcomer"],
          description: "ランキング種別（必須、overall/category/trending/newcomer）"
        },
        categoryId: {
          bsonType: ["objectId", "null"],
          description: "カテゴリID（任意、参照先：categories._id）"
        },
        period: {
          bsonType: "string",
          enum: ["all", "year", "month", "week"],
          description: "集計期間（必須、all/year/month/week）"
        },
        rankings: {
          bsonType: "array",
          description: "ランキング配列データ（必須）"
        },
        totalBooks: {
          bsonType: "int",
          minimum: 0,
          description: "ランキング対象の総書籍数（必須、0以上）"
        },
        generatedAt: {
          bsonType: "date",
          description: "ランキング生成日時（必須）"
        },
        expiresAt: {
          bsonType: "date",
          description: "キャッシュの有効期限（必須）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        }
      }
    }
  }
});

// Favorites collection
db.createCollection("favorites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "bookId", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        userId: {
          bsonType: "objectId",
          description: "ユーザーID（必須）"
        },
        bookId: {
          bsonType: "objectId",
          description: "書籍ID（必須、参照先：books._id）"
        },
        createdAt: {
          bsonType: "date",
          description: "お気に入り登録日時（必須）"
        }
      }
    }
  }
});

// Batch logs collection
db.createCollection("batch_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["batchType", "status", "startedAt", "processedCount", "successCount", "errorCount", "createdAt"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        batchType: {
          bsonType: "string",
          enum: ["qiita_fetch", "book_extraction", "ranking_update", "cache_update"],
          description: "バッチ種別（必須、qiita_fetch/book_extraction/ranking_update/cache_update）"
        },
        status: {
          bsonType: "string",
          enum: ["running", "completed", "failed", "cancelled"],
          description: "処理ステータス（必須、running/completed/failed/cancelled）"
        },
        startedAt: {
          bsonType: "date",
          description: "バッチ処理開始日時（必須）"
        },
        completedAt: {
          bsonType: ["date", "null"],
          description: "バッチ処理完了日時（任意）"
        },
        duration: {
          bsonType: ["int", "null"],
          minimum: 0,
          description: "処理時間（任意、秒）"
        },
        processedCount: {
          bsonType: "int",
          minimum: 0,
          description: "処理した件数（必須、0以上）"
        },
        successCount: {
          bsonType: "int",
          minimum: 0,
          description: "成功した件数（必須、0以上）"
        },
        errorCount: {
          bsonType: "int",
          minimum: 0,
          description: "エラーが発生した件数（必須、0以上）"
        },
        errors: {
          bsonType: ["array", "null"],
          description: "エラーの詳細情報（任意）"
        },
        config: {
          bsonType: ["object", "null"],
          description: "バッチ実行時の設定（任意）"
        },
        createdAt: {
          bsonType: "date",
          description: "レコード作成日時（必須）"
        }
      }
    }
  }
});

print('Collections created successfully with validation schemas!');

print('Creating indexes...');

// =============================================================================
// BOOKS COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.books.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.books.createIndex({ "title": 1 });                    // インデックス指定
db.books.createIndex({ "titleNormalized": 1 });          // インデックス指定
db.books.createIndex({ "author": 1 });                   // インデックス指定
db.books.createIndex({ "isbn10": 1 }, { sparse: true }); // インデックス指定、NULLを許可するのでsparse
db.books.createIndex({ "isbn13": 1 }, { sparse: true }); // インデックス指定、NULLを許可するのでsparse
db.books.createIndex({ "publishedYear": 1 });            // インデックス指定
db.books.createIndex({ "category": 1 });                 // インデックス指定
db.books.createIndex({ "tags": 1 });                     // インデックス指定
db.books.createIndex({ "mentionCount": -1 });            // インデックス指定（降順で最適化）
db.books.createIndex({ "uniqueArticleCount": 1 });       // インデックス指定
db.books.createIndex({ "lastMentionedAt": -1 });         // インデックス指定（降順で最適化）
db.books.createIndex({ "trendScore": -1 });              // インデックス指定（降順で最適化）
db.books.createIndex({ "status": 1 });                   // インデックス指定

// Compound indexes for common query patterns
db.books.createIndex({ "status": 1, "mentionCount": -1 });
db.books.createIndex({ "category": 1, "mentionCount": -1 });
db.books.createIndex({ "status": 1, "category": 1, "trendScore": -1 });
db.books.createIndex({ "status": 1, "trendScore": -1 });
db.books.createIndex({ "category": 1, "trendScore": -1 });

// =============================================================================
// QIITA_ARTICLES COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.qiita_articles.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.qiita_articles.createIndex({ "qiitaId": 1 }, { unique: true }); // ユニーク制約
db.qiita_articles.createIndex({ "authorId": 1 });                 // インデックス指定
db.qiita_articles.createIndex({ "likesCount": -1 });              // インデックス指定（降順で最適化）
db.qiita_articles.createIndex({ "tags": 1 });                     // インデックス指定
db.qiita_articles.createIndex({ "publishedAt": -1 });             // インデックス指定（降順で最適化）
db.qiita_articles.createIndex({ "processed": 1 });               // インデックス指定
db.qiita_articles.createIndex({ "bookExtractionStatus": 1 });    // インデックス指定

// Additional useful compound indexes
db.qiita_articles.createIndex({ "processed": 1, "publishedAt": -1 });
db.qiita_articles.createIndex({ "authorId": 1, "publishedAt": -1 });

// =============================================================================
// BOOK_MENTIONS COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.book_mentions.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.book_mentions.createIndex({ "bookId": 1 });              // インデックス指定
db.book_mentions.createIndex({ "articleId": 1 });           // インデックス指定
db.book_mentions.createIndex({ "confidence": -1 });         // インデックス指定（降順で最適化）
db.book_mentions.createIndex({ "extractionMethod": 1 });    // インデックス指定
db.book_mentions.createIndex({ "sentiment": 1 });           // インデックス指定
db.book_mentions.createIndex({ "mentionWeight": -1 });      // インデックス指定（降順で最適化）
db.book_mentions.createIndex({ "createdAt": 1 });           // インデックス指定

// Compound indexes for common query patterns
db.book_mentions.createIndex({ "bookId": 1, "articleId": 1 }, { unique: true }); // 重複防止
db.book_mentions.createIndex({ "bookId": 1, "mentionWeight": -1 });
db.book_mentions.createIndex({ "articleId": 1, "confidence": -1 });

// =============================================================================
// CATEGORIES COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.categories.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.categories.createIndex({ "slug": 1 }, { unique: true }); // ユニーク制約
db.categories.createIndex({ "parentId": 1 });               // インデックス指定
db.categories.createIndex({ "displayOrder": 1 });           // インデックス指定
db.categories.createIndex({ "isActive": 1 });               // インデックス指定

// Compound indexes for hierarchical queries
db.categories.createIndex({ "isActive": 1, "displayOrder": 1 });
db.categories.createIndex({ "parentId": 1, "displayOrder": 1 });

// =============================================================================
// RANKINGS COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.rankings.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.rankings.createIndex({ "type": 1 });                     // インデックス指定
db.rankings.createIndex({ "categoryId": 1 });               // インデックス指定
db.rankings.createIndex({ "period": 1 });                   // インデックス指定
db.rankings.createIndex({ "generatedAt": -1 });             // インデックス指定（降順で最適化）
db.rankings.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 }); // インデックス指定 + TTL

// Compound indexes for ranking queries
db.rankings.createIndex({ "type": 1, "categoryId": 1, "period": 1 });
db.rankings.createIndex({ "type": 1, "period": 1, "generatedAt": -1 });

// =============================================================================
// BATCH_LOGS COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.batch_logs.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes based on table definition
db.batch_logs.createIndex({ "batchType": 1 });              // インデックス指定
db.batch_logs.createIndex({ "status": 1 });                 // インデックス指定
db.batch_logs.createIndex({ "startedAt": -1 });             // インデックス指定（降順で最適化）

// TTL index for automatic cleanup (90 days)
db.batch_logs.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 7776000 });

// Compound indexes for batch monitoring
db.batch_logs.createIndex({ "batchType": 1, "status": 1, "startedAt": -1 });

// =============================================================================
// FAVORITES COLLECTION INDEXES
// =============================================================================
// Primary key (automatic)
// db.favorites.createIndex({ "_id": 1 }); // Automatically created

// Individual field indexes for favorites collection
db.favorites.createIndex({ "userId": 1 });                              // ユーザー検索用
db.favorites.createIndex({ "bookId": 1 });                              // 書籍検索用
db.favorites.createIndex({ "createdAt": -1 });                          // 登録日時順

// Compound indexes for common query patterns
db.favorites.createIndex({ "userId": 1, "bookId": 1 }, { unique: true }); // 重複防止（1ユーザー1書籍につき1つのお気に入り）
db.favorites.createIndex({ "userId": 1, "createdAt": -1 });               // ユーザーのお気に入り履歴

print('Database initialization completed successfully!');
print('Created indexes for optimal query performance based on table definition');
print('Collections: books, qiita_articles, book_mentions, categories, rankings, batch_logs, favorites');

// =============================================================================
// INITIAL DATA INSERTION
// =============================================================================
print('Inserting initial data...');

// Insert initial categories
print('Inserting categories...');
db.categories.insertMany([
  {
    name: "プログラミング言語",
    slug: "programming-languages",
    description: "各種プログラミング言語に関する技術書",
    parentId: null,
    displayOrder: 1,
    isActive: true,
    color: "#007acc",
    icon: "code",
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Web開発",
    slug: "web-development",
    description: "Webアプリケーション開発に関する技術書",
    parentId: null,
    displayOrder: 2,
    isActive: true,
    color: "#28a745",
    icon: "globe",
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "AI・機械学習",
    slug: "ai-ml",
    description: "AI・機械学習・データサイエンス関連の技術書",
    parentId: null,
    displayOrder: 3,
    isActive: true,
    color: "#ff6b35",
    icon: "brain",
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "インフラ・DevOps",
    slug: "infrastructure-devops",
    description: "インフラ・DevOps・クラウド関連の技術書",
    parentId: null,
    displayOrder: 4,
    isActive: true,
    color: "#6c757d",
    icon: "server",
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "アーキテクチャ・設計",
    slug: "architecture-design",
    description: "システムアーキテクチャ・設計に関する技術書",
    parentId: null,
    displayOrder: 5,
    isActive: true,
    color: "#17a2b8",
    icon: "blueprint",
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample books
print('Inserting sample books...');
db.books.insertMany([
  {
    title: "リーダブルコード",
    titleNormalized: "readable code",
    author: ["Dustin Boswell", "Trevor Foucher"],
    publisher: "オライリージャパン",
    isbn13: "9784873115658",
    publishedYear: 2012,
    category: ["プログラミング言語", "アーキテクチャ・設計"],
    tags: ["コード品質", "プログラミング", "ベストプラクティス"],
    mentionCount: 145,
    uniqueArticleCount: 98,
    firstMentionedAt: new Date('2023-01-15'),
    lastMentionedAt: new Date('2024-11-20'),
    trendScore: 89.5,
    status: "active",
    description: "より良いコードを書くための実践的なテクニック集",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Clean Code アジャイルソフトウェア達人の技",
    titleNormalized: "clean code",
    author: ["Robert C. Martin"],
    publisher: "KADOKAWA",
    isbn13: "9784048930598",
    publishedYear: 2017,
    category: ["プログラミング言語", "アーキテクチャ・設計"],
    tags: ["Clean Code", "アジャイル", "プログラミング"],
    mentionCount: 87,
    uniqueArticleCount: 56,
    firstMentionedAt: new Date('2023-02-10'),
    lastMentionedAt: new Date('2024-11-18'),
    trendScore: 76.3,
    status: "active",
    description: "保守しやすく読みやすいコードを書くための原則と実践",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "JavaScript 第7版",
    titleNormalized: "javascript",
    author: ["David Flanagan"],
    publisher: "オライリージャパン",
    isbn13: "9784873119700",
    publishedYear: 2021,
    category: ["プログラミング言語", "Web開発"],
    tags: ["JavaScript", "Web開発", "フロントエンド"],
    mentionCount: 67,
    uniqueArticleCount: 43,
    firstMentionedAt: new Date('2023-03-05'),
    lastMentionedAt: new Date('2024-11-15'),
    trendScore: 82.1,
    status: "active",
    description: "JavaScriptの基礎から応用まで包括的に学べる決定版",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "機械学習エンジニアになりたい人のための本",
    titleNormalized: "machine learning engineer",
    author: ["石井大輔"],
    publisher: "翔泳社",
    isbn13: "9784798165646",
    publishedYear: 2021,
    category: ["AI・機械学習"],
    tags: ["機械学習", "AI", "データサイエンス", "Python"],
    mentionCount: 34,
    uniqueArticleCount: 28,
    firstMentionedAt: new Date('2023-04-20'),
    lastMentionedAt: new Date('2024-11-12'),
    trendScore: 71.8,
    status: "active",
    description: "機械学習エンジニアに必要なスキルと実践的な知識",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kubernetes完全ガイド",
    titleNormalized: "kubernetes complete guide",
    author: ["青山真也"],
    publisher: "インプレス",
    isbn13: "9784295009092",
    publishedYear: 2020,
    category: ["インフラ・DevOps"],
    tags: ["Kubernetes", "コンテナ", "DevOps", "インフラ"],
    mentionCount: 52,
    uniqueArticleCount: 38,
    firstMentionedAt: new Date('2023-05-10'),
    lastMentionedAt: new Date('2024-11-10'),
    trendScore: 68.9,
    status: "active",
    description: "Kubernetesの基礎から運用まで徹底解説",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Initial data insertion completed successfully!');
print('Inserted categories: 5');
print('Inserted sample books: 5');