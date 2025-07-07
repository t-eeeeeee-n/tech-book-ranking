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
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
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
              <span>{{ filteredBooks.length }}冊該当</span>
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                カテゴリ
              </label>
              <select 
                v-model="selectedCategory"
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                期間
              </label>
              <select 
                v-model="selectedPeriod"
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                検索
              </label>
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="書籍名・著者名で検索"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                並び順
              </label>
              <select 
                v-model="sortBy"
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
        <!-- Ranking Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="book.id"
            class="ranking-card group cursor-pointer"
            @click="viewBookDetails(book.id)"
          >
            <!-- Rank Badge -->
            <div class="rank-badge" :class="getRankBadgeClass(getCurrentRank(index))">
              {{ getCurrentRank(index) }}
            </div>
            
            <!-- Book Cover -->
            <div class="book-cover">
              <img 
                :src="book.imageUrl" 
                :alt="book.title"
                class="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
              <div class="book-overlay">
                <Icon name="heroicons:eye" class="w-6 h-6 text-white" />
              </div>
            </div>
            
            <!-- Book Info -->
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-category">
                <span class="category-tag">{{ book.category }}</span>
              </div>
              <div class="book-stats">
                <div class="stat-item">
                  <Icon name="heroicons:fire" class="w-4 h-4 text-orange-500" />
                  <span>{{ book.mentionCount }}回言及</span>
                </div>
                <div class="stat-item">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
                  <span>{{ book.rating }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="book-actions" @click.stop>
                <!-- Amazon Button -->
                <button 
                  @click="openAmazonLink(book.amazonUrl)"
                  class="amazon-button"
                  title="Amazonで購入"
                >
                  <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
                  <span>Amazon</span>
                </button>
                
                <!-- SNS Share Buttons -->
                <div class="share-buttons">
                  <button 
                    @click="shareOnFacebook(book)"
                    class="share-button facebook-button"
                    title="Facebookでシェア"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  
                  <button 
                    @click="shareOnTwitter(book)"
                    class="share-button twitter-button"
                    title="X(Twitter)でシェア"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2025 Minimal Pagination -->
        <div class="minimal-pagination">
          <!-- Main Controls -->
          <div class="pagination-main">
            <!-- Previous Button -->
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="nav-btn nav-prev"
              :class="{ 'disabled': currentPage === 1 }"
              aria-label="前のページ"
            >
              <Icon name="heroicons:chevron-left" class="w-4 h-4" />
            </button>

            <!-- Page Status -->
            <div class="page-status">
              <span class="status-text">{{ startRank }}〜{{ endRank }}</span>
              <span class="status-divider">/</span>
              <span class="status-total">{{ totalFilteredBooks }}</span>
            </div>

            <!-- Next Button -->
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="nav-btn nav-next"
              :class="{ 'disabled': currentPage === totalPages }"
              aria-label="次のページ"
            >
              <Icon name="heroicons:chevron-right" class="w-4 h-4" />
            </button>
          </div>

          <!-- Progress Indicator -->
          <div class="progress-wrapper">
            <div class="progress-track">
              <div 
                class="progress-thumb"
                :style="{ left: `${progressPercentage}%` }"
              ></div>
            </div>
            <div class="progress-hint">
              ページ {{ currentPage }} / {{ totalPages }}
            </div>
          </div>

          <!-- Quick Navigation (Desktop Only) -->
          <div class="quick-nav" v-if="totalPages > 1">
            <button
              v-for="page in smartPages"
              :key="page"
              @click="goToPage(page)"
              class="quick-btn"
              :class="{ 
                'active': page === currentPage,
                'dots': page === '...'
              }"
              :disabled="page === '...'"
              :aria-label="`ページ ${page} に移動`"
            >
              <span v-if="page === '...'">⋯</span>
              <span v-else>{{ page }}</span>
            </button>
          </div>

          <!-- Jump Input (Collapsed) -->
          <details class="jump-section">
            <summary class="jump-toggle">
              <Icon name="heroicons:cursor-arrow-rays" class="w-3.5 h-3.5" />
              <span>移動</span>
            </summary>
            <div class="jump-content">
              <input
                v-model.number="jumpPage"
                @keydown.enter="jumpToPage"
                type="number"
                :min="1"
                :max="totalPages"
                class="jump-input"
                :placeholder="`1-${totalPages}`"
                aria-label="ページ番号を入力"
              />
              <button 
                @click="jumpToPage" 
                class="jump-btn"
                aria-label="指定ページに移動"
              >
                <Icon name="heroicons:arrow-right" class="w-3.5 h-3.5" />
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// State
const currentPage = ref(1)
const itemsPerPage = ref(20)
const selectedCategory = ref('')
const selectedPeriod = ref('all')
const searchQuery = ref('')
const sortBy = ref('mentions')
const jumpPage = ref(1)

