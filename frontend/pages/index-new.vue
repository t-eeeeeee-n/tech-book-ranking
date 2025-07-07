<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section with Advanced Search -->
    <section class="bg-gradient-to-b from-accent/5 to-background border-b border-default">
      <div class="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-display-1 text-primary mb-6 fade-in">
            エンジニアが選ぶ
            <span class="text-accent gradient-text">技術書ランキング</span>
          </h1>
          <p class="text-body-large text-secondary mb-8 max-w-2xl mx-auto">
            {{ totalBooks.toLocaleString() }}冊以上の技術書から、
            <span class="text-accent font-medium">実際に現場で使われている</span>
            信頼できる書籍を発見
          </p>
          
          <!-- Advanced Search Bar -->
          <div class="relative max-w-2xl mx-auto mb-8">
            <div class="relative">
              <Icon 
                name="heroicons:magnifying-glass" 
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted"
              />
              <input
                v-model="searchQuery"
                @input="onSearchInput"
                @keydown.enter="onSearchSubmit"
                type="text"
                placeholder="書籍名、著者、技術キーワードで検索..."
                class="w-full pl-12 pr-16 py-4 text-body bg-surface border border-default rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-200 shadow-soft"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-muted hover:text-secondary transition-colors"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
              <button
                @click="onSearchSubmit"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Search Suggestions -->
            <div v-if="searchSuggestions.length > 0 && showSuggestions" class="absolute top-full left-0 right-0 mt-2 bg-surface border border-default rounded-xl shadow-medium z-50 max-h-64 overflow-y-auto">
              <div
                v-for="(suggestion, index) in searchSuggestions"
                :key="index"
                @click="selectSuggestion(suggestion)"
                class="px-4 py-3 hover:bg-background cursor-pointer border-b border-default last:border-b-0 flex items-center gap-3"
              >
                <Icon :name="suggestion.type === 'book' ? 'heroicons:book-open' : 'heroicons:user'" class="w-4 h-4 text-muted" />
                <div>
                  <div class="text-body-small font-medium text-primary">{{ suggestion.title }}</div>
                  <div v-if="suggestion.subtitle" class="text-caption text-secondary">{{ suggestion.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-animation">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-accent mb-1">{{ totalBooks.toLocaleString() }}+</div>
              <div class="text-body-small text-secondary">技術書を収録</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-accent mb-1">毎日</div>
              <div class="text-body-small text-secondary">ランキング更新</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-accent mb-1">{{ filteredBooks.length }}</div>
              <div class="text-body-small text-secondary">現在の表示数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-accent mb-1">{{ categories.length }}</div>
              <div class="text-body-small text-secondary">専門カテゴリ</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters & Controls Section -->
    <section class="sticky top-0 z-40 bg-surface/95 backdrop-blur-lg border-b border-default transition-all duration-200">
      <div class="container mx-auto px-4 sm:px-6 py-4">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.value"
              @click="selectCategory(category.value)"
              :class="[
                'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 touch-target',
                selectedCategory === category.value
                  ? 'bg-accent text-white shadow-md scale-105'
                  : 'bg-background text-secondary hover:bg-accent/10 hover:text-accent hover:scale-105'
              ]"
            >
              <span class="mr-2">{{ category.icon }}</span>
              {{ category.label }}
              <span v-if="category.count" class="ml-2 opacity-75 text-xs">({{ category.count }})</span>
            </button>
          </div>
          
          <!-- Sort & View Controls -->
          <div class="flex items-center gap-3">
            <!-- Sort Dropdown -->
            <div class="relative">
              <button
                @click="showSortMenu = !showSortMenu"
                class="flex items-center gap-2 px-4 py-2 bg-background border border-default rounded-lg hover:bg-border-light transition-colors"
              >
                <Icon name="heroicons:bars-arrow-down" class="w-4 h-4" />
                <span class="text-body-small font-medium">{{ currentSort.label }}</span>
                <Icon name="heroicons:chevron-down" class="w-4 h-4" />
              </button>
              
              <div v-if="showSortMenu" class="absolute top-full right-0 mt-2 bg-surface border border-default rounded-lg shadow-medium z-50 min-w-48">
                <button
                  v-for="sort in sortOptions"
                  :key="sort.value"
                  @click="selectSort(sort)"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-background transition-colors border-b border-default last:border-b-0',
                    selectedSort === sort.value ? 'bg-accent/10 text-accent' : 'text-secondary'
                  ]"
                >
                  <div class="font-medium text-body-small">{{ sort.label }}</div>
                  <div class="text-caption text-muted">{{ sort.description }}</div>
                </button>
              </div>
            </div>
            
            <!-- View Toggle -->
            <div class="flex bg-background border border-default rounded-lg overflow-hidden">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-2 transition-colors',
                  viewMode === 'grid' ? 'bg-accent text-white' : 'text-secondary hover:bg-border-light'
                ]"
              >
                <Icon name="heroicons:squares-2x2" class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-2 transition-colors',
                  viewMode === 'list' ? 'bg-accent text-white' : 'text-secondary hover:bg-border-light'
                ]"
              >
                <Icon name="heroicons:list-bullet" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Bookmarks -->
            <button
              @click="showBookmarks = !showBookmarks"
              :class="[
                'px-3 py-2 rounded-lg border border-default transition-colors relative',
                showBookmarks ? 'bg-accent text-white' : 'bg-background text-secondary hover:bg-border-light'
              ]"
            >
              <Icon name="heroicons:bookmark" class="w-4 h-4" />
              <span v-if="bookmarks.size > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ bookmarks.size }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto px-4 sm:px-6 py-8">
      <!-- Loading State -->
      <div v-if="loading && books.length === 0" class="flex justify-center items-center py-24">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-accent mx-auto mb-4"></div>
          <h3 class="text-heading-3 text-primary mb-2">技術書データを読み込み中</h3>
          <p class="text-body text-secondary">最新のランキング情報を取得しています...</p>
        </div>
      </div>

      <!-- Books Grid/List -->
      <div v-else>
        <!-- Results Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-heading-2 text-primary mb-1">
              {{ getResultsTitle() }}
            </h2>
            <p class="text-body-small text-secondary">
              {{ filteredBooks.length.toLocaleString() }}冊の技術書が見つかりました
              <span v-if="searchQuery">「{{ searchQuery }}」の検索結果</span>
            </p>
          </div>
        </div>

        <!-- Books Container -->
        <div 
          ref="booksContainer"
          :class="[
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
          ]"
        >
          <BookCard
            v-for="(book, index) in displayedBooks"
            :key="`${book.id}-${index}`"
            :book="book"
            :rank="index + 1"
            :view-mode="viewMode"
            :is-bookmarked="bookmarks.has(book.id)"
            @bookmark="toggleBookmark(book.id)"
            @view-details="viewBookDetails"
            class="fade-in-up"
            :style="{ 'animation-delay': `${Math.min(index * 50, 500)}ms` }"
          />
        </div>

        <!-- Load More / Loading -->
        <div v-if="hasMoreBooks" ref="loadMoreTrigger" class="flex justify-center py-12">
          <div v-if="loadingMore" class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-accent mx-auto mb-3"></div>
            <p class="text-body-small text-secondary">さらに読み込み中...</p>
          </div>
          <button
            v-else
            @click="loadMoreBooks"
            class="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
          >
            さらに表示 ({{ remainingBooks }}冊)
          </button>
        </div>

        <!-- No Results -->
        <div v-if="filteredBooks.length === 0 && !loading" class="text-center py-24">
          <div class="p-6 bg-background rounded-2xl inline-block mb-6">
            <Icon name="heroicons:magnifying-glass" class="w-16 h-16 text-muted mx-auto" />
          </div>
          <h3 class="text-heading-2 text-primary mb-4">該当する技術書が見つかりませんでした</h3>
          <p class="text-body text-secondary mb-8 max-w-md mx-auto">
            検索条件やフィルターを変更して、再度お試しください。
          </p>
          <button
            @click="resetFilters"
            class="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            すべてのフィルターをリセット
          </button>
        </div>
      </div>
    </section>

    <!-- Bookmarks Sidebar -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div v-if="showBookmarks" class="fixed inset-y-0 right-0 w-80 bg-surface border-l border-default shadow-strong z-50 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-heading-3 text-primary">お気に入り</h3>
            <button @click="showBookmarks = false" class="p-2 text-muted hover:text-secondary rounded-lg hover:bg-background transition-colors">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="bookmarkedBooks.length === 0" class="text-center py-12">
            <Icon name="heroicons:bookmark" class="w-12 h-12 text-muted mx-auto mb-4" />
            <p class="text-body text-secondary">まだお気に入りの書籍がありません</p>
          </div>
          
          <div v-else class="space-y-4">
            <BookCard
              v-for="book in bookmarkedBooks"
              :key="book.id"
              :book="book"
              :rank="0"
              view-mode="compact"
              :is-bookmarked="true"
              @bookmark="toggleBookmark(book.id)"
              @view-details="viewBookDetails"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay for Bookmarks -->
    <div v-if="showBookmarks" @click="showBookmarks = false" class="fixed inset-0 bg-black/20 z-40"></div>
  </div>
