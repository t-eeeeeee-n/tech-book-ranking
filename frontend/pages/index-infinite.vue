<template>
  <div class="min-h-screen">
    <!-- Header -->
    <SimpleHeader />
    
    <!-- Modern Hero Section -->
    <ModernHeroSection 
      :total-books="totalBooks" 
      :total-categories="12"
      update-frequency="毎日"
    />
    
    <!-- Infinite Scroll Ranking Section -->
    <section class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            人気技術書
            <span class="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              完全ランキング
            </span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Qiita記事で最も言及されている技術書を無限スクロールで表示。実際の開発現場で参考にされている書籍をご紹介します。
          </p>
          
          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:book-open" class="w-4 h-4 text-blue-600" />
              <span>{{ books.length }}冊表示中</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:chart-bar" class="w-4 h-4 text-green-600" />
              <span>{{ totalBooks }}冊総計</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:clock" class="w-4 h-4 text-purple-600" />
              <span>{{ formattedLastUpdate }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:arrow-path" class="w-4 h-4 text-orange-600" />
              <span>ページ {{ currentPage }} | {{ hasMore ? 'もっと読む' : '完了' }}</span>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-12 shadow-lg border border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                カテゴリ
              </label>
              <select 
                v-model="filters.category"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全カテゴリ</option>
                <option 
                  v-for="category in categories" 
                  :key="category.value" 
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>

            <!-- Period Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                期間
              </label>
              <select 
                v-model="filters.period"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全期間</option>
                <option value="year">過去1年</option>
                <option value="month">過去1ヶ月</option>
                <option value="week">過去1週間</option>
              </select>
            </div>

            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                検索
              </label>
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="書籍名・著者名で検索"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                並び順
              </label>
              <select 
                v-model="filters.sort"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mentions">言及数順</option>
                <option value="rating">評価順</option>
                <option value="title">タイトル順</option>
                <option value="author">著者順</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Initial Loading -->
        <div v-if="loading" class="mb-12">
          <SkeletonLoader :count="24" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p class="text-red-600 dark:text-red-400 font-medium mb-2">エラーが発生しました</p>
            <p class="text-red-500 dark:text-red-300 text-sm mb-4">{{ error }}</p>
            <button 
              @click="fetchInitialData"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>

        <!-- Books Grid -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            <BookCard
              v-for="(book, index) in books" 
              :key="book.id"
              :book="book"
              :rank="index + 1"
              @click="viewBookDetails"
              @amazon-click="openAmazonLink"
              @facebook-share="shareOnFacebook"
              @twitter-share="shareOnTwitter"
            />
          </div>

          <!-- Intersection Observer Target (invisible) -->
          <div 
            ref="targetRef" 
            class="h-1"
            v-if="hasMore"
          ></div>

          <!-- Loading More -->
          <div v-if="loadingMore" class="mb-12">
            <SkeletonLoader :count="8" />
          </div>

          <!-- No More Results -->
          <div v-else-if="!hasMore && books.length > 0" class="text-center py-12">
            <div class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-gray-600 dark:text-gray-400 font-medium">すべての結果を表示しました</span>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="!hasMore && books.length === 0" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 dark:text-gray-400 font-medium mb-2">該当する書籍が見つかりませんでした</p>
              <p class="text-gray-500 dark:text-gray-500 text-sm">検索条件を変更してお試しください</p>
            </div>
          </div>
        </div>

        <!-- View Full Ranking Button -->
        <div class="text-center mt-16">
          <NuxtLink 
            to="/ranking"
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <span>従来のページネーション版を見る</span>
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Categories
const categories = [
  { value: 'programming', label: 'プログラミング' },
  { value: 'web', label: 'Web開発' },
  { value: 'mobile', label: 'モバイル開発' },
  { value: 'ai', label: 'AI・機械学習' },
  { value: 'infrastructure', label: 'インフラ・DevOps' },
  { value: 'database', label: 'データベース' },
  { value: 'security', label: 'セキュリティ' },
  { value: 'design', label: 'デザイン・UI/UX' },
  { value: 'management', label: 'プロジェクト管理' },
  { value: 'career', label: 'キャリア・スキル' }
]

// 無限スクロール機能を使用
const infiniteScrollInstance = useInfiniteScroll({
  initialLimit: 24
})

// 分割代入で関数と状態を取得
const {
  state,
  filters,
  targetRef,
  fetchInitialData,
  fetchNextPage,
  setupIntersectionObserver,
  cleanupIntersectionObserver,
  books,
  loading,
  loadingMore,
  hasMore,
  currentPage,
  totalBooks,
  error,
  seoMeta
} = infiniteScrollInstance

// Mock data - in real app, this would come from API
const lastUpdate = ref(new Date())


// Computed properties
const formattedLastUpdate = computed(() => {
  return `最終更新: ${lastUpdate.value.toLocaleDateString('ja-JP')}`
})

// Define Book interface locally
interface Book {
  id: number
  title: string
  author: string
  mentionCount: number
  rating?: number
}

// Methods
const getRankBadgeClass = (rank: number): string => {
  if (rank <= 3) {
    return 'rank-gold'
  } else if (rank <= 10) {
    return 'rank-silver'
  } else {
    return 'rank-bronze'
  }
}

const viewBookDetails = (bookId: number) => {
  navigateTo(`/book/${bookId}`)
}

// SNS Share functions
const shareOnFacebook = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author} がQiitaで${book.mentionCount}回言及されています！`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author}\nQiitaで${book.mentionCount}回言及されている技術書です！\n⭐ 評価: ${book.rating}\n\n#技術書 #プログラミング #TechRankBooks`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
}

const openAmazonLink = (amazonUrl: string) => {
  window.open(amazonUrl, '_blank')
}

// ライフサイクル
onMounted(() => {
  console.log('🔧 Component mounted')
  console.log('📊 Initial state:', {
    hasMore: hasMore.value,
    loading: loading.value,
    currentPage: currentPage.value
  })
  
  // 初期データが未読み込みの場合は読み込む
  if (books.value.length === 0 && !loading.value) {
    console.log('📚 No books loaded, fetching initial data...')
    fetchInitialData()
  }
})

onBeforeUnmount(() => {
  cleanupIntersectionObserver()
})

// SEO対応
useHead(() => ({
  title: seoMeta.value.title,
  meta: [
    { 
      name: 'description', 
      content: seoMeta.value.description
    },
    {
      name: 'keywords',
      content: seoMeta.value.keywords
    }
  ]
}))
</script>

<!-- All styles now handled by Tailwind CSS in BookCard component -->