<template>
  <header class="sticky top-0 z-50 border-b border-white/20 shadow-sm transition-all duration-300 ease-out bg-white/95 backdrop-blur-2xl">
    <!-- Main Header -->
    <div class="relative">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Enhanced Logo Section -->
          <NuxtLink to="/" class="flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-0.5 group">
            <div class="flex items-center gap-3">
              <!-- Dynamic Logo Icon -->
              <div class="relative w-12 h-12 flex items-center justify-center">
                <div class="absolute inset-0 rounded-xl shadow-md transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-105 bg-gradient-to-br from-cyan-400 to-blue-600"></div>
                <div class="relative z-10 text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" class="fill-none drop-shadow-sm">
                    <path d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 6H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 10H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 14H12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
              
              <!-- Brand Text -->
              <div class="hidden sm:block">
                <h1 class="text-xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">TechRank</h1>
                <p class="text-sm text-gray-500 font-medium tracking-wide">Books</p>
              </div>
            </div>
          </NuxtLink>

          <!-- Enhanced Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-1">
              <NuxtLink 
                to="/ranking"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-500/10 text-gray-700 hover:text-cyan-500"
                :class="{ 'bg-cyan-500/15 text-cyan-500': $route.path === '/ranking' }"
              >
                <div class="text-gray-600 transition-colors duration-300 ease-out" :class="{ 'text-cyan-500': $route.path === '/ranking' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium transition-colors duration-300 ease-out">ランキング</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/categories"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-500/10 text-gray-700 hover:text-cyan-500"
                :class="{ 'bg-cyan-500/15 text-cyan-500': $route.path === '/categories' }"
              >
                <div class="text-gray-600 transition-colors duration-300 ease-out" :class="{ 'text-cyan-500': $route.path === '/categories' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium transition-colors duration-300 ease-out">カテゴリ</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/trending"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-500/10 text-gray-700 hover:text-cyan-500"
                :class="{ 'bg-cyan-500/15 text-cyan-500': $route.path === '/trending' }"
              >
                <div class="text-gray-600 transition-colors duration-300 ease-out" :class="{ 'text-cyan-500': $route.path === '/trending' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium transition-colors duration-300 ease-out">トレンド</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/favorites"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-cyan-500/10 text-gray-700 hover:text-cyan-500"
                :class="{ 'bg-cyan-500/15 text-cyan-500': $route.path === '/favorites' }"
              >
                <div class="text-gray-600 transition-colors duration-300 ease-out" :class="{ 'text-cyan-500': $route.path === '/favorites' }">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium transition-colors duration-300 ease-out">お気に入り</span>
                <span v-if="favoriteCount > 0" class="min-w-4 h-4 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-medium px-1 ml-1 shadow-sm relative transition-transform hover:scale-110">{{ favoriteCount }}</span>
              </NuxtLink>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <!-- Search Toggle -->
              <button
                @click="toggleSearch"
                class="relative p-2.5 rounded-lg border border-white/30 bg-white/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-500"
                :class="{ 'bg-cyan-500/15 border-cyan-500 text-cyan-500': searchOpen }"
                aria-label="検索を開く"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" class="fill-none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <!-- Theme Toggle -->
              <button
                @click="toggleTheme"
                class="relative p-2.5 rounded-lg border border-white/30 bg-white/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-500 hover:rotate-180"
                :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
              >
                <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" class="theme-icon fill-none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" class="theme-icon fill-none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <!-- Status Indicator -->
              <div class="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium hidden lg:inline">更新中</span>
              </div>
            </div>
          </nav>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="p-2 rounded-lg border border-white/30 bg-white/80 transition-all duration-300 ease-out w-6 h-6 flex flex-col justify-center gap-1 md:hidden dark:bg-slate-800/80 dark:border-slate-600/30"
            :aria-label="mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'"
          >
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-full" :class="{ 'rotate-45 translate-x-1 translate-y-1': mobileMenuOpen }"></span>
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-3/4" :class="{ 'opacity-0': mobileMenuOpen }"></span>
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-full" :class="{ '-rotate-45 translate-x-1 -translate-y-1': mobileMenuOpen }"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-end p-4 pt-20">
        <div class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300" :class="{ 'translate-x-0': mobileMenuOpen, 'translate-x-full': !mobileMenuOpen }">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">メニュー</h3>
            </div>
            <button @click="toggleMobileMenu" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" class="fill-none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <div class="p-4">
            <!-- Navigation Links -->
            <nav class="flex flex-col gap-2 mb-6">
              <NuxtLink 
                to="/"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20': $route.path === '/' }"
                @click="toggleMobileMenu"
              >
                <div class="text-gray-500 dark:text-gray-400" :class="{ 'text-cyan-500': $route.path === '/' }">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                    <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-base font-medium">ホーム</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/ranking"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20': $route.path === '/ranking' }"
                @click="toggleMobileMenu"
              >
                <div class="text-gray-500 dark:text-gray-400" :class="{ 'text-cyan-500': $route.path === '/ranking' }">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-base font-medium">ランキング</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/categories"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20': $route.path === '/categories' }"
                @click="toggleMobileMenu"
              >
                <div class="text-gray-500 dark:text-gray-400" :class="{ 'text-cyan-500': $route.path === '/categories' }">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-base font-medium">カテゴリ</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/trending"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20': $route.path === '/trending' }"
                @click="toggleMobileMenu"
              >
                <div class="text-gray-500 dark:text-gray-400" :class="{ 'text-cyan-500': $route.path === '/trending' }">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-base font-medium">トレンド</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/favorites"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20': $route.path === '/favorites' }"
                @click="toggleMobileMenu"
              >
                <div class="text-gray-500 dark:text-gray-400" :class="{ 'text-cyan-500': $route.path === '/favorites' }">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base font-medium">お気に入り</span>
                  <span v-if="favoriteCount > 0" class="px-1.5 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full shadow-sm">{{ favoriteCount }}</span>
                </div>
              </NuxtLink>
            </nav>
            
            <!-- Action Buttons -->
            <div class="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="toggleMobileSearch"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>検索</span>
              </button>
              
              <button
                @click="toggleTheme"
                class="flex items-center gap-3 p-3.5 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>{{ isDark ? 'ライト' : 'ダーク' }}モード</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Search Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="searchOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
        <div class="w-full max-w-2xl mx-4 transform transition-transform duration-300" :class="{ 'translate-y-0': searchOpen, '-translate-y-5': !searchOpen }">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 fill-none" width="24" height="24" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="技術書、著者、キーワードを検索..."
              class="w-full pl-14 pr-14 py-4 text-lg bg-white dark:bg-gray-800 border-0 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.enter="performSearch"
              @keydown.esc="closeSearch"
            />
            <button @click="closeSearch" class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites'

// State management
const searchOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// お気に入りストアを使用
const favoritesStore = useFavoritesStore()
const favoriteCount = computed(() => favoritesStore.favoriteCount)

// Theme management
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Methods
const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleMobileSearch = () => {
  toggleMobileMenu()
  toggleSearch()
}

const performSearch = () => {
  const query = searchQuery.value as string
  if (query) {
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      navigateTo(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      closeSearch()
    }
  }
}

// Initialize theme and keyboard shortcuts
onMounted(() => {
  // Check for saved theme preference or default to light mode
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
    
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    // Keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleSearch()
      }
      
      // Close overlays with Escape
      if (e.key === 'Escape') {
        if (searchOpen.value) closeSearch()
      }
    }
    
    document.addEventListener('keydown', handleKeydown)
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    })
  }
})
</script>

