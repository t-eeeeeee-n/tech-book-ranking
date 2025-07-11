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
              </NuxtLink>
              
              <NuxtLink 
                to="/favorites"
                class="nav-link"
                :class="{ 'nav-link--active': $route.path === '/favorites' }"
              >
                <div class="nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="nav-text">お気に入り</span>
                <span v-if="favoriteCount > 0" class="favorite-count">{{ favoriteCount }}</span>
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

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="mobile-menu-enter-active"
      enter-from-class="mobile-menu-enter-from"
      enter-to-class="mobile-menu-enter-to"
      leave-active-class="mobile-menu-leave-active"
      leave-from-class="mobile-menu-leave-from"
      leave-to-class="mobile-menu-leave-to"
    >
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        <div class="mobile-menu-container">
          <div class="mobile-menu-header">
            <div class="mobile-menu-title">
              <h3>メニュー</h3>
            </div>
            <button @click="toggleMobileMenu" class="mobile-menu-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <div class="mobile-menu-content">
            <!-- Navigation Links -->
            <nav class="mobile-nav">
              <NuxtLink 
                to="/"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': $route.path === '/' }"
                @click="toggleMobileMenu"
              >
                <div class="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="mobile-nav-text">ホーム</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/ranking"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': $route.path === '/ranking' }"
                @click="toggleMobileMenu"
              >
                <div class="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 13L12 3L21 13" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21V13H16V21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="mobile-nav-text">ランキング</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/categories"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': $route.path === '/categories' }"
                @click="toggleMobileMenu"
              >
                <div class="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="mobile-nav-text">カテゴリ</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/trending"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': $route.path === '/trending' }"
                @click="toggleMobileMenu"
              >
                <div class="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <span class="mobile-nav-text">トレンド</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/favorites"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link--active': $route.path === '/favorites' }"
                @click="toggleMobileMenu"
              >
                <div class="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="flex items-center gap-2">
                  <span class="mobile-nav-text">お気に入り</span>
                  <span v-if="favoriteCount > 0" class="px-2 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full shadow-lg">{{ favoriteCount }}</span>
                </div>
              </NuxtLink>
            </nav>
            
            <!-- Action Buttons -->
            <div class="mobile-actions">
              <button
                @click="toggleMobileSearch"
                class="mobile-action-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>検索</span>
              </button>
              
              <button
                @click="toggleTheme"
                class="mobile-action-button"
              >
                <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { useFavoritesStore } from '~/stores/favorites'

// State management
const searchOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

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
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    closeSearch()
  }
}

// Initialize theme and keyboard shortcuts
onMounted(() => {
  // Check for saved theme preference or default to light mode
  if (process.client) {
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
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    mediaQuery.addListener(handleSystemThemeChange)
    
    // Keyboard shortcuts
    const handleKeydown = (e) => {
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
      mediaQuery.removeListener(handleSystemThemeChange)
    })
  }
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

.brand-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
}

/* Navigation */
.main-navigation {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .main-navigation {
    display: flex;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--easing-ease-out);
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
  color: #4b5563;
  transition: color var(--duration-normal) var(--easing-ease-out);
}

.nav-link:hover .nav-icon,
.nav-link--active .nav-icon {
  color: var(--color-brand-accent);
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: color var(--duration-normal) var(--easing-ease-out);
}

.nav-link:hover .nav-text,
.nav-link--active .nav-text {
  color: var(--color-brand-accent);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-button {
  position: relative;
  padding: 0.625rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-text-secondary);
  transition: all var(--duration-normal) var(--easing-ease-out);
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
  transition: transform var(--duration-normal) var(--easing-ease-out);
}

.action-button:hover .theme-icon-container {
  transform: rotate(180deg);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 0.5rem;
  border: 1px solid #bbf7d0;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #22c55e;
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.75rem;
  font-weight: 500;
  display: none;
}

@media (min-width: 1024px) {
  .status-text {
    display: inline;
  }
}

