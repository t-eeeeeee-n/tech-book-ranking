<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <SimpleHeader />
    
    <div class="container mx-auto px-6 py-8">
      <div v-if="pending" class="flex justify-center items-center min-h-96">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">書籍が見つかりません</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-8">指定された書籍は存在しないか、削除された可能性があります。</p>
        <button 
          @click="navigateTo('/')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          トップページに戻る
        </button>
      </div>

      <div v-else-if="book" class="max-w-4xl mx-auto">
        <!-- パンくずナビ -->
        <nav class="mb-6 text-sm">
          <ol class="flex space-x-2 text-gray-500 dark:text-gray-400">
            <li><NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">ホーム</NuxtLink></li>
            <li>›</li>
            <li class="text-gray-800 dark:text-gray-200">{{ book.title }}</li>
          </ol>
        </nav>

        <!-- 書籍メイン情報 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8 transition-colors duration-300">
          <div class="p-8">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- 書影 -->
              <div class="flex-shrink-0">
                <div class="w-48 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div v-if="book.imageUrl" class="w-full h-full">
                    <img 
                      :src="book.imageUrl" 
                      :alt="book.title"
                      class="w-full h-full object-cover rounded-lg"
                    >
                  </div>
                  <div v-else class="text-gray-400 dark:text-gray-500 text-center p-4">
                    <Icon name="heroicons:book-open" class="w-16 h-16 mx-auto mb-2" />
                    <p class="text-sm">書影なし</p>
                  </div>
                </div>
              </div>

              <!-- 書籍詳細 -->
              <div class="flex-grow">
                <div class="mb-4">
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ book.title }}</h1>
                  <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">
                    {{ Array.isArray(book.author) ? book.author.join(', ') : book.author }}
                  </p>
                </div>

                <!-- いい本スコア -->
                <div v-if="book.goodBookScore !== undefined" class="mb-8">
                  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">いい本スコア</h3>
                      <div class="flex items-center gap-2">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ Math.round(book.goodBookScore) }}</span>
                        <span class="text-lg text-gray-500 dark:text-gray-400">/ 100</span>
                      </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="mb-4">
                      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          class="h-3 rounded-full transition-all duration-700 ease-out"
                          :class="getScoreProgressClass(book.goodBookScore)"
                          :style="{ width: `${Math.min(100, Math.max(0, book.goodBookScore))}%` }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Score Label -->
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium text-gray-600 dark:text-gray-400">おすすめ度</span>
                      <span 
                        class="font-bold px-3 py-1 rounded-full"
                        :class="getScoreLabelClass(book.goodBookScore)"
                      >
                        {{ getScoreLabel(book.goodBookScore) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Score Breakdown -->
                  <div v-if="book.articleCount || book.totalLikes || book.newestArticleDate" class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">スコア構成要素</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div v-if="book.articleCount" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ book.articleCount }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">紹介記事数</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">40% 重要度</div>
                      </div>
                      <div v-if="book.totalLikes" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ book.totalLikes }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">総LGTM数</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">35% 重要度</div>
                      </div>
                      <div v-if="book.newestArticleDate" class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ getRecencyLabel(book.newestArticleDate) }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">最新記事</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">25% 重要度</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Explanation Text -->
                  <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <p class="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                      <Icon name="heroicons:information-circle" class="w-4 h-4 inline mr-1" />
                      {{ getScoreExplanation(book) }}
                    </p>
                  </div>
                </div>

                <!-- 統計情報 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ book.mentionCount }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">総言及回数</div>
                  </div>
                  <div class="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ book.uniqueArticleCount || 0 }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">記事数</div>
                  </div>
                  <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ Math.round(book.trendScore || 0) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">トレンドスコア</div>
                  </div>
                  <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">#{{ currentRank || '?' }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">現在のランク</div>
                  </div>
                </div>

                <!-- カテゴリとタグ -->
                <div class="mb-6">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
                      {{ book.category }}
                    </span>
                  </div>
                  <div v-if="book.tags" class="flex flex-wrap gap-2">
                    <span 
                      v-for="tag in book.tags" 
                      :key="tag"
                      class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 書籍説明 -->
                <div v-if="book.description" class="mb-6">
                  <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">概要</h3>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ book.description }}</p>
                </div>

                <!-- 詳細情報 -->
                <div class="mb-6 grid grid-cols-2 gap-4 text-sm">
                  <div v-if="book.publishedDate">
                    <span class="font-medium text-gray-600 dark:text-gray-400">出版日:</span>
                    <span class="ml-2 text-gray-900 dark:text-white">{{ formatDate(book.publishedDate) }}</span>
                  </div>
                  <div v-if="book.publisher">
                    <span class="font-medium text-gray-600 dark:text-gray-400">出版社:</span>
                    <span class="ml-2 text-gray-900 dark:text-white">{{ book.publisher }}</span>
                  </div>
                  <div v-if="book.pages">
                    <span class="font-medium text-gray-600 dark:text-gray-400">ページ数:</span>
                    <span class="ml-2 text-gray-900 dark:text-white">{{ book.pages }}ページ</span>
                  </div>
                  <div v-if="book.isbn">
                    <span class="font-medium text-gray-600 dark:text-gray-400">ISBN:</span>
                    <span class="ml-2 text-gray-900 dark:text-white">{{ book.isbn }}</span>
                  </div>
                </div>

                <!-- 購入リンク -->
                <div class="flex gap-4">
                  <a 
                    v-if="book.amazonUrl"
                    :href="book.amazonUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
                    Amazonで購入
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 言及記事一覧 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">この書籍が言及されている記事</h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2">{{ mentions.length }}件の記事でこの書籍が紹介されています</p>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="mention in mentions" 
              :key="mention.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-grow">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    <a 
                      :href="mention.articleUrl" 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {{ mention.articleTitle }}
                    </a>
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-3">{{ mention.context }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(mention.mentionedAt) }}</span>
                    <span class="flex items-center">
                      <Icon name="heroicons:heart" class="w-4 h-4 mr-1" />
                      {{ mention.articleLikes }}
                    </span>
                    <span v-if="mention.sentiment" class="capitalize">
                      {{ getSentimentIcon(mention.sentiment) }} {{ mention.sentiment }}
                    </span>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">信頼度</div>
                    <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {{ Math.round(mention.confidence * 100) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mentions.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>まだ言及記事がありません</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: number
  title: string
  author: string
  category: string
  tags?: string[]
  mentionCount: number
  uniqueArticleCount?: number
  trendScore?: number
  description?: string
  imageUrl?: string
  amazonUrl?: string
  publishedDate?: string
  publisher?: string
  pages?: number
  isbn?: string
  rating?: number
  goodBookScore?: number
  articleCount?: number
  totalLikes?: number
  newestArticleDate?: string
}

interface Mention {
  id: string
  articleTitle: string
  articleUrl: string
  context: string
  confidence: number
  sentiment?: 'positive' | 'neutral' | 'negative'
  mentionedAt: string
  articleLikes: number
}

const route = useRoute()
const bookId = route.params.id

// 書籍データを取得
const { data: bookData, pending, error } = await useFetch(`/api/books/${bookId}`)

// book データを取得
const book = computed(() => bookData.value?.data || null)

// モックの言及データ（実際の実装では API から取得）
const mentions = ref<Mention[]>([
  {
    id: '1',
    articleTitle: '新人エンジニアに読んでほしい技術書10選',
    articleUrl: 'https://qiita.com/example/items/1',
    context: 'リーダブルコードは新人エンジニアに最もおすすめしたい一冊です。コードの可読性について深く学べます。',
    confidence: 0.95,
    sentiment: 'positive',
    mentionedAt: '2024-11-15T10:00:00Z',
    articleLikes: 45
  },
  {
    id: '2',
    articleTitle: 'プログラミング学習で読むべき書籍まとめ',
    articleUrl: 'https://qiita.com/example/items/2',
    context: 'コーディング規約を学ぶならこの本は必読です。',
    confidence: 0.88,
    sentiment: 'positive',
    mentionedAt: '2024-10-20T15:30:00Z',
    articleLikes: 23
  }
])

// 現在のランクを取得（モック）
const currentRank = computed(() => {
  if (!book.value) return '?'
  return book.value.id // 簡単なランク計算
})

function getSentimentIcon(sentiment: string): string {
  switch (sentiment) {
    case 'positive': return '😊'
    case 'negative': return '😞'
    default: return '😐'
  }
}

function formatDate(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString as string | number | Date)
    if (isNaN(date.getTime())) {
      return String(dateString)
    }
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return String(dateString)
  }
}

