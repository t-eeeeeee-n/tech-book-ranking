<template>
  <div class="min-h-screen">
    <!-- Header -->
    <SimpleHeader />
    
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div class="container mx-auto px-6">
        <!-- Page Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🏆 技術書
            <span class="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              完全ランキング
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Qiita記事で言及された
            <span class="font-semibold text-blue-600">{{ totalBooks.toLocaleString() }}冊</span>
            の技術書から、実際に参考にされている書籍をランキング形式でご紹介
          </p>
          
          <!-- Progress Stats -->
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:book-open" class="w-4 h-4 text-blue-600" />
              <span>{{ startRank }}〜{{ endRank }}位表示中</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:chart-bar" class="w-4 h-4 text-green-600" />
              <span>{{ totalBooks }}冊該当</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:clock" class="w-4 h-4 text-purple-600" />
              <span>{{ formattedLastUpdate }}</span>
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
      </div>
    </section>

    <!-- Ranking List Section -->
    <section class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-6">
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

      </div>
    </section>

  </div>
</template>

<script setup>
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
const startRank = computed(() => {
  return books.value.length > 0 ? 1 : 0
})

const endRank = computed(() => {
  return books.value.length
})

const formattedLastUpdate = computed(() => {
  return `最終更新: ${lastUpdate.value.toLocaleDateString('ja-JP')}`
})

// Methods
const viewBookDetails = (bookId) => {
  navigateTo(`/book/${bookId}`)
}

// SNS Share functions
const shareOnFacebook = (book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author} がQiitaで${book.mentionCount}回言及されています！`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = (book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author}\nQiitaで${book.mentionCount}回言及されている技術書です！\n⭐ 評価: ${book.rating}\n\n#技術書 #プログラミング #TechRankBooks`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
}

const openAmazonLink = (amazonUrl) => {
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

<style scoped>
/* Book card styles are now handled by the BookCard component with Tailwind CSS */

/* 2025 Minimal Pagination Styles */
.minimal-pagination {
  /* Vercel-inspired clean container */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(229, 229, 229);
  border-radius: 12px;
  padding: 20px;
  margin-top: 32px;
  
  /* Subtle shadow for depth */
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

/* Main Controls - Linear/Raycast inspired */
.pagination-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  /* Clean button design */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgb(229, 229, 229);
  border-radius: 6px;
  background: white;
  color: rgb(107, 114, 128);
  
  /* Smooth transitions */
  transition: all 0.15s ease;
  
  /* Focus for accessibility */
  cursor: pointer;
}

.nav-btn:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

.nav-btn:hover:not(.disabled) {
  border-color: rgb(156, 163, 175);
  color: rgb(17, 24, 39);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: rgb(243, 244, 246);
  color: rgb(156, 163, 175);
}

/* Page Status - Minimal typography */
.page-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ui-monospace, Monaco, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgb(75, 85, 99);
  padding: 6px 12px;
  background: rgb(249, 250, 251);
  border-radius: 6px;
  border: 1px solid rgb(243, 244, 246);
  min-width: 120px;
  justify-content: center;
}

.status-text {
  color: rgb(17, 24, 39);
  font-weight: 600;
}

.status-divider {
  color: rgb(156, 163, 175);
  margin: 0 2px;
}

.status-total {
  color: rgb(107, 114, 128);
}

/* Progress - Minimal track */
.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  max-width: 280px;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 2px;
  background: rgb(229, 231, 235);
  border-radius: 1px;
  overflow: hidden;
}

.progress-thumb {
  position: absolute;
  top: -3px;
  width: 8px;
  height: 8px;
  background: rgb(59, 130, 246);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 0 2px white, 0 2px 4px rgba(59, 130, 246, 0.3);
}

.progress-hint {
  font-size: 12px;
  color: rgb(107, 114, 128);
  font-weight: 500;
}

/* Quick Navigation - Desktop only */
.quick-nav {
  display: none;
  gap: 4px;
  padding: 4px;
  background: rgb(249, 250, 251);
  border: 1px solid rgb(229, 231, 235);
  border-radius: 8px;
}

@media (min-width: 768px) {
  .quick-nav {
    display: flex;
  }
}

