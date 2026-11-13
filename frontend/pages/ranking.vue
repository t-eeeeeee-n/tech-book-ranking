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
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
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
              <label for="category-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                カテゴリ
              </label>
              <select 
                id="category-filter"
                name="category"
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
              <label for="period-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                期間
              </label>
              <select 
                id="period-filter"
                name="period"
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
              <label for="book-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                検索
              </label>
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="book-search"
                  name="search"
                  v-model="filters.search"
                  type="text"
                  placeholder="書籍名・著者名で検索"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Sort -->
            <div>
              <label for="sort-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                並び順
              </label>
              <select 
                id="sort-filter"
                name="sort"
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="n in 24" :key="n" class="animate-pulse">
              <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p class="text-red-600 dark:text-red-400 font-medium mb-2">エラーが発生しました</p>
            <p class="text-red-500 dark:text-red-300 text-sm mb-4">{{ error }}</p>
            <button 
              name="retry-data-fetch"
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

          <!-- Intersection Observer Target -->
          <div 
            ref="targetRef" 
            class="h-20 flex items-center justify-center"
            v-if="hasMore"
          >
          </div>

          <!-- Loading More -->
          <div v-if="loadingMore" class="mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div v-for="n in 8" :key="n" class="animate-pulse">
                <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
              </div>
            </div>
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

<script setup lang="ts">
// Import statements
import type { Book, CategoryOption, ExtendedHTMLElement } from '~/types'

// Manual component import to fix auto-import issue with hyphenated names
import BookCard from '~/components/BookCard.vue'

// Data and state management
const categories = ref<CategoryOption[]>([])
const categoriesLoading = ref(true)
const books = ref<Book[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const totalBooks = ref(4000)
const error = ref<string | null>(null)
const targetRef = ref<HTMLElement | null>(null)

// Filters
const filters = reactive({
  category: '',
  period: 'all',
  search: '',
  sort: 'mentions'
})

// SEO meta
const seoMeta = computed(() => ({
  title: '技術書ランキング - TechRank Books',
  description: 'Qiita記事で言及された技術書のランキング',
  keywords: '技術書,プログラミング,ランキング,Qiita'
}))

// API functions
const fetchCategories = async () => {
  try {
    categoriesLoading.value = true
    const response = await $fetch('/api/categories') as { success: boolean; data: CategoryOption[] }
    if (response.success) {
      categories.value = response.data
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  } finally {
    categoriesLoading.value = false
  }
}

const fetchInitialData = async () => {
  try {
    loading.value = true
    error.value = null
    currentPage.value = 1
    
    const response = await $fetch('/api/books', {
      query: {
        page: 1,
        limit: 24,
        category: filters.category || undefined,
        period: filters.period !== 'all' ? filters.period : undefined,
        search: filters.search || undefined,
        sort: filters.sort
      }
    }) as { success: boolean; data: Book[]; pagination: { hasMore: boolean }; meta: { totalBooks: number } }

    if (response.success) {
      books.value = response.data
      hasMore.value = response.pagination.hasMore
      totalBooks.value = response.meta.totalBooks
    }
  } catch (err) {
    error.value = 'データの取得に失敗しました'
  } finally {
    loading.value = false
  }
}

const fetchNextPage = async () => {
  if (loadingMore.value || !hasMore.value) return
  
  try {
    loadingMore.value = true
    const nextPage = currentPage.value + 1
    
    const response = await $fetch('/api/books', {
      query: {
        page: nextPage,
        limit: 24,
        category: filters.category || undefined,
        period: filters.period !== 'all' ? filters.period : undefined,
        search: filters.search || undefined,
        sort: filters.sort
      }
    }) as { success: boolean; data: Book[]; pagination: { hasMore: boolean }; meta: { totalBooks: number } }

    if (response.success) {
      books.value.push(...response.data)
      hasMore.value = response.pagination.hasMore
      currentPage.value = nextPage
    }
  } catch (err) {
    error.value = 'データの取得に失敗しました'
  } finally {
    loadingMore.value = false
  }
}

const setupIntersectionObserver = () => {
  if (!targetRef.value) {
    return
  }
  
  const observer = new IntersectionObserver((entries) => {
    const target = entries[0]

    if (target?.isIntersecting && hasMore.value && !loadingMore.value) {
      fetchNextPage()
    }
  }, { 
    threshold: 0.1,
    rootMargin: '100px' // Trigger a bit earlier
  })
  
  observer.observe(targetRef.value)
  
  // Store observer for cleanup
  ;(targetRef.value as ExtendedHTMLElement).__observer = observer
}

const cleanupIntersectionObserver = () => {
  const element = targetRef.value as ExtendedHTMLElement | null
  if (element && element.__observer) {
    element.__observer.disconnect()
  }
}

// Data
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
const viewBookDetails = (bookId: number) => {
  // 現在のフィルター状態をクエリパラメータとして渡す
  const query: Record<string, string> = {}
  
  if (filters.category && filters.category !== '') {
    query.category = filters.category
  }
  if (filters.period && filters.period !== 'all') {
    query.period = filters.period
  }
  if (filters.search && filters.search !== '') {
    query.search = filters.search
  }
  
  navigateTo({
    path: `/book/${bookId}`,
    query: Object.keys(query).length > 0 ? query : undefined
  })
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

// Watch for filter changes
watch(filters, () => {
  cleanupIntersectionObserver()
  fetchInitialData().then(() => {
    nextTick(() => {
      setupIntersectionObserver()
    })
  })
}, { deep: true })

// ライフサイクル
onMounted(() => {
  // URLクエリパラメータからフィルタを取得
  const route = useRoute()
  if (route.query.search) {
    filters.search = route.query.search as string
  }
  if (route.query.category) {
    filters.category = route.query.category as string
  }
  if (route.query.period) {
    filters.period = route.query.period as string
  }
  if (route.query.sort) {
    filters.sort = route.query.sort as string
  }
  
  // カテゴリと初期データを並行して読み込み
  fetchCategories()
  
  // URLパラメータ設定後に初期データを読み込み
  nextTick(() => {
    fetchInitialData().then(() => {
      // データ読み込み後にIntersection observer をセットアップ
      nextTick(() => {
        setupIntersectionObserver()
      })
    })
  })
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
    },
    {
      property: 'og:title',
      content: seoMeta.value.title
    },
    {
      property: 'og:description',
      content: seoMeta.value.description
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
}))

// Client-side structured data
onMounted(() => {
  if (import.meta.client) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "技術書ランキング",
      "description": "Qiita記事で言及された技術書のランキング（無限スクロール版）",
      "url": `${window.location.origin}/ranking`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalBooks.value,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": books.value.map((book, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Book",
            "name": book.title,
            "author": book.author,
            "aggregateRating": book.rating ? {
              "@type": "AggregateRating",
              "ratingValue": book.rating,
              "ratingCount": book.mentionCount
            } : undefined
          }
        }))
      }
    }

    // Add a structured data script to head
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Add canonical and alternate links
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${window.location.origin}/ranking`
    document.head.appendChild(canonical)

    const alternate = document.createElement('link')
    alternate.rel = 'alternate'
    alternate.href = `${window.location.origin}/ranking/page/1`
    alternate.title = 'ページネーション版'
    document.head.appendChild(alternate)
  }
})
</script>

