export default defineEventHandler(async (event) => {
  try {
    const bookId = getRouterParam(event, 'id')
    
    if (!bookId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Book ID is required',
        data: {
          success: false,
          error: 'Missing required parameter',
          message: 'Book ID must be provided'
        }
      })
    }

    const id = parseInt(bookId)
    
    if (isNaN(id) || id <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Book ID',
        data: {
          success: false,
          error: 'Invalid parameter',
          message: 'Book ID must be a positive integer'
        }
      })
    }

    console.log(`📄 Book Mentions API Request: bookId=${id}`)

    // Mock mentions data - in real app, this would come from database
    const mockMentions = [
      {
        id: `mention-${id}-1`,
        articleId: `qiita-${id}-001`,
        title: `技術書レビュー: 実践的な学習ガイド (Book ID: ${id})`,
        url: `https://qiita.com/example/items/review-${id}-001`,
        author: 'tech_reviewer',
        publishedAt: '2024-12-15T10:30:00Z',
        likesCount: Math.floor(Math.random() * 100) + 20,
        context: 'この本は非常に実践的で、現場で即座に活用できる内容が豊富に含まれています。特に初心者から中級者へのステップアップに最適だと感じました。',
        confidence: 0.95,
        sentiment: 'positive',
        tags: ['書籍レビュー', '実践', '学習', 'エンジニア']
      },
      {
        id: `mention-${id}-2`,
        articleId: `qiita-${id}-002`,
        title: `おすすめ技術書リスト 2024年版`,
        url: `https://qiita.com/example/items/books-2024-${id}`,
        author: 'book_curator',
        publishedAt: '2024-11-28T14:22:00Z',
        likesCount: Math.floor(Math.random() * 200) + 50,
        context: '今年読んだ技術書の中でも特に印象に残った一冊。理論と実践のバランスが良く、読みやすさも抜群でした。',
        confidence: 0.88,
        sentiment: 'positive',
        tags: ['2024年', 'おすすめ', '技術書', 'ランキング']
      },
      {
        id: `mention-${id}-3`,
        articleId: `qiita-${id}-003`,
        title: `新人エンジニア向け必読書リスト`,
        url: `https://qiita.com/example/items/newbie-books-${id}`,
        author: 'senior_engineer',
        publishedAt: '2024-10-15T09:15:00Z',
        likesCount: Math.floor(Math.random() * 150) + 30,
        context: '新人の頃に読んでおけば良かったと思える本の一つ。基礎をしっかり固めたい人には特におすすめしたいです。',
        confidence: 0.92,
        sentiment: 'positive',
        tags: ['新人', 'エンジニア', '基礎', '必読']
      },
      {
        id: `mention-${id}-4`,
        articleId: `qiita-${id}-004`,
        title: `技術書の選び方と活用法`,
        url: `https://qiita.com/example/items/how-to-choose-books-${id}`,
        author: 'learning_expert',
        publishedAt: '2024-09-20T16:45:00Z',
        likesCount: Math.floor(Math.random() * 80) + 15,
        context: 'この本のような実践的な内容が書かれた技術書は、読むだけでなく実際に手を動かしながら学習することが重要です。',
        confidence: 0.85,
        sentiment: 'neutral',
        tags: ['学習法', '技術書', '実践', 'スキルアップ']
      }
    ]

    // Add more mentions based on book popularity (simulated)
    const additionalMentions = []
    const mentionCount = Math.min(20, Math.max(3, Math.floor(Math.random() * 15) + 5))
    
    for (let i = 5; i <= mentionCount; i++) {
      const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
      additionalMentions.push({
        id: `mention-${id}-${i}`,
        articleId: `qiita-${id}-${String(i).padStart(3, '0')}`,
        title: `技術記事 ${i}: 開発現場での実践例`,
        url: `https://qiita.com/example/items/practice-${id}-${i}`,
        author: `developer_${i}`,
        publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        likesCount: Math.floor(Math.random() * 100) + 10,
        context: `実際のプロジェクトでこの本の内容を参考にしました。${sentiment === 'positive' ? '非常に役立ちました。' : sentiment === 'neutral' ? '参考程度でした。' : '期待していたほどではありませんでした。'}`,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        sentiment,
        tags: ['実践', 'プロジェクト', '開発', 'エンジニア']
      })
    }

    const allMentions = [...mockMentions, ...additionalMentions]

    // Sort by published date (newest first)
    allMentions.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    const result = {
      success: true,
      data: allMentions,
      meta: {
        bookId: id,
        totalMentions: allMentions.length,
        sentimentBreakdown: {
          positive: allMentions.filter(m => m.sentiment === 'positive').length,
          neutral: allMentions.filter(m => m.sentiment === 'neutral').length,
          negative: allMentions.filter(m => m.sentiment === 'negative').length
        },
        averageConfidence: Math.round((allMentions.reduce((sum, m) => sum + m.confidence, 0) / allMentions.length) * 100) / 100,
        totalLikes: allMentions.reduce((sum, m) => sum + m.likesCount, 0),
        lastUpdated: new Date().toISOString()
      }
    }

    console.log(`📤 Book Mentions API Response: success=${result.success}, totalMentions=${result.meta.totalMentions}`)

    return result

  } catch (error) {
    console.error('❌ Book Mentions API Error:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch book mentions',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})