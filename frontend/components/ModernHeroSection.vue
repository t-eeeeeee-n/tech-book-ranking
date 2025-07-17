<template>
  <section class="modern-hero">
    <!-- Animated Background -->
    <div class="hero-background">
      <div class="gradient-mesh"></div>
      <div class="floating-elements">
        <div v-for="i in 6" :key="i" class="floating-element" :style="getFloatingElementStyle(i)"></div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="hero-content">
      <div class="container mx-auto px-6 relative z-10">
        <!-- Announcement Banner -->
        <div class="announcement-banner">
          <div class="announcement-content">
            <div class="announcement-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="announcement-text">2025年版 最新技術書ランキング公開中</span>
            <div class="announcement-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" class="fill-none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Main Heading -->
        <div class="hero-heading">
          <h1 class="hero-title">
            <span class="title-line">エンジニアが選ぶ</span>
            <span class="title-line title-accent">技術書ランキング</span>
            <span class="title-line title-year">2025</span>
          </h1>
          
          <p class="hero-subtitle">
            実際の開発現場で参考にされている技術書を発見。
            <span class="subtitle-highlight">{{ props.totalBooks.toLocaleString() }}冊以上</span>
            の技術書から、信頼できるランキングを提供
          </p>
        </div>

        <!-- Interactive Stats -->
        <div class="hero-stats">
          <div 
            v-for="(stat, index) in statsData" 
            :key="stat.label"
            class="stat-card"
            :style="{ 'animation-delay': `${index * 150}ms` }"
          >
            <div class="stat-icon">
              <div class="stat-icon-bg"></div>
              <div v-html="stat.icon" class="stat-icon-symbol"></div>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
            <div class="stat-trend" v-if="stat.trend">
              <svg width="12" height="12" viewBox="0 0 24 24" class="fill-none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ stat.trend }}</span>
            </div>
          </div>
        </div>

        <!-- Search CTA -->
        <div class="hero-search">
          <div class="search-container">
            <div class="search-input-group">
              <div class="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" class="fill-none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="JavaScript、Python、React... で検索"
                class="search-input"
                @keydown.enter="performSearch"
              />
              <button @click="performSearch" class="search-button">
                <span class="search-button-text">検索</span>
                <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            
            <!-- Quick Categories -->
            <div class="quick-categories">
              <span class="quick-label">人気カテゴリ:</span>
              <button
                v-for="category in quickCategories"
                :key="category.value"
                @click="searchCategory(category.value)"
                class="quick-category"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-text">{{ category.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Feature Highlights -->
        <div class="hero-features">
          <div 
            v-for="(feature, index) in features"
            :key="feature.title"
            class="feature-card"
            :style="{ 'animation-delay': `${(index + 3) * 100}ms` }"
          >
            <div class="feature-icon">
              <div v-html="feature.icon" class="feature-icon-symbol"></div>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="scroll-text">ランキングを見る</div>
      <div class="scroll-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" class="fill-none">
          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2"/>
        </svg>
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

const searchCategory = (category) => {
  navigateTo(`/ranking?category=${category}`)
}

const getFloatingElementStyle = (index) => {
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

<style scoped>
/* Modern Hero Section */
.modern-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(6, 182, 212, 0.05) 0%, 
    rgba(245, 158, 11, 0.05) 100%);
}

/* Animated Background */
.hero-background {
  position: absolute;
  inset: 0;
}

.gradient-mesh {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  background: 
    radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%);
  animation: gradient-shift 20s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-10px, -10px) scale(1.05); }
}

.floating-elements {
  position: absolute;
  inset: 0;
}

.floating-element {
  position: absolute;
  width: 1rem;
  height: 1rem;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  border-radius: 50%;
  opacity: 0.2;
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 8rem;
}