// Mock data - in real app, this would come from API
const totalBooks = ref(4000)
const lastUpdate = ref(new Date())

// Categories
const categories = [
  { value: 'programming', label: 'プログラミング' },
  { value: 'web', label: 'Web開発' },
  { value: 'mobile', label: 'モバイル開発' },
  { value: 'ai', label: 'AI・機械学習' },
  { value: 'infrastructure', label: 'インフラ・DevOps' },
  { value: 'database', label: 'データベース' },
  { value: 'security', label: 'セキュリティ' },
  { value: 'design', label: 'デザイン・UI/UX' },
  { value: 'management', label: 'プロジェクト管理' },
  { value: 'career', label: 'キャリア・スキル' }
]

// Sample books data (expanded)
const allBooks = ref([
  {
    id: 1,
    title: 'リーダブルコード',
    author: 'Dustin Boswell, Trevor Foucher',
    imageUrl: 'https://m.media-amazon.com/images/I/51MgH8Jmr+L._SX350_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873115655',
    mentionCount: 892,
    rating: 4.6,
    category: 'プログラミング'
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    imageUrl: 'https://m.media-amazon.com/images/I/41SH-SvWPxL._SX376_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4048676881',
    mentionCount: 756,
    rating: 4.5,
    category: 'プログラミング'
  },
  {
    id: 3,
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    imageUrl: 'https://m.media-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873113911',
    mentionCount: 673,
    rating: 4.4,
    category: 'Web開発'
  },
  {
    id: 4,
    title: 'Effective Java',
    author: 'Joshua Bloch',
    imageUrl: 'https://m.media-amazon.com/images/I/51WD-F3GobL._SX379_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4621303252',
    mentionCount: 592,
    rating: 4.7,
    category: 'プログラミング'
  },
  {
    id: 5,
    title: 'デザインパターン',
    author: 'Gang of Four',
    imageUrl: 'https://m.media-amazon.com/images/I/51szD9HC9pL._SX342_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4797311126',
    mentionCount: 534,
    rating: 4.3,
    category: 'プログラミング'
  },
  // Additional books to demonstrate pagination
  ...Array.from({ length: 45 }, (_, i) => ({
    id: i + 6,
    title: `技術書 ${i + 6}`,
    author: `著者 ${i + 6}`,
    imageUrl: 'https://m.media-amazon.com/images/I/51MgH8Jmr+L._SX350_BO1,204,203,200_.jpg',
    amazonUrl: `https://www.amazon.co.jp/dp/example${i + 6}`,
    mentionCount: Math.floor(Math.random() * 500) + 50,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    category: categories[Math.floor(Math.random() * categories.length)].label
  }))
])

// Computed properties
const filteredBooks = computed(() => {
  let books = [...allBooks.value]
  
  // Filter by category
  if (selectedCategory.value) {
    const categoryLabel = categories.find(c => c.value === selectedCategory.value)?.label
    books = books.filter(book => book.category === categoryLabel)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    books = books.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    )
  }
  
  // Sort books
  books.sort((a, b) => {
    switch (sortBy.value) {
      case 'mentions':
        return b.mentionCount - a.mentionCount
      case 'rating':
        return b.rating - a.rating
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      default:
        return b.mentionCount - a.mentionCount
    }
  })
  
  return books
})

const totalFilteredBooks = computed(() => filteredBooks.value.length)
const totalPages = computed(() => Math.ceil(totalFilteredBooks.value / itemsPerPage.value))

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
})

const startRank = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endRank = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalFilteredBooks.value))

const formattedLastUpdate = computed(() => {
  return `最終更新: ${lastUpdate.value.toLocaleDateString('ja-JP')}`
})

// Modern pagination computed properties
const progressPercentage = computed(() => {
  return Math.round((currentPage.value / totalPages.value) * 100)
})

// Smart pagination for minimal design
const smartPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let pages = []
  
  if (current <= 4) {
    pages = [1, 2, 3, 4, 5, '...', total]
  } else if (current >= total - 3) {
    pages = [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  } else {
    pages = [1, '...', current - 1, current, current + 1, '...', total]
  }
  
  return pages
})

// Methods
const getRankBadgeClass = (rank) => {
  if (rank <= 3) {
    return 'rank-gold'
  } else if (rank <= 10) {
    return 'rank-silver'
  } else {
    return 'rank-bronze'
  }
}

const getCurrentRank = (index) => {
  return startRank.value + index
}

const viewBookDetails = (bookId) => {
  navigateTo(`/book/${bookId}`)
}

// SNS Share functions
const shareOnFacebook = (book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author} がQiitaで${book.mentionCount}回言及されています！`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = (book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author}\nQiitaで${book.mentionCount}回言及されている技術書です！\n⭐ 評価: ${book.rating}\n\n#技術書 #プログラミング #TechRankBooks`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
}

