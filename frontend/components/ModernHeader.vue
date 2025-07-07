<template>
  <header class="modern-header">
    <!-- Main Header -->
    <div class="header-container">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Enhanced Logo Section -->
          <NuxtLink to="/" class="logo-group group">
            <div class="logo-container">
              <!-- Dynamic Logo Icon -->
              <div class="logo-icon">
                <div class="logo-background"></div>
                <div class="logo-symbol">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="logo-svg">
                    <path d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 6H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 10H16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 14H12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="logo-pulse"></div>
              </div>
              
              <!-- Brand Text -->
              <div class="brand-text">
                <h1 class="brand-title">TechRank</h1>
                <p class="brand-subtitle">Books</p>
              </div>
            </div>
          </NuxtLink>

          <!-- Enhanced Navigation -->
          <nav class="main-navigation">
            <div class="nav-links">
              <NuxtLink 
                to="/ranking"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === '/ranking' }"
              >
                <div class="nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="nav-text">ランキング</span>
                <div class="nav-indicator"></div>
              </NuxtLink>
              
              <NuxtLink 
                to="/categories"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === '/categories' }"
              >
                <div class="nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="nav-text">カテゴリ</span>
                <div class="nav-indicator"></div>
              </NuxtLink>
              
              <NuxtLink 
                to="/trending"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === '/trending' }"
              >
                <div class="nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="nav-text">トレンド</span>
                <div class="nav-indicator"></div>
              </NuxtLink>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
              <!-- Search Toggle -->
              <button
                @click="toggleSearch"
                class="action-button search-button"
                :class="{ 'search-button--active': searchOpen }"
                aria-label="検索を開く"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              
              <!-- Theme Toggle -->
              <button
                @click="toggleTheme"
                class="action-button theme-button"
                :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
              >
                <div class="theme-icon-container">
                  <svg v-if="!isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" class="theme-icon">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" class="theme-icon">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </button>
              
              <!-- Status Indicator -->
              <div class="status-indicator">
                <div class="status-dot"></div>
                <span class="status-text">更新中</span>
              </div>
            </div>
          </nav>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="mobile-menu-button md:hidden"
            :class="{ 'mobile-menu-button--open': mobileMenuOpen }"
            :aria-label="mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'"
          >
            <div class="hamburger">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Search Overlay -->
    <Transition
      enter-active-class="search-enter-active"
      enter-from-class="search-enter-from"
      enter-to-class="search-enter-to"
      leave-active-class="search-leave-active"
      leave-from-class="search-leave-from"
      leave-to-class="search-leave-to"
    >
      <div v-if="searchOpen" class="search-overlay">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="技術書、著者、キーワードを検索..."
              class="search-input"
              @keydown.enter="performSearch"
              @keydown.escape="closeSearch"
            />
            <button @click="closeSearch" class="search-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <!-- Search Suggestions -->
          <div v-if="searchSuggestions.length > 0" class="search-suggestions">
            <h3 class="suggestions-title">人気の検索</h3>
            <div class="suggestions-list">
              <button
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="suggestion-item"
              >
                <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
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
      enter-active-class="mobile-nav-enter-active"
      enter-from-class="mobile-nav-enter-from"
      enter-to-class="mobile-nav-enter-to"
      leave-active-class="mobile-nav-leave-active"
      leave-from-class="mobile-nav-leave-from"
      leave-to-class="mobile-nav-leave-to"
    >
      <div v-if="mobileMenuOpen" class="mobile-navigation">
        <div class="mobile-nav-content">
          <div class="mobile-nav-links">
            <NuxtLink 
              v-for="link in mobileNavLinks"
              :key="link.path"
              :to="link.path"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <div class="mobile-nav-icon" v-html="link.icon"></div>
              <span class="mobile-nav-text">{{ link.text }}</span>
            </NuxtLink>
          </div>
          
          <div class="mobile-nav-footer">
            <button @click="toggleTheme" class="mobile-theme-toggle">
              <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
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
const searchInput = ref(null)

// Theme management
const { isDark, toggleTheme } = useColorMode()

// Search suggestions
const searchSuggestions = ref([
  'JavaScript', 'Python', 'React', 'Vue.js', 'Node.js', 
  'AWS', 'Docker', 'TypeScript', 'AI・機械学習', 'Web開発'
])