.quick-btn {
  min-width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgb(107, 114, 128);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-btn:hover:not(.dots) {
  background: white;
  color: rgb(17, 24, 39);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.quick-btn.active {
  background: rgb(59, 130, 246);
  color: white;
  font-weight: 600;
}

.quick-btn.dots {
  cursor: default;
  color: rgb(156, 163, 175);
}

/* Jump Section - Collapsible */
.jump-section {
  position: relative;
}

.jump-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(107, 114, 128);
  background: transparent;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  list-style: none;
}

.jump-toggle::-webkit-details-marker {
  display: none;
}

.jump-toggle:hover {
  border-color: rgb(156, 163, 175);
  color: rgb(17, 24, 39);
}

.jump-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 4px;
  display: flex;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.jump-input {
  width: 48px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: rgb(17, 24, 39);
  transition: all 0.15s ease;
}

.jump-input:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.jump-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: rgb(59, 130, 246);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.jump-btn:hover {
  background: rgb(37, 99, 235);
  transform: translateY(-1px);
}

/* Dark Mode - 2025 Minimal Style */
.dark .minimal-pagination {
  background: rgba(31, 41, 59, 0.8);
  border-color: rgb(75, 85, 99);
}

.dark .nav-btn {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .nav-btn:hover:not(.disabled) {
  border-color: rgb(107, 114, 128);
  color: rgb(229, 231, 235);
  background: rgb(75, 85, 99);
}

.dark .nav-btn.disabled {
  background: rgb(31, 41, 59);
  border-color: rgb(55, 65, 81);
  color: rgb(75, 85, 99);
}

.dark .page-status {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .status-text {
  color: rgb(229, 231, 235);
}

.dark .status-divider {
  color: rgb(107, 114, 128);
}

.dark .status-total {
  color: rgb(156, 163, 175);
}

.dark .progress-track {
  background: rgb(75, 85, 99);
}

.dark .progress-thumb {
  background: rgb(96, 165, 250);
  box-shadow: 0 0 0 2px rgb(31, 41, 59), 0 2px 4px rgba(96, 165, 250, 0.3);
}

.dark .progress-hint {
  color: rgb(156, 163, 175);
}

.dark .quick-nav {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
}

.dark .quick-btn {
  color: rgb(156, 163, 175);
}

.dark .quick-btn:hover:not(.dots) {
  background: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.dark .quick-btn.active {
  background: rgb(96, 165, 250);
  color: rgb(17, 24, 39);
}

.dark .jump-toggle {
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .jump-toggle:hover {
  border-color: rgb(107, 114, 128);
  color: rgb(229, 231, 235);
}

.dark .jump-content {
  background: rgb(31, 41, 59);
  border-color: rgb(75, 85, 99);
}

.dark .jump-input {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.dark .jump-input:focus {
  border-color: rgb(96, 165, 250);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.dark .jump-btn {
  background: rgb(96, 165, 250);
}

.dark .jump-btn:hover {
  background: rgb(59, 130, 246);
}

/* Mobile-First Responsive Design */
@media (max-width: 768px) {
  .minimal-pagination {
    padding: 16px;
    gap: 12px;
  }
  
  .pagination-main {
    gap: 8px;
  }
  
  .page-status {
    min-width: 100px;
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .progress-wrapper {
    max-width: 240px;
  }
  
  .quick-nav {
    display: none; /* Hide on mobile for simplicity */
  }
  
  .jump-section {
    font-size: 11px;
  }
  
  .jump-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0;
    padding: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 480px) {
  .minimal-pagination {
    padding: 12px;
    gap: 8px;
  }
  
  .nav-btn {
    width: 28px;
    height: 28px;
  }
  
  .page-status {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .progress-wrapper {
    max-width: 200px;
  }
  
  .progress-hint {
    font-size: 10px;
  }
}

/* Touch-friendly enhancements */
@media (pointer: coarse) {
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .quick-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .jump-btn {
    width: 32px;
    height: 32px;
  }
}

/* Responsive Design */
@media (max-width: 1280px) {
  .ranking-card {
    padding: 1rem;
  }
  
  .book-cover {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .book-cover {
    height: 160px;
  }
  
  .book-title {
    font-size: 0.85rem;
  }
  
  .book-author {
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .ranking-card {
    padding: 1rem;
  }
  
  .book-cover {
    height: 200px;
  }
}
</style>