// Score related functions
function getScoreProgressClass(score: number): string {
  if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  if (score >= 80) return 'bg-gradient-to-r from-green-500 to-green-600'
  if (score >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (score >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-600'
  return 'bg-gradient-to-r from-red-500 to-red-600'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return '🏆 殿堂入り'
  if (score >= 80) return '⭐ 超おすすめ'
  if (score >= 70) return '🌟 おすすめ'
  if (score >= 60) return '👍 良書'
  if (score >= 40) return '📚 普通'
  return '💭 要検討'
}

function getScoreLabelClass(score: number): string {
  if (score >= 90) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
  if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (score >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

function getRecencyLabel(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const monthsAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
  
  if (monthsAgo < 1) return '今月'
  if (monthsAgo < 3) return `${monthsAgo}ヶ月前`
  if (monthsAgo < 12) return `${monthsAgo}ヶ月前`
  const yearsAgo = Math.floor(monthsAgo / 12)
  return `${yearsAgo}年前`
}

function getScoreExplanation(book: any): string {
  if (!book.goodBookScore) return 'スコア情報が利用できません。'
  
  const score = book.goodBookScore
  const articleCount = book.articleCount || 0
  const totalLikes = book.totalLikes || 0
  const isRecent = book.newestArticleDate && new Date(book.newestArticleDate) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
  
  if (score >= 80) {
    return `この本は${articleCount}件の記事で紹介され、合計${totalLikes}のLGTMを獲得しています。${isRecent ? '最近も言及があり、' : ''}開発者コミュニティから高く評価されている優秀な技術書です。`
  } else if (score >= 60) {
    return `この本は${articleCount}件の記事で紹介され、${totalLikes}のLGTMを獲得しています。${isRecent ? '最近も言及があり、' : ''}多くの開発者に読まれている良書です。`
  } else {
    return `この本は${articleCount}件の記事で紹介されています。${isRecent ? '最近も言及があり、' : ''}特定の分野で参考にされている技術書です。`
  }
}

// SEO設定
useHead({
  title: computed(() => `${book.value?.title || '書籍詳細'} - Tech Book Rank`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => book.value ? 
        `${book.value.title}の詳細情報。${book.value.mentionCount}回言及されている人気の技術書です。` :
        '技術書の詳細情報を確認できます。')
    }
  ]
})
</script>