/* Mobile Menu Button */
.mobile-menu-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.hamburger {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.hamburger-line {
  height: 0.125rem;
  background: currentColor;
  border-radius: 9999px;
  transition: all var(--duration-normal) var(--easing-ease-out);
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
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-button--open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button--open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
  padding-top: 5rem;
}

.mobile-menu-container {
  width: 100%;
  max-width: 20rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-menu-title h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.mobile-menu-close {
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.mobile-menu-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  color: #374151;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.mobile-nav-link--active {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.mobile-nav-icon {
  color: #6b7280;
  transition: color 0.2s ease;
}

.mobile-nav-link:hover .mobile-nav-icon,
.mobile-nav-link--active .mobile-nav-icon {
  color: #06b6d4;
}

.mobile-nav-text {
  font-size: 1rem;
  font-weight: 500;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.mobile-action-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.mobile-action-button:hover {
  background: #f3f4f6;
  color: #111827;
}

/* Mobile Menu Transitions */
.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu-container,
.mobile-menu-leave-to .mobile-menu-container {
  transform: translateX(100%);
}

/* Dark mode mobile menu */
.dark .mobile-menu-container {
  background: #1f2937;
}

.dark .mobile-menu-header {
  border-bottom-color: #374151;
}

.dark .mobile-menu-title h3 {
  color: #f9fafb;
}

.dark .mobile-menu-close {
  color: #9ca3af;
}

.dark .mobile-menu-close:hover {
  background: #374151;
  color: #f9fafb;
}

.dark .mobile-nav-link {
  color: #d1d5db;
}

.dark .mobile-nav-link:hover {
  background: #374151;
  color: #f9fafb;
}

.dark .mobile-nav-link--active {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
}

.dark .mobile-nav-icon {
  color: #9ca3af;
}

.dark .mobile-actions {
  border-top-color: #374151;
}

.dark .mobile-action-button {
  background: #374151;
  color: #d1d5db;
}

.dark .mobile-action-button:hover {
  background: #4b5563;
  color: #f9fafb;
}

/* Search Overlay */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5rem;
}

.search-container {
  width: 100%;
  max-width: 32rem;
  margin: 0 1rem;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 3.5rem;
  font-size: 1.125rem;
  background: white;
  border: none;
  border-radius: 1rem;
  box-shadow: var(--shadow-xl);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6, var(--shadow-xl);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: colors var(--duration-normal);
}

.search-close:hover {
  background: #f3f4f6;
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
  
  .brand-title {
    color: white;
  }
  
  .brand-subtitle {
    color: #9ca3af;
  }
  
  .nav-icon {
    color: #9ca3af;
  }
  
  .nav-text {
    color: #d1d5db;
  }
  
  .search-input {
    background: #374151;
    color: white;
  }
  
  .search-close:hover {
    background: #4b5563;
  }
  
  .status-indicator {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
    border-color: rgba(34, 197, 94, 0.3);
  }
}

/* Class-based Dark mode */
.dark .modern-header {
  background: rgba(30, 41, 59, 0.95);
  border-bottom-color: rgba(51, 65, 85, 0.3);
}

.dark .action-button {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(51, 65, 85, 0.3);
  color: #d1d5db;
}

.dark .action-button:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #06b6d4;
}

.dark .mobile-menu-button {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(51, 65, 85, 0.3);
  color: #d1d5db;
}

.dark .brand-title {
  background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .brand-subtitle {
  color: #9ca3af;
}

.dark .nav-icon {
  color: #9ca3af;
}

.dark .nav-text {
  color: #d1d5db;
}

.dark .nav-link:hover .nav-icon,
.dark .nav-link--active .nav-icon {
  color: #06b6d4;
}

.dark .nav-link:hover .nav-text,
.dark .nav-link--active .nav-text {
  color: #06b6d4;
}

.dark .search-input {
  background: #374151;
  color: white;
}

.dark .search-close:hover {
  background: #4b5563;
}

.dark .status-indicator {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.3);
}

/* Favorite count badge */
.favorite-count {
  min-width: 1.25rem;
  height: 1.25rem;
  background: linear-gradient(135deg, #ec4899 0%, #ef4444 50%, #f43f5e 100%);
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 0.375rem;
  margin-left: 0.25rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.favorite-count:hover {
  transform: scale(1.1);
}

.favorite-count::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.favorite-count:hover::before {
  left: 100%;
}
</style>