const openAmazonLink = (amazonUrl) => {
  window.open(amazonUrl, '_blank')
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// New modern pagination methods
const goToPage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const jumpToPage = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    currentPage.value = jumpPage.value
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  jumpPage.value = currentPage.value
}

// Watch for filter changes to reset pagination
watch([selectedCategory, selectedPeriod, searchQuery, sortBy], () => {
  currentPage.value = 1
})

// SEO
useHead({
  title: '技術書完全ランキング - TechRank Books',
  meta: [
    { 
      name: 'description', 
      content: 'エンジニアが実際に参考にしている技術書の完全ランキング。Qiita記事での言及数をもとに、4000冊以上の技術書から信頼できるランキングを提供。'
    }
  ]
})
</script>

<style scoped>
/* Ranking Cards - Same style as index.vue */
.ranking-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
}

.ranking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #06b6d4;
}

/* Rank Badges */
.rank-badge {
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
}

.rank-bronze {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

/* Book Cover */
.book-cover {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f3f4f6;
}

.book-cover img {
  transition: transform 0.3s ease;
}

.ranking-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ranking-card:hover .book-overlay {
  opacity: 1;
}

/* Book Info */
.book-info {
  text-align: center;
}

.book-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-category {
  margin-bottom: 0.75rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e0f2fe;
  color: #0891b2;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.book-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Action Buttons */
.book-actions {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.amazon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3);
}

.amazon-button:hover {
  background: linear-gradient(135deg, #ff6b00 0%, #e55500 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 149, 0, 0.4);
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  flex: 1;
}

.facebook-button {
  background: linear-gradient(135deg, #1877f2 0%, #165ed0 100%);
  color: white;
}

.facebook-button:hover {
  background: linear-gradient(135deg, #165ed0 0%, #1349a9 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(24, 119, 242, 0.4);
}

.twitter-button {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
}

.twitter-button:hover {
  background: linear-gradient(135deg, #333333 0%, #555555 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}

/* Dark mode styles */
.dark .ranking-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .ranking-card:hover {
  border-color: #06b6d4;
}

.dark .book-title {
  color: #f9fafb;
}

.dark .book-author {
  color: #9ca3af;
}

.dark .stat-item {
  color: #9ca3af;
}

.dark .category-tag {
  background: #0e7490;
  color: #67e8f9;
}

/* Dark mode button styles */
.dark .amazon-button {
  background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
  box-shadow: 0 2px 4px rgba(255, 149, 0, 0.2);
}

.dark .amazon-button:hover {
  box-shadow: 0 4px 8px rgba(255, 149, 0, 0.3);
}

.dark .facebook-button:hover {
  box-shadow: 0 3px 6px rgba(24, 119, 242, 0.3);
}

.dark .twitter-button:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* 2025 Minimal Pagination Styles */
.minimal-pagination {
  /* Vercel-inspired clean container */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(229, 229, 229);
  border-radius: 12px;
  padding: 20px;
  margin-top: 32px;
  
  /* Subtle shadow for depth */
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

/* Main Controls - Linear/Raycast inspired */
.pagination-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  /* Clean button design */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgb(229, 229, 229);
  border-radius: 6px;
  background: white;
  color: rgb(107, 114, 128);
  
  /* Smooth transitions */
  transition: all 0.15s ease;
  
  /* Focus for accessibility */
  cursor: pointer;
}

.nav-btn:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

.nav-btn:hover:not(.disabled) {
  border-color: rgb(156, 163, 175);
  color: rgb(17, 24, 39);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: rgb(243, 244, 246);
  color: rgb(156, 163, 175);
}

/* Page Status - Minimal typography */
.page-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ui-monospace, Monaco, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgb(75, 85, 99);
  padding: 6px 12px;
  background: rgb(249, 250, 251);
  border-radius: 6px;
  border: 1px solid rgb(243, 244, 246);
  min-width: 120px;
  justify-content: center;
}

.status-text {
  color: rgb(17, 24, 39);
  font-weight: 600;
}

.status-divider {
  color: rgb(156, 163, 175);
  margin: 0 2px;
}

.status-total {
  color: rgb(107, 114, 128);
}

/* Progress - Minimal track */
.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
  max-width: 280px;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 2px;
  background: rgb(229, 231, 235);
  border-radius: 1px;
  overflow: hidden;
}

.progress-thumb {
  position: absolute;
  top: -3px;
  width: 8px;
  height: 8px;
  background: rgb(59, 130, 246);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 0 2px white, 0 2px 4px rgba(59, 130, 246, 0.3);
}

.progress-hint {
  font-size: 12px;
  color: rgb(107, 114, 128);
  font-weight: 500;
}

/* Quick Navigation - Desktop only */
.quick-nav {
  display: none;
  gap: 4px;
  padding: 4px;
  background: rgb(249, 250, 251);
  border: 1px solid rgb(229, 231, 235);
  border-radius: 8px;
}

@media (min-width: 768px) {
  .quick-nav {
    display: flex;
  }
}

.quick-btn {
  min-width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: rgb(107, 114, 128);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-btn:hover:not(.dots) {
  background: white;
  color: rgb(17, 24, 39);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.quick-btn.active {
  background: rgb(59, 130, 246);
  color: white;
  font-weight: 600;
}

.quick-btn.dots {
  cursor: default;
  color: rgb(156, 163, 175);
}

/* Jump Section - Collapsible */
.jump-section {
  position: relative;
}

.jump-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: rgb(107, 114, 128);
  background: transparent;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  list-style: none;
}

.jump-toggle::-webkit-details-marker {
  display: none;
}

.jump-toggle:hover {
  border-color: rgb(156, 163, 175);
  color: rgb(17, 24, 39);
}

.jump-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 4px;
  display: flex;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.jump-input {
  width: 48px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: rgb(17, 24, 39);
  transition: all 0.15s ease;
}

.jump-input:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.jump-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: rgb(59, 130, 246);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.jump-btn:hover {
  background: rgb(37, 99, 235);
  transform: translateY(-1px);
}

/* Dark Mode - 2025 Minimal Style */
.dark .minimal-pagination {
  background: rgba(31, 41, 59, 0.8);
  border-color: rgb(75, 85, 99);
}

.dark .nav-btn {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .nav-btn:hover:not(.disabled) {
  border-color: rgb(107, 114, 128);
  color: rgb(229, 231, 235);
  background: rgb(75, 85, 99);
}

.dark .nav-btn.disabled {
  background: rgb(31, 41, 59);
  border-color: rgb(55, 65, 81);
  color: rgb(75, 85, 99);
}

.dark .page-status {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .status-text {
  color: rgb(229, 231, 235);
}

.dark .status-divider {
  color: rgb(107, 114, 128);
}

.dark .status-total {
  color: rgb(156, 163, 175);
}

.dark .progress-track {
  background: rgb(75, 85, 99);
}

.dark .progress-thumb {
  background: rgb(96, 165, 250);
  box-shadow: 0 0 0 2px rgb(31, 41, 59), 0 2px 4px rgba(96, 165, 250, 0.3);
}

.dark .progress-hint {
  color: rgb(156, 163, 175);
}

.dark .quick-nav {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
}

.dark .quick-btn {
  color: rgb(156, 163, 175);
}

.dark .quick-btn:hover:not(.dots) {
  background: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.dark .quick-btn.active {
  background: rgb(96, 165, 250);
  color: rgb(17, 24, 39);
}

.dark .jump-toggle {
  border-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.dark .jump-toggle:hover {
  border-color: rgb(107, 114, 128);
  color: rgb(229, 231, 235);
}

.dark .jump-content {
  background: rgb(31, 41, 59);
  border-color: rgb(75, 85, 99);
}

.dark .jump-input {
  background: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.dark .jump-input:focus {
  border-color: rgb(96, 165, 250);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.dark .jump-btn {
  background: rgb(96, 165, 250);
}

.dark .jump-btn:hover {
  background: rgb(59, 130, 246);
}

/* Mobile-First Responsive Design */
@media (max-width: 768px) {
  .minimal-pagination {
    padding: 16px;
    gap: 12px;
  }
  
  .pagination-main {
    gap: 8px;
  }
  
  .page-status {
    min-width: 100px;
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .progress-wrapper {
    max-width: 240px;
  }
  
  .quick-nav {
    display: none; /* Hide on mobile for simplicity */
  }
  
  .jump-section {
    font-size: 11px;
  }
  
  .jump-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0;
    padding: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 480px) {
  .minimal-pagination {
    padding: 12px;
    gap: 8px;
  }
  
  .nav-btn {
    width: 28px;
    height: 28px;
  }
  
  .page-status {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .progress-wrapper {
    max-width: 200px;
  }
  
  .progress-hint {
    font-size: 10px;
  }
}

/* Touch-friendly enhancements */
@media (pointer: coarse) {
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .quick-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .jump-btn {
    width: 32px;
    height: 32px;
  }
}

/* Responsive Design */
@media (max-width: 1280px) {
  .ranking-card {
    padding: 1rem;
  }
  
  .book-cover {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .book-cover {
    height: 160px;
  }
  
  .book-title {
    font-size: 0.85rem;
  }
  
  .book-author {
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .ranking-card {
    padding: 1rem;
  }
  
  .book-cover {
    height: 200px;
  }
}
</style>