// Mobile navigation links
const mobileNavLinks = [
  {
    path: '/ranking',
    text: 'ランキング',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/><path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/></svg>'
  },
  {
    path: '/categories',
    text: 'カテゴリ',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/></svg>'
  },
  {
    path: '/trending',
    text: 'トレンド',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/></svg>'
  }
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

<style scoped>
/* Modern Header Styles */
.modern-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.header-container {
  position: relative;
}

/* Logo Section */
.logo-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.logo-group:hover {
  transform: translateY(-1px);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-background {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  background: var(--gradient-primary);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.logo-group:hover .logo-background {
  box-shadow: var(--shadow-lg);
  transform: scale(1.05);
}

.logo-symbol {
  position: relative;
  z-index: 10;
  color: white;
}

.logo-svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.logo-pulse {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  opacity: 0.75;
  background: var(--gradient-primary);
  animation: logo-pulse 2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.75; 
  }
  50% { 
    transform: scale(1.1); 
    opacity: 0.5; 
  }
}

.brand-text {
  display: none;
}

@media (min-width: 640px) {
  .brand-text {
    display: block;
  }
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: var(--tracking-tight);
}

@media (prefers-color-scheme: dark) {
  .brand-title {
    color: white;
  }
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
}

@media (prefers-color-scheme: dark) {
  .brand-subtitle {
    color: #9ca3af;
  }
}

/* Navigation */
.main-navigation {
  @apply hidden md:flex items-center gap-8;
}

.nav-links {
  @apply flex items-center gap-1;
}

.nav-link {
  @apply relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
  position: relative;
}

.nav-link:hover {
  background: rgba(6, 182, 212, 0.1);
  transform: translateY(-1px);
}

.nav-link--active {
  background: rgba(6, 182, 212, 0.15);
  color: var(--color-brand-accent);
}

.nav-icon {
  @apply text-gray-600 dark:text-gray-400;
  transition: color var(--duration-normal) var(--easing-ease-out);
}

.nav-link:hover .nav-icon,
.nav-link--active .nav-icon {
  color: var(--color-brand-accent);
}

.nav-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
  transition: color var(--duration-normal) var(--easing-ease-out);
}

.nav-link:hover .nav-text,
.nav-link--active .nav-text {
  color: var(--color-brand-accent);
}

.nav-indicator {
  @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current rounded-full transition-all;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
}

.nav-link--active .nav-indicator {
  width: 24px;
}

/* Action Buttons */
.action-buttons {
  @apply flex items-center gap-3;
}

.action-button {
  @apply relative p-2.5 rounded-lg transition-all;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-text-secondary);
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
}

.action-button:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: var(--color-brand-accent);
  color: var(--color-brand-accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.search-button--active {
  background: rgba(6, 182, 212, 0.15);
  border-color: var(--color-brand-accent);
  color: var(--color-brand-accent);
}

.theme-icon-container {
  @apply transition-transform;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
}

.action-button:hover .theme-icon-container {
  transform: rotate(180deg);
}

.status-indicator {
  @apply flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800;
}

.status-dot {
  @apply w-2 h-2 bg-green-500 rounded-full;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  @apply text-xs font-medium hidden lg:inline;
}

/* Mobile Menu Button */
.mobile-menu-button {
  @apply p-2 rounded-lg transition-all;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
}

.hamburger {
  @apply w-6 h-6 flex flex-col justify-center gap-1;
}

.hamburger-line {
  @apply h-0.5 bg-current rounded-full transition-all;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-ease-out);
}

.hamburger-line:nth-child(1) {
  width: 100%;
}

.hamburger-line:nth-child(2) {
  width: 75%;
}

.hamburger-line:nth-child(3) {
  width: 100%;
}

.mobile-menu-button--open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(3px, 3px);
}

.mobile-menu-button--open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button--open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(3px, -3px);
}

/* Search Overlay */
.search-overlay {
  @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20;
}

.search-container {
  @apply w-full max-w-2xl mx-4;
}

.search-input-wrapper {
  @apply relative;
}

.search-input {
  @apply w-full pl-14 pr-14 py-4 text-lg bg-white dark:bg-gray-800 border-0 rounded-2xl shadow-xl;
  box-shadow: var(--shadow-xl);
}

.search-input:focus {
  @apply outline-none ring-2 ring-blue-500;
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400;
}

.search-close {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.search-suggestions {
  @apply mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl;
}

.suggestions-title {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 mb-3;
}

.suggestions-list {
  @apply space-y-1;
}

.suggestion-item {
  @apply w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.suggestion-icon {
  @apply text-gray-400;
}

/* Mobile Navigation */
.mobile-navigation {
  @apply fixed inset-0 z-40 bg-white dark:bg-gray-900;
  top: 80px;
}

.mobile-nav-content {
  @apply h-full flex flex-col p-6;
}

.mobile-nav-links {
  @apply flex-1 space-y-2;
}

.mobile-nav-link {
  @apply flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}

.mobile-nav-icon {
  @apply text-gray-600 dark:text-gray-400;
}

.mobile-nav-text {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.mobile-nav-footer {
  @apply pt-6 border-t border-gray-200 dark:border-gray-800;
}

.mobile-theme-toggle {
  @apply flex items-center gap-3 w-full p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}

/* Transitions */
.search-enter-active, .search-leave-active {
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.search-enter-from, .search-leave-to {
  opacity: 0;
}

.search-enter-from .search-container,
.search-leave-to .search-container {
  transform: translateY(-20px);
}

.mobile-nav-enter-active, .mobile-nav-leave-active {
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.mobile-nav-enter-from, .mobile-nav-leave-to {
  transform: translateY(-100%);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .modern-header {
    background: rgba(30, 41, 59, 0.95);
    border-bottom-color: rgba(51, 65, 85, 0.3);
  }
  
  .action-button {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(51, 65, 85, 0.3);
  }
}
</style>