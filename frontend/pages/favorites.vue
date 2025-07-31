<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <!-- Header -->
    <SimpleHeader />
    
    <div class="container mx-auto px-6 py-8">
      <!-- Hero Section -->
      <div class="mb-12 text-center">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <Icon name="heroicons:heart-solid" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            お気に入り
          </h1>
        </div>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          あなたが選んだ技術書コレクション
        </p>
        
        <!-- Stats Banner -->
        <div class="inline-flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20 dark:border-gray-700/20">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ favoriteCount }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">冊のお気に入り</div>
          </div>
        </div>
      </div>

      <!-- Sort Controls -->
      <div v-if="favoriteBooks.length > 0" class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">並び順：</span>
          <div class="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              name="sort-by-added-at"
              @click="sortBy = 'addedAt'"
              :class="sortBy === 'addedAt' ? 'bg-pink-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200"
            >
              お気に入り順
            </button>
            <button
              name="sort-by-mentions"
              @click="sortBy = 'mentionCount'"
              :class="sortBy === 'mentionCount' ? 'bg-pink-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200"
            >
              言及数順
            </button>
          </div>
        </div>
        
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ favoriteBooks.length }}冊のお気に入り
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="favoriteBooks.length === 0" class="text-center py-20">
        <div class="relative mb-8">
          <div class="w-32 h-32 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center">
            <Icon name="heroicons:heart" class="w-16 h-16 text-pink-400 dark:text-pink-500" />
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span class="text-sm">📚</span>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          お気に入りを見つけよう！
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          気になる技術書を見つけて、あなただけのコレクションを作りましょう
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="navigateTo('/')"
            class="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            技術書を探す
          </button>
          <button 
            @click="navigateTo('/ranking')"
            class="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg"
          >
            ランキングを見る
          </button>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <div 
          v-for="book in sortedFavoriteBooks" 
          :key="book.id"
          class="break-inside-avoid group"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-pink-300 dark:hover:border-pink-700"
               @click="navigateTo(`/book/${book.id}`)"
          >
            <!-- Book Cover with Badge -->
            <div class="relative">
              <div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
                <img 
                  v-if="book.imageUrl"
                  :src="book.imageUrl" 
                  :alt="book.title"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <Icon name="heroicons:book-open" class="w-16 h-16 mb-2" />
                  <span class="text-xs text-center px-2">{{ Array.isArray(book.category) ? book.category[0] : book.category }}</span>
                </div>
                
                <!-- 人気度バッジ -->
                <div v-if="book.mentionCount >= 10" class="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  🔥 人気
                </div>
                
                <!-- 最近追加バッジ -->
                <div v-if="isRecentlyAdded(book.addedAt)" class="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✨ 新着
                </div>
              </div>
              
              <!-- お気に入り削除ボタン -->
              <button 
                @click.stop="removeFromFavorites(book.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 hover:rotate-90"
                title="お気に入りから削除"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4 transition-transform duration-300" />
              </button>
            </div>

            <!-- Book Info -->
            <div class="p-5">
              <!-- Title & Author -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">
                  {{ book.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ Array.isArray(book.author) ? book.author.join(', ') : book.author }}
                </p>
              </div>
              
              <!-- Category & Added Date -->
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-300 rounded-full">
                  {{ Array.isArray(book.category) ? book.category[0] : book.category }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {{ formatDate(book.addedAt) }}
                </span>
              </div>

              <!-- Good Book Score -->
              <div v-if="book.goodBookScore" class="mb-4">
                <div class="flex items-center gap-3">
                  <div class="relative w-12 h-12">
                    <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="3" fill="none" class="text-gray-200 dark:text-gray-600"/>
                      <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="3" fill="none"
                              :class="getScoreTextClass(book.goodBookScore)"
                              :stroke-dasharray="113"
                              :stroke-dashoffset="113 - (book.goodBookScore / 100) * 113"
                              stroke-linecap="round"
                              class="transition-all duration-1000"/>
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <span class="text-xs font-bold" :class="getScoreTextClass(book.goodBookScore)">
                        {{ Math.round(book.goodBookScore) }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">いい本スコア</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ getScoreLabel(book.goodBookScore) }}</div>
                  </div>
                </div>
              </div>

              <!-- Stats -->
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-1">
                  <Icon name="heroicons:fire" class="w-4 h-4 text-orange-500" />
                  <span>{{ book.mentionCount }}回言及</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="heroicons:heart-solid" class="w-4 h-4 text-pink-500" />
                  <span>{{ formatDate(book.addedAt) }}登録</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites'

// ルーターを使用
const $router = useRouter()

// SEO設定
useHead({
  title: 'お気に入り - Tech Book Rank',
  meta: [
    { name: 'description', content: 'お気に入りに追加した技術書の一覧です。あなただけの技術書コレクションを管理しましょう。' }
  ]
})

// お気に入りストアを使用
const favoritesStore = useFavoritesStore()

// ソート状態
const sortBy = ref<'addedAt' | 'mentionCount'>('addedAt')

// 初期化時にlocalStorageから読み込み
onMounted(() => {
  favoritesStore.loadFromLocalStorage()
})

// お気に入りデータを取得
const favoriteBooks = computed(() => favoritesStore.favoriteBooks)
const favoriteCount = computed(() => favoritesStore.favoriteCount)

// ソート済みお気に入り書籍
const sortedFavoriteBooks = computed(() => {
  const books = [...favoriteBooks.value]
  
  if (sortBy.value === 'addedAt') {
    return books.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  } else if (sortBy.value === 'mentionCount') {
    return books.sort((a, b) => b.mentionCount - a.mentionCount)
  }
  
  return books
})

// お気に入りから削除
const removeFromFavorites = (bookId: number) => {
  favoritesStore.removeFromFavorites(bookId)
}

// 最近追加されたかどうかを判定
const isRecentlyAdded = (addedAt: string): boolean => {
  const addedDate = new Date(addedAt)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays <= 7 // 7日以内なら新着
}

// 日付のフォーマット
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

// スコア表示用のヘルパー関数
const getScoreTextClass = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  if (score >= 60) return 'text-orange-500 dark:text-orange-400'
  return 'text-red-500 dark:text-red-400'
}

// スコアラベル
const getScoreLabel = (score: number): string => {
  if (score >= 90) return '殿堂入り'
  if (score >= 80) return '超おすすめ'
  if (score >= 70) return 'おすすめ'
  if (score >= 60) return '良書'
  if (score >= 40) return '普通'
  return '要検討'
}

// ナビゲーション関数
const navigateTo = (path: string) => {
  return $router.push(path)
}
</script>