</template>

<script setup lang="ts">
// Page meta
useHead({
  title: 'エンジニアが選ぶ技術書ランキング - Tech Book Rank',
  meta: [
    {
      name: 'description',
      content: 'Qiita記事で言及された技術書ランキング。エンジニアが実際に参考にしている信頼できる技術書を発見しよう。'
    }
  ]
})

// State management
const searchQuery = ref('')
const showSuggestions = ref(false)
const searchSuggestions = ref([])
const selectedCategory = ref('all')
const selectedSort = ref('popularity')
const viewMode = ref('grid')
const showSortMenu = ref(false)
const showBookmarks = ref(false)
const bookmarks = ref(new Set())
const loading = ref(true)
const loadingMore = ref(false)
const books = ref([])
const displayedBooks = ref([])
const currentPage = ref(1)
const itemsPerPage = 24

// Refs
const booksContainer = ref(null)
const loadMoreTrigger = ref(null)

// Categories configuration
const categories = ref([
  { value: 'all', label: 'すべて', icon: '📚', count: 0 },
  { value: 'programming', label: 'プログラミング', icon: '💻', count: 0 },
  { value: 'web-development', label: 'Web開発', icon: '🌐', count: 0 },
  { value: 'ai-machine-learning', label: 'AI・機械学習', icon: '🤖', count: 0 },
  { value: 'infrastructure', label: 'インフラ', icon: '☁️', count: 0 },
  { value: 'database', label: 'データベース', icon: '🗃️', count: 0 },
  { value: 'mobile', label: 'モバイル', icon: '📱', count: 0 },
  { value: 'security', label: 'セキュリティ', icon: '🔒', count: 0 }
])

