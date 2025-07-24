<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50/50 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 opacity-30 bg-gradient-to-br from-cyan-400/30 via-transparent to-amber-400/30 animate-pulse"></div>
      <div class="absolute inset-0">
        <div v-for="i in 6" :key="i" class="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-bounce" :style="getFloatingElementStyle(i)"></div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="relative z-10 w-full py-20">
      <div class="container mx-auto px-6 relative z-10">
        <!-- Announcement Banner -->
        <div class="flex justify-center mb-12">
          <div class="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-600/20 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div class="w-4 h-4 text-cyan-500">
              <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">2025年版 最新技術書ランキング公開中</span>
            <div class="w-3.5 h-3.5 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" class="fill-none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Main Heading -->
        <div class="text-center mb-16">
          <h1 class="mb-8">
            <span class="block text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">エンジニアが選ぶ</span>
            <span class="block text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">技術書ランキング</span>
            <span class="block text-3xl md:text-5xl lg:text-6xl font-light text-gray-600 dark:text-gray-400 tracking-wider">2025</span>
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            実際の開発現場で参考にされている技術書を発見。
            <span class="font-semibold text-cyan-500">{{ props.totalBooks.toLocaleString() }}冊以上</span>
            の技術書から、信頼できるランキングを提供
          </p>
        </div>

        <!-- Interactive Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div 
            v-for="(stat, index) in statsData" 
            :key="stat.label"
            class="relative p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-600/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
            :style="{ 'animation-delay': `${index * 150}ms` }"
          >
            <div class="relative w-12 h-12 mx-auto mb-4">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
              <div v-html="stat.icon" class="relative z-10 w-full h-full flex items-center justify-center text-cyan-500"></div>
            </div>
            <div class="text-center mb-2">
              <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-transform duration-300">{{ stat.value }}</div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
            </div>
            <div v-if="stat.trend" class="flex items-center justify-center gap-1 text-xs font-medium text-green-600">
              <svg width="12" height="12" viewBox="0 0 24 24" class="fill-none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ stat.trend }}</span>
            </div>
          </div>
        </div>

        <!-- Search CTA -->
        <div class="mb-16">
          <div class="max-w-2xl mx-auto">
            <div class="relative flex items-center mb-6">
              <div class="absolute left-4 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <input
                id="hero-search"
                name="heroSearch"
                aria-label="技術書、著者、キーワードを検索"
                v-model="searchQuery"
                type="text"
                placeholder="JavaScript、Python、React... で検索"
                class="w-full pl-14 pr-32 py-4 text-lg bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-white/20 dark:border-slate-600/20 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                @keydown.enter="performSearch"
              />
              <button name="hero-search-submit" @click="performSearch" class="absolute right-2 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <span class="hidden sm:inline">検索</span>
                <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <!-- Quick Categories -->
            <div class="flex flex-wrap items-center justify-center gap-3">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">人気カテゴリ:</span>
              <button
                v-for="category in quickCategories"
                :key="category.value"
                name="quick-category"
                @click="searchCategory(category.value)"
                class="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-600/20 rounded-lg transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-500 hover:-translate-y-0.5"
              >
                <span class="text-lg">{{ category.icon }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ category.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Feature Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div 
            v-for="(feature, index) in features"
            :key="feature.title"
            class="p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-600/20 transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
            :style="{ 'animation-delay': `${(index + 3) * 100}ms` }"
          >
            <div class="w-10 h-10 mb-4 flex items-center justify-center rounded-xl bg-cyan-500/10">
              <div v-html="feature.icon" class="text-cyan-500"></div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>


      <!-- Scroll Indicator -->
      <div class="pt-10 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
        <div class="text-sm font-medium">ランキングを見る</div>
        <div class="animate-pulse">
          <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  totalBooks: {
    type: Number,
    default: 4000
  },
  totalCategories: {
    type: Number,
    default: 12
  },
  updateFrequency: {
    type: String,
    default: '毎日'
  }
})

// State
const searchQuery = ref('')

// Data
const statsData = computed(() => [
  {
    value: `${props.totalBooks.toLocaleString()}+`,
    label: '技術書を収録',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2"/><path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" stroke-width="2"/></svg>',
    trend: '+24%'
  },
  {
    value: props.updateFrequency,
    label: 'データ更新',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-none"><path d="M3 12A9 9 0 0 1 12 3A9 9 0 0 1 21 12A9 9 0 0 1 12 21" stroke="currentColor" stroke-width="2"/><path d="M12 7V12L16 14" stroke="currentColor" stroke-width="2"/></svg>',
    trend: null
  },
  {
    value: `${props.totalCategories}`,
    label: '専門カテゴリ',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/></svg>',
    trend: '+2'
  },
  {
    value: '信頼できる',
    label: 'ランキング',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" class="fill-none"><path d="M9 12L11 14L15 10M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z" stroke="currentColor" stroke-width="2"/></svg>',
    trend: null
  }
])

const quickCategories = [
  { value: 'programming', label: 'プログラミング', icon: '💻' },
  { value: 'web-development', label: 'Web開発', icon: '🌐' },
  { value: 'ai-machine-learning', label: 'AI・ML', icon: '🤖' },
  { value: 'infrastructure', label: 'インフラ', icon: '☁️' }
]

const features = [
  {
    title: 'リアルタイム分析',
    description: 'Qiita記事の言及データを毎日分析して最新のトレンドを反映',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" class="fill-none"><path d="M3 3V21L9 18L15 21L21 18V6L15 9L9 6L3 3Z" stroke="currentColor" stroke-width="2"/></svg>'
  },
  {
    title: '実証済みの品質',
    description: '実際の開発現場で参考にされている技術書のみをランキング',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" class="fill-none"><path d="M9 12L11 14L15 10M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z" stroke="currentColor" stroke-width="2"/></svg>'
  },
  {
    title: '詳細な分析',
    description: 'カテゴリ別、トレンド分析、関連記事まで包括的に提供',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" class="fill-none"><path d="M3 3V21H21V3H3Z" stroke="currentColor" stroke-width="2"/><path d="M7 12H17M7 8H17M7 16H17" stroke="currentColor" stroke-width="2"/></svg>'
  }
]

// Methods
const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const searchCategory = (category: string) => {
  navigateTo(`/ranking?category=${category}`)
}

const getFloatingElementStyle = (index: number) => {
  const positions = [
    { top: '10%', left: '10%', animationDelay: '0s' },
    { top: '20%', right: '15%', animationDelay: '2s' },
    { top: '60%', left: '5%', animationDelay: '4s' },
    { bottom: '30%', right: '10%', animationDelay: '1s' },
    { bottom: '10%', left: '20%', animationDelay: '3s' },
    { top: '40%', right: '25%', animationDelay: '5s' }
  ]
  
  return positions[index - 1] || positions[0]
}

// SEO
useHead({
  title: '技術書ランキング 2025 - TechRank Books',
  meta: [
    { 
      name: 'description', 
      content: 'エンジニアが実際に参考にしている技術書のランキング 2025年版。Qiita記事での言及数をもとに、信頼できる技術書を発見できます。' 
    }
  ]
})
</script>

