<template>
  <div 
    class="relative rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:border-cyan-500 dark:hover:border-cyan-400 flex flex-col min-h-[480px]"
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
              class="w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 focus:outline-none transition-transform duration-200 ease-out"
              :aria-label="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
            >
              <span class="relative w-4 h-4">
                <!-- 常にソリッドハートを表示し、色で状態を管理 -->
                <Icon 
                  name="heroicons:heart-solid"
                  :class="[
                    'w-4 h-4 favorite-heart-icon',
                    isFavorite 
                      ? 'text-red-500 fill-red-500 heart-filled' 
                      : 'text-gray-300 fill-gray-300 heart-empty'
                  ]"
                />
              </span>
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
      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
        {{ Array.isArray(book.author) ? book.author.join(', ') : book.author }}
      </p>

      <!-- Category Tag -->
      <div class="flex justify-center mb-3">
        <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
          {{ Array.isArray(book.category) ? book.category[0] : book.category }}
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
          @click="handleAmazonClick"
          class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
          <span>Amazon</span>
        </button>

        <!-- SNS Share Buttons -->
        <div class="flex space-x-2">
          <!-- Facebook Button -->
          <button 
            @click="handleFacebookShare"
            class="flex-1 flex items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            title="Facebookでシェア"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <!-- X (Twitter) Button -->
          <button 
            @click="handleTwitterShare"
            class="flex-1 flex items-center justify-center p-2.5 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            title="X(Twitter)でシェア"
          >
            <svg class="w-4 h-4  fill-current" viewBox="0 0 24 24">
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

const emit = defineEmits(['click', 'amazon-click', 'facebook-share', 'twitter-share'])

const props = defineProps<Props>()

// Event handlers
const handleAmazonClick = () => {
  emit('amazon-click', props.book.amazonUrl)
}

const handleFacebookShare = () => {
  emit('facebook-share', props.book)
}

const handleTwitterShare = () => {
  emit('twitter-share', props.book)
}

// お気に入りストアを使用
const favoritesStore = useFavoritesStore()

// ハイドレーション問題を回避するため、クライアントサイドでのみお気に入り状態を表示
const isClient = ref(false)
const isFavorite = computed(() => {
  if (!isClient.value) return false // SSR時は常にfalse
  return favoritesStore.isFavorite(props.book.id)
})

// クライアントサイドでマウント後に状態を更新
onMounted(() => {
  isClient.value = true
})

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

// カード背景色のクラスを計算（ダークモード対応・区別しやすい色）
const cardBackgroundClass = computed(() => {
  if (props.rank === 1) {
    return 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/40 border-yellow-300 dark:border-yellow-600/70' // 金色背景
  } else if (props.rank === 2) {
    return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-blue-900/60 dark:to-blue-800/50 border-slate-300 dark:border-blue-600/80' // シルバー背景（ダークモードでは青味のあるシルバー）
  } else if (props.rank === 3) {
    return 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/40 border-orange-300 dark:border-orange-600/70' // 銅色背景
  } else {
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' // 通常の白背景
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
    const categoryString = Array.isArray(props.book.category) ? props.book.category[0] : props.book.category
    target.src = generateLocalSVG(props.book.id, categoryString)
  } else {
    // 2回目のエラー時も画像を非表示にして代替表示
    imageError.value = true
    target.style.display = 'none'
  }
}

// ローカルでSVG画像を生成する関数
const generateLocalSVG = (bookId: number, category: string): string => {
  // カテゴリ表示名から内部キーへのマッピング関数
  const getCategoryKey = (category: string): string => {
    if (category === 'プログラミング') return 'programming'
    if (category === 'Web開発') return 'web_development'
    if (category === 'モバイル開発') return 'mobile_development'
    if (category === 'AI・機械学習') return 'ai_ml'
    if (category === 'インフラ・DevOps') return 'infrastructure'
    if (category === 'データベース') return 'database'
    if (category === 'セキュリティ') return 'security'
    if (category === 'デザイン・UI/UX') return 'design'
    return 'programming' // デフォルト
  }
  
  const categoryColors: Record<string, string> = {
    'programming': '#4f46e5',
    'web_development': '#059669',
    'mobile_development': '#dc2626',
    'ai_ml': '#7c3aed',
    'infrastructure': '#ea580c',
    'database': '#0891b2',
    'security': '#be123c',
    'design': '#c2410c'
  }
  
  const categoryKey = getCategoryKey(category)
  const color = categoryColors[categoryKey] || '#6b7280'
  const icons = ['📚', '📖', '📝', '💻', '⚡']
  const icon = icons[bookId % icons.length]
  
  // 日本語文字を含むカテゴリ名を英語に変換
  const categoryEn = getCategoryKey(category).replace('_', ' ')
  
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" style="fill:${color}"/>
      <text x="150" y="200" font-family="Arial" font-size="60" style="fill:white" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="150" y="280" font-family="Arial" font-size="16" style="fill:white" text-anchor="middle" dominant-baseline="middle">${categoryEn}</text>
    </svg>
  `
  
  // 現代的な方法でUTF-8文字列をBase64エンコード
  if (typeof window !== 'undefined' && 'TextEncoder' in window) {
    try {
      // Uint8Array から文字列への変換をより効率的に行う
      const encoder = new TextEncoder()
      const uint8Array = encoder.encode(svg)
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
      return `data:image/svg+xml;base64,${btoa(binaryString)}`
    } catch (error) {
      // フォールバック: URLエンコード版
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }
  } else {
    // SSR環境やTextEncoderが利用できない場合のフォールバック
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }
}
</script>

<style scoped>
/* お気に入りハートアイコンの塗りつぶしを確実に制御 */
:deep(svg) {
  fill: currentColor !important;
}

:deep(svg path) {
  fill: currentColor !important;
}

/* お気に入り状態のハートアイコンを確実に赤色で塗りつぶし */
.heart-filled :deep(svg) {
  color: #ef4444 !important;
  fill: #ef4444 !important;
}

.heart-filled :deep(svg path) {
  fill: #ef4444 !important;
  stroke: #ef4444 !important;
}

.heart-empty :deep(svg) {
  color: #d1d5db !important;
  fill: #d1d5db !important;
}

.heart-empty :deep(svg path) {
  fill: #d1d5db !important;
  stroke: #d1d5db !important;
}

/* より具体的なセレクター */
.favorite-heart-icon.text-red-500 :deep(svg) {
  color: #ef4444 !important;
  fill: #ef4444 !important;
}

.favorite-heart-icon.text-red-500 :deep(svg path) {
  fill: #ef4444 !important;
  stroke: #ef4444 !important;
}

.favorite-heart-icon.fill-red-500 :deep(svg) {
  fill: #ef4444 !important;
}

.favorite-heart-icon.fill-red-500 :deep(svg path) {
  fill: #ef4444 !important;
}
</style>