// Sort options
const sortOptions = ref([
  { value: 'popularity', label: '人気順', description: '言及数の多い順' },
  { value: 'recent', label: '最近話題', description: '最近言及された順' },
  { value: 'newest', label: '新刊順', description: '出版日の新しい順' },
  { value: 'rating', label: '評価順', description: 'コミュニティ評価順' }
])

// Computed properties
const totalBooks = computed(() => books.value.length)
const currentSort = computed(() => sortOptions.value.find(s => s.value === selectedSort.value))
const filteredBooks = computed(() => {
  let filtered = [...books.value]
  
  // Category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(book => 
      book.category === selectedCategory.value || 
      book.categories?.includes(selectedCategory.value)
    )
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case 'popularity':
        return b.mentionCount - a.mentionCount
      case 'recent':
        return new Date(b.lastMentionDate || 0).getTime() - new Date(a.lastMentionDate || 0).getTime()
      case 'newest':
        return new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()
      case 'rating':
        return (b.trendScore || 0) - (a.trendScore || 0)
      default:
        return 0
    }
  })
  
  return filtered
})

const hasMoreBooks = computed(() => displayedBooks.value.length < filteredBooks.value.length)
const remainingBooks = computed(() => filteredBooks.value.length - displayedBooks.value.length)
const bookmarkedBooks = computed(() => books.value.filter(book => bookmarks.value.has(book.id)))