/* Announcement Banner */
.announcement-banner {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.announcement-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.announcement-content:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.announcement-icon {
  width: 1rem;
  height: 1rem;
  color: #06b6d4;
}

.announcement-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.announcement-arrow {
  width: 0.875rem;
  height: 0.875rem;
  color: #9ca3af;
}

/* Hero Heading */
.hero-heading {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-title {
  margin-bottom: 2rem;
}

.title-line {
  display: block;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.1;
  color: #1f2937;
}

@media (min-width: 768px) {
  .title-line {
    font-size: 3.75rem;
  }
}

@media (min-width: 1024px) {
  .title-line {
    font-size: 4.5rem;
  }
}

.title-accent {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-year {
  font-size: 1.875rem;
  font-weight: 300;
  color: #6b7280;
  letter-spacing: 0.1em;
}

@media (min-width: 768px) {
  .title-year {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .title-year {
    font-size: 3.75rem;
  }
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #4b5563;
  max-width: 48rem;
  margin: 0 auto;
  line-height: 1.625;
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 1.25rem;
  }
}

.subtitle-highlight {
  font-weight: 600;
  color: #06b6d4;
}

/* Interactive Stats */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .hero-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  position: relative;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.stat-icon {
  position: relative;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
}

.stat-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  opacity: 0.2;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

.stat-icon-symbol {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #06b6d4;
}

.stat-content {
  text-align: center;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1f2937;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .stat-number {
    font-size: 1.875rem;
  }
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #16a34a;
}

/* Hero Search */
.hero-search {
  margin-bottom: 4rem;
}

.search-container {
  max-width: 32rem;
  margin: 0 auto;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 3.5rem;
  font-size: 1.125rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #06b6d4, 0 20px 40px rgba(0, 0, 0, 0.15);
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
}

.search-button {
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border-radius: 0.75rem;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-button:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.search-button-text {
  display: none;
}

@media (min-width: 640px) {
  .search-button-text {
    display: inline;
  }
}

/* Quick Categories */
.quick-categories {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.quick-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-right: 0.5rem;
}

.quick-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.quick-category:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: #06b6d4;
  transform: translateY(-1px);
}

.category-icon {
  font-size: 1.125rem;
}

.category-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

/* Feature Highlights */
.hero-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .hero-features {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(6, 182, 212, 0.1);
}

.feature-icon-symbol {
  color: #06b6d4;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.feature-description {
  font-size: 0.875rem;
  line-height: 1.625;
  color: #6b7280;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  animation: scroll-bounce 2s ease-in-out infinite;
}

.scroll-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.scroll-arrow {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes scroll-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Dark Mode Adjustments */
@media (prefers-color-scheme: dark) {
  .modern-hero {
    background: linear-gradient(135deg, 
      rgba(6, 182, 212, 0.03) 0%, 
      rgba(245, 158, 11, 0.03) 100%);
  }
  
  .announcement-content {
    background: rgba(30, 41, 59, 0.8);
  }
  
  .announcement-text {
    color: #d1d5db;
  }
  
  .title-line {
    color: #f9fafb;
  }
  
  .hero-subtitle {
    color: #9ca3af;
  }
  
  .stat-card {
    background: rgba(30, 41, 59, 0.6);
  }
  
  .stat-number {
    color: #f9fafb;
  }
  
  .stat-label {
    color: #9ca3af;
  }
  
  .search-input {
    background: rgba(30, 41, 59, 0.8);
    color: #f9fafb;
  }
  
  .quick-category {
    background: rgba(30, 41, 59, 0.6);
  }
  
  .category-text {
    color: #9ca3af;
  }
  
  .feature-card {
    background: rgba(30, 41, 59, 0.4);
  }
  
  .feature-title {
    color: #f9fafb;
  }
  
  .feature-description {
    color: #9ca3af;
  }
}

/* Class-based Dark Mode */
.dark .modern-hero {
  background: linear-gradient(135deg, 
    rgba(6, 182, 212, 0.03) 0%, 
    rgba(245, 158, 11, 0.03) 100%);
}

.dark .announcement-content {
  background: rgba(30, 41, 59, 0.8);
}

.dark .announcement-text {
  color: #d1d5db;
}

.dark .title-line {
  color: #f9fafb;
}

.dark .hero-subtitle {
  color: #9ca3af;
}

.dark .stat-card {
  background: rgba(30, 41, 59, 0.6);
}

.dark .stat-number {
  color: #f9fafb;
}

.dark .stat-label {
  color: #9ca3af;
}

.dark .search-input {
  background: rgba(30, 41, 59, 0.8);
  color: #f9fafb;
}

.dark .quick-category {
  background: rgba(30, 41, 59, 0.6);
}

.dark .category-text {
  color: #9ca3af;
}

.dark .feature-card {
  background: rgba(30, 41, 59, 0.4);
}

.dark .feature-title {
  color: #f9fafb;
}

.dark .feature-description {
  color: #9ca3af;
}
</style>