<template>
  <div 
    class="relative rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl border dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:border-cyan-500 dark:hover:border-cyan-400 flex flex-col min-h-[480px]"
    :class="cardBackgroundClass"
    @click="$emit('click', book.id)"
  >
    <!-- Rank Badge -->
    <div 
      class="absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white z-10 shadow-lg"
      :class="rankBadgeClass"
    >
      <span v-if="rank <= 3" class="text-lg">{{ rank }}</span>
      <span v-else class="text-xs">{{ rank }}</span>
    </div>

    <!-- Special Crown for 1st place -->
    <div v-if="rank === 1" class="absolute -top-3 -right-2 text-yellow-500 z-10">
      <div class="text-lg">👑</div>
    </div>

    <!-- Book Cover -->
    <div class="relative w-full h-48 sm:h-52 md:h-56 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
      <!-- 画像エラー時の代替表示 -->
      <div v-if="imageError" class="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <Icon name="heroicons:photo" class="w-16 h-16 mb-2" />
        <span class="text-xs text-center px-2">{{ book.category }}</span>
      </div>
      
      <!-- 通常の画像表示 -->
      <img 
        v-else
        :src="book.imageUrl" 
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Overlay on hover -->
      <div v-if="!imageError" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Icon name="heroicons:eye" class="w-6 h-6 text-white" />
      </div>
    </div>

    <!-- Book Info -->
    <div class="text-center flex flex-col flex-grow">
      <!-- Title with Heart Icon - Fixed Height with proper line clamping -->
      <div class="mb-3 h-12 flex items-center justify-center">
        <div class="flex items-center space-x-2">
          <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight text-center">
            {{ book.title }}
          </h3>
          <!-- お気に入りボタン - タイトル右隣にインライン配置 -->
          <div @click.stop>
            <button 
              @click="toggleFavorite"
              class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
              :class="isFavorite ? 
                'text-red-500 hover:text-red-600' : 
                'text-gray-400 hover:text-red-500'"
              :aria-label="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
            >
              <Icon 
                :name="isFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'" 
                class="w-4 h-4 transition-all duration-200"
              />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Good Book Score (if available) -->
      <div 
        v-if="book.goodBookScore !== undefined" 
        class="text-xs mb-2 font-medium text-gray-700 dark:text-gray-300"
      >
        📊 いい本スコア: 
        <span class="font-bold" :class="getScoreTextClass(book.goodBookScore)">{{ Math.round(book.goodBookScore) }}</span>
      </div>

      <!-- Author -->
      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
        {{ book.author }}
      </p>

      <!-- Category Tag -->
      <div class="flex justify-center mb-3">
        <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
          {{ book.category }}
        </span>
      </div>

      <!-- Spacer to push content to bottom -->
      <div class="flex-grow"></div>

      <!-- Stats -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center justify-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
          <Icon name="heroicons:fire" class="w-4 h-4 text-orange-500" />
          <span>{{ book.mentionCount }}回言及</span>
        </div>
        
        <!-- Fallback Rating (if no good book score) -->
        <div v-if="book.goodBookScore === undefined" class="flex items-center justify-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
          <Icon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
          <span>{{ book.rating || 'N/A' }}</span>
        </div>
      </div>

      <!-- Action Buttons - Always at bottom -->
      <div class="space-y-3 mt-auto" @click.stop>
        <!-- Amazon Button -->
        <button 
          @click="$emit('amazon-click', book.amazonUrl)"
          class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
          <span>Amazon</span>
        </button>

        <!-- SNS Share Buttons -->
        <div class="flex space-x-2">
          <!-- Facebook Button -->
          <button 
            @click="$emit('facebook-share', book)"
            class="flex-1 flex items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            title="Facebookでシェア"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <!-- X (Twitter) Button -->
          <button 
            @click="$emit('twitter-share', book)"
            class="flex-1 flex items-center justify-center p-2.5 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            title="X(Twitter)でシェア"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import { useFavoritesStore } from '~/stores/favorites'

interface Props {
  book: Book
  rank: number
}

interface Emits {
  (e: 'click', bookId: number): void
  (e: 'amazon-click', amazonUrl: string): void
  (e: 'facebook-share', book: Book): void
  (e: 'twitter-share', book: Book): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// お気に入りストアを使用
const favoritesStore = useFavoritesStore()

// お気に入り状態を計算
const isFavorite = computed(() => favoritesStore.isFavorite(props.book.id))

// お気に入りの切り替え
const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.book)
  
  // 簡単なフィードバック効果
  if (typeof window !== 'undefined') {
    // ハートアニメーション用の一時的なクラス追加
    const button = document.activeElement as HTMLElement
    if (button) {
      button.classList.add('animate-pulse')
      setTimeout(() => {
        button.classList.remove('animate-pulse')
      }, 1000)
    }
  }
}

// ランクバッジのクラスを計算
const rankBadgeClass = computed(() => {
  if (props.rank === 1) {
    return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 text-shadow-lg' // 金メダル
  } else if (props.rank === 2) {
    return 'bg-gradient-to-br from-gray-300 to-gray-600 border-4 border-gray-200 text-shadow-lg' // 銀メダル
  } else if (props.rank === 3) {
    return 'bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-orange-300 text-shadow-lg' // 銅メダル
  } else {
    return 'bg-gradient-to-br from-blue-500 to-blue-600' // その他
  }
})

// カード背景色のクラスを計算
const cardBackgroundClass = computed(() => {
  if (props.rank === 1) {
    return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' // 金色背景
  } else if (props.rank === 2) {
    return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' // 銀色背景
  } else if (props.rank === 3) {
    return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' // 銅色背景
  } else {
    return 'bg-white border-gray-200' // 白背景
  }
})


// スコア表示用のヘルパー関数
const getScoreTextClass = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  if (score >= 60) return 'text-orange-500 dark:text-orange-400'
  return 'text-red-500 dark:text-red-400'
}



// 画像エラーハンドリング
const imageError = ref(false)
const fallbackImageUsed = ref(false)

// 書籍が変わった時に状態をリセット
watch(() => props.book.id, () => {
  imageError.value = false
  fallbackImageUsed.value = false
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  
  if (!fallbackImageUsed.value) {
    // 最初のエラー時は完全にローカルなSVG画像を使用
    fallbackImageUsed.value = true
    const localSvg = generateLocalSVG(props.book.id, props.book.category)
    target.src = localSvg
  } else {
    // 2回目のエラー時も画像を非表示にして代替表示
    imageError.value = true
    target.style.display = 'none'
  }
}

// ローカルでSVG画像を生成する関数
const generateLocalSVG = (bookId: number, category: string): string => {
  const categoryColors = {
    'プログラミング': '#4f46e5',
    'Web開発': '#059669', 
    'モバイル開発': '#dc2626',
    'AI・機械学習': '#7c3aed',
    'インフラ・DevOps': '#ea580c',
    'データベース': '#0891b2',
    'セキュリティ': '#be123c',
    'デザイン・UI/UX': '#c2410c'
  }
  
  const color = categoryColors[category] || '#6b7280'
  const icons = ['📚', '📖', '📝', '💻', '⚡']
  const icon = icons[bookId % icons.length]
  
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="${color}"/>
      <text x="150" y="200" font-family="Arial" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="150" y="280" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${category}</text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
</script>

<style scoped>
/* Tailwind CSSのみを使用するため、カスタムCSSは最小限 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>