// Methods
const fetchBooks = async () => {
  try {
    loading.value = true
    const { data } = await $fetch('/api/books', {
      query: { limit: 1000 } // Get all books for client-side filtering
    })
    books.value = data
    updateDisplayedBooks()
    updateCategoryCounts()
  } catch (error) {
    console.error('Failed to fetch books:', error)
  } finally {
    loading.value = false
  }
}

const updateDisplayedBooks = () => {
  const endIndex = currentPage.value * itemsPerPage
  displayedBooks.value = filteredBooks.value.slice(0, endIndex)
}

const updateCategoryCounts = () => {
  categories.value.forEach(category => {
    if (category.value === 'all') {
      category.count = books.value.length
    } else {
      category.count = books.value.filter(book => 
        book.category === category.value || book.categories?.includes(category.value)
      ).length
    }
  })
}

const loadMoreBooks = () => {
  loadingMore.value = true
  currentPage.value++
  
  setTimeout(() => {
    updateDisplayedBooks()
    loadingMore.value = false
  }, 500) // Simulate loading delay
}

const selectCategory = (categoryValue) => {
  selectedCategory.value = categoryValue
  currentPage.value = 1
  updateDisplayedBooks()
}

const selectSort = (sort) => {
  selectedSort.value = sort.value
  showSortMenu.value = false
  currentPage.value = 1
  updateDisplayedBooks()
}

const onSearchInput = (event) => {
  const query = event.target.value
  searchQuery.value = query
  
  if (query.length > 2) {
    // Generate search suggestions
    const suggestions = []
    
    // Book title suggestions
    books.value.forEach(book => {
      if (book.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          type: 'book',
          title: book.title,
          subtitle: book.author
        })
      }
    })
    
    // Author suggestions
    const authors = [...new Set(books.value.map(book => book.author))]
    authors.forEach(author => {
      if (author.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          type: 'author',
          title: author,
          subtitle: '著者'
        })
      }
    })
    
    searchSuggestions.value = suggestions.slice(0, 5)
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
  
  currentPage.value = 1
  updateDisplayedBooks()
}

const onSearchSubmit = () => {
  showSuggestions.value = false
  currentPage.value = 1
  updateDisplayedBooks()
}

const selectSuggestion = (suggestion) => {
  if (suggestion.type === 'book') {
    searchQuery.value = suggestion.title
  } else {
    searchQuery.value = suggestion.title
  }
  showSuggestions.value = false
  currentPage.value = 1
  updateDisplayedBooks()
}

const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
  currentPage.value = 1
  updateDisplayedBooks()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedSort.value = 'popularity'
  currentPage.value = 1
  updateDisplayedBooks()
}

const toggleBookmark = (bookId) => {
  if (bookmarks.value.has(bookId)) {
    bookmarks.value.delete(bookId)
  } else {
    bookmarks.value.add(bookId)
  }
}

const viewBookDetails = (bookId) => {
  navigateTo(`/books/${bookId}`)
}

const getResultsTitle = () => {
  if (searchQuery.value) {
    return `「${searchQuery.value}」の検索結果`
  }
  
  const category = categories.value.find(c => c.value === selectedCategory.value)
  return category?.value === 'all' ? '技術書ランキング' : `${category.label}ランキング`
}

// Intersection Observer for infinite scroll
const setupInfiniteScroll = () => {
  if (!loadMoreTrigger.value) return
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMoreBooks.value && !loadingMore.value) {
      loadMoreBooks()
    }
  }, {
    threshold: 0.1
  })
  
  observer.observe(loadMoreTrigger.value)
  
  onUnmounted(() => {
    observer.disconnect()
  })
}

// Lifecycle
onMounted(async () => {
  await fetchBooks()
  nextTick(() => {
    setupInfiniteScroll()
  })
})

// Watch for filter changes
watch([selectedCategory, searchQuery, selectedSort], () => {
  currentPage.value = 1
  updateDisplayedBooks()
})

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showSortMenu.value = false
      showSuggestions.value = false
    }
  })
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stagger-animation > * {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-animation > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-strong);
}
</style>