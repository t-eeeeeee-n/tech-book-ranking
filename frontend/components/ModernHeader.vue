<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300 ease-out">
    <!-- Main Header -->
    <div class="relative">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Enhanced Logo Section -->
          <NuxtLink to="/" class="flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-0.5">
            <div class="flex items-center gap-3">
              <!-- Dynamic Logo Icon -->
              <div class="relative w-12 h-12 flex items-center justify-center">
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-105"></div>
                <div class="relative z-10 text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current drop-shadow-sm">
                    <path d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 6H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 10H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 14H12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-75 animate-pulse"></div>
              </div>
              
              <!-- Brand Text -->
              <div class="hidden sm:block">
                <h1 class="text-xl font-bold text-gray-900 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent tracking-tight">TechRank</h1>
                <p class="text-sm text-gray-500 font-medium tracking-wide">Books</p>
              </div>
            </div>
          </NuxtLink>

          <!-- Enhanced Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-1">
              <NuxtLink 
                to="/ranking"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:bg-cyan-500/10 hover:-translate-y-0.5"
                :class="{ 'bg-cyan-500/15 text-cyan-600': $route.path === '/ranking' }"
              >
                <div class="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-out">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-out">ランキング</span>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current rounded-full transition-all duration-300 ease-out" :class="{ 'w-6': $route.path === '/ranking' }"></div>
              </NuxtLink>
              
              <NuxtLink 
                to="/favorites"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:bg-cyan-500/10 hover:-translate-y-0.5"
                :class="{ 'bg-cyan-500/15 text-cyan-600': $route.path === '/favorites' }"
              >
                <div class="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-out">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-out">お気に入り</span>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current rounded-full transition-all duration-300 ease-out" :class="{ 'w-6': $route.path === '/favorites' }"></div>
              </NuxtLink>
              
              <NuxtLink 
                to="/about"
                class="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ease-out hover:bg-cyan-500/10 hover:-translate-y-0.5"
                :class="{ 'bg-cyan-500/15 text-cyan-600': $route.path === '/about' }"
              >
                <div class="text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-out">
                  <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-current">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 17h.01" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-out">このサイトについて</span>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current rounded-full transition-all duration-300 ease-out" :class="{ 'w-6': $route.path === '/about' }"></div>
              </NuxtLink>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <!-- Search Toggle -->
              <button
                @click="toggleSearch"
                class="relative p-2.5 rounded-lg bg-white/80 border border-white/30 text-gray-600 transition-all duration-300 ease-out hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-500 hover:-translate-y-0.5 hover:shadow-md"
                :class="{ 'bg-cyan-500/15 border-cyan-500 text-cyan-500': searchOpen }"
                aria-label="検索を開く"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <!-- Theme Toggle -->
              <button
                @click="toggleTheme"
                class="relative p-2.5 rounded-lg bg-white/80 border border-white/30 text-gray-600 transition-all duration-300 ease-out hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-500 hover:-translate-y-0.5 hover:shadow-md"
                :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
              >
                <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <!-- Status Indicator -->
              <div class="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium hidden lg:inline">更新中</span>
              </div>
            </div>
          </nav>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="p-2 rounded-lg bg-white/80 border border-white/30 transition-all duration-300 ease-out md:hidden w-6 h-6 flex flex-col justify-center gap-1"
            :class="{ 'mobile-menu-button--open': mobileMenuOpen }"
            :aria-label="mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'"
          >
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-full" :class="{ 'rotate-45 translate-x-0.5 translate-y-0.5': mobileMenuOpen }"></span>
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-3/4" :class="{ 'opacity-0': mobileMenuOpen }"></span>
            <span class="h-0.5 bg-current rounded-full transition-all duration-300 ease-out w-full" :class="{ '-rotate-45 translate-x-0.5 -translate-y-0.5': mobileMenuOpen }"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Search Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="searchOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
        <div class="w-full max-w-2xl mx-4 transition-transform duration-300 ease-out">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 fill-none stroke-current" width="24" height="24" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input
              id="header-search"
              name="headerSearch"
              aria-label="技術書、著者、キーワードを検索"
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="技術書、著者、キーワードを検索..."
              class="w-full pl-14 pr-14 py-4 text-lg bg-white dark:bg-gray-800 border-0 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown.enter="performSearch"
              @keyup.esc="closeSearch"
            />
            <button @click="closeSearch" class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <!-- Search Suggestions -->
          <div v-if="searchSuggestions.length > 0" class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">人気の検索</h3>
            <div class="space-y-1">
              <button
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="text-gray-400 fill-none stroke-current" width="16" height="16" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>{{ suggestion }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Navigation -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-all duration-300 ease-out"
      leave-from-class="translate-y-0"
      leave-to-class="-translate-y-full"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-white dark:bg-gray-900 top-20">
        <div class="h-full flex flex-col p-6">
          <div class="flex-1 space-y-2">
            <NuxtLink
              v-for="link in mobileNavLinks"
              :key="link.path"
              :to="link.path"
              @click="closeMobileMenu"
              class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="text-gray-600 dark:text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                  <template v-if="link.path === '/'">
                    <path d="M3 9L12 2L21 9V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2"/>
                  </template>
                  <template v-else-if="link.path === '/ranking'">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </template>
                  <template v-else-if="link.path === '/favorites'">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </template>
                  <template v-else-if="link.path === '/about'">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 17h.01" stroke="currentColor" stroke-width="2"/>
                  </template>
                </svg>
              </div>
              <span class="text-lg font-medium text-gray-900 dark:text-white">{{ link.text }}</span>
            </NuxtLink>
          </div>

          <div class="pt-6 border-t border-gray-200 dark:border-gray-800">
            <button @click="toggleTheme" class="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ isDark ? 'ライトモード' : 'ダークモード' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
// State management
const searchOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

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

// Search suggestions
const searchSuggestions = ref([
  'JavaScript', 'Python', 'React', 'Vue.js', 'Node.js',
  'AWS', 'Docker', 'TypeScript', 'AI・機械学習', 'Web開発'
])

// Mobile navigation links
interface NavLink {
  path: string
  text: string
}

const mobileNavLinks: NavLink[] = [
  { path: '/', text: 'ホーム' },
  { path: '/ranking', text: 'ランキング' },
  { path: '/favorites', text: 'お気に入り' },
  { path: '/about', text: 'このサイトについて' }
]

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

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    closeSearch()
  }
}

// Initialize theme
onMounted(() => {
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
  }
})

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  performSearch()
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Open search with Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      toggleSearch()
    }
    
    // Close overlays with Escape
    if (e.key === 'Escape') {
      if (searchOpen.value) closeSearch()
      if (mobileMenuOpen.value) closeMobileMenu()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

