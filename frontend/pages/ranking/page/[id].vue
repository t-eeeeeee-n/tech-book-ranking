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
            🏆 技術書ランキング
            <span class="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {{ startRank }}〜{{ endRank }}位
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Qiita記事で言及された技術書のランキング（{{ currentPage }}ページ目）
          </p>
          
          <!-- Pagination Info -->
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:book-open" class="w-4 h-4 text-blue-600" />
              <span>{{ startRank }}〜{{ endRank }}位表示</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:chart-bar" class="w-4 h-4 text-green-600" />
              <span>全{{ totalBooks }}冊</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Books Grid Section -->
    <section class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-6">
        <!-- Loading -->
        <div v-if="pending" class="mb-12">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="n in 24" :key="n" class="animate-pulse">
              <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p class="text-red-600 dark:text-red-400 font-medium mb-2">エラーが発生しました</p>
            <p class="text-red-500 dark:text-red-300 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Books Grid -->
        <div v-else-if="books && books.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            <BookCard
              v-for="(book, index) in books" 
              :key="book.id"
              :book="book"
              :rank="startRank + index"
              @click="viewBookDetails"
              @amazon-click="openAmazonLink"
              @facebook-share="shareOnFacebook"
              @twitter-share="shareOnTwitter"
            />
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400 font-medium mb-2">該当するページが見つかりませんでした</p>
        </div>

        <!-- Pagination -->
        <div v-if="books && books.length > 0" class="flex justify-center items-center gap-4 mt-12">
          <!-- Previous Page -->
          <NuxtLink 
            v-if="hasPrev"
            :to="currentPage - 1 === 1 ? { name: 'ranking' } : { name: 'ranking-page-id', params: { id: (currentPage - 1).toString() } }"
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="heroicons:chevron-left" class="w-4 h-4" />
            <span>前のページ</span>
          </NuxtLink>

          <!-- Page Numbers -->
          <div class="flex items-center gap-2">
            <NuxtLink 
              v-for="pageNum in visiblePages" 
              :key="pageNum"
              :to="pageNum === 1 ? { name: 'ranking' } : { name: 'ranking-page-id', params: { id: pageNum.toString() } }"
              class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              :class="pageNum === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              {{ pageNum }}
            </NuxtLink>
          </div>

          <!-- Next Page -->
          <NuxtLink 
            v-if="hasNext"
            :to="{ name: 'ranking-page-id', params: { id: (currentPage + 1).toString() } }"
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span>次のページ</span>
            <Icon name="heroicons:chevron-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BookCard from '~/components/BookCard.vue'

// Get page parameter
const route = useRoute()
const currentPage = computed(() => parseInt(route.params.page as string) || 1)

// Fetch data for specific page
const limit = 24
const { data: response, pending, error } = await useFetch('/api/books', {
  query: {
    page: currentPage,
    limit,
    sort: 'mentions'
  },
  key: `books-page-${currentPage.value}`
})

// Extract data
const books = computed(() => response.value?.data || [])
const totalBooks = computed(() => response.value?.meta?.totalBooks || 0)
const totalPages = computed(() => response.value?.pagination?.totalPages || 1)
const hasNext = computed(() => response.value?.pagination?.hasNext || false)
const hasPrev = computed(() => response.value?.pagination?.hasPrev || false)

// Calculate positions
const startRank = computed(() => {
  return (currentPage.value - 1) * limit + 1
})

const endRank = computed(() => {
  return Math.min(currentPage.value * limit, totalBooks.value)
})

// Visible page numbers for pagination
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)
  
  // Adjust if we're near the beginning or end
  if (end - start < delta * 2) {
    if (start === 1) {
      end = Math.min(total, start + delta * 2)
    } else {
      start = Math.max(1, end - delta * 2)
    }
  }
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Define Book interface
interface Book {
  id: number
  title: string
  author: string
  mentionCount: number
  rating?: number
}

// Methods
const viewBookDetails = (bookId: number) => {
  navigateTo({ name: 'book-id', params: { id: bookId.toString() } })
}

const shareOnFacebook = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author} がQiitaで${book.mentionCount}回言及されています！`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const text = encodeURIComponent(`📚 ${book.title} - ${book.author}\nQiitaで${book.mentionCount}回言及されている技術書です！\n⭐ 評価: ${book.rating}\n\n#技術書 #プログラミング #TechRankBooks`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
}

const openAmazonLink = (amazonUrl: string) => {
  window.open(amazonUrl, '_blank')
}

// SEO
useHead({
  title: `技術書ランキング ${startRank.value}〜${endRank.value}位 - Tech Book Rank`,
  meta: [
    { 
      name: 'description', 
      content: `Qiita記事で言及された技術書ランキング${startRank.value}〜${endRank.value}位。エンジニアが実際に参考にしている技術書を発見できます。` 
    },
    {
      property: 'og:title',
      content: `技術書ランキング ${startRank.value}〜${endRank.value}位`
    },
    {
      property: 'og:description',
      content: `Qiita記事で言及された技術書ランキング${startRank.value}〜${endRank.value}位`
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Client-side SEO enhancements
watchEffect(() => {
  if (import.meta.client && books.value.length > 0) {
    // Remove existing structured data and links
    const existingStructuredData = document.querySelector('script[type="application/ld+json"]')
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    const existingAlternate = document.querySelector('link[rel="alternate"]')
    const existingPrev = document.querySelector('link[rel="prev"]')
    const existingNext = document.querySelector('link[rel="next"]')
    
    if (existingStructuredData) existingStructuredData.remove()
    if (existingCanonical) existingCanonical.remove()
    if (existingAlternate) existingAlternate.remove()
    if (existingPrev) existingPrev.remove()
    if (existingNext) existingNext.remove()

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `技術書ランキング ${startRank.value}〜${endRank.value}位`,
      "description": `Qiita記事で言及された技術書ランキング${startRank.value}〜${endRank.value}位`,
      "url": `${window.location.origin}/ranking/page/${currentPage.value}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "TechRank Books",
        "url": window.location.origin
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": books.value.length,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": books.value.map((book, index) => ({
          "@type": "ListItem",
          "position": startRank.value + index,
          "item": {
            "@type": "Book",
            "name": book.title,
            "author": book.author,
            "aggregateRating": book.rating ? {
              "@type": "AggregateRating",
              "ratingValue": book.rating,
              "ratingCount": book.mentionCount
            } : undefined
          }
        }))
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Add canonical URL
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${window.location.origin}/ranking/page/${currentPage.value}`
    document.head.appendChild(canonical)

    // Add alternate link to infinite scroll version
    const alternate = document.createElement('link')
    alternate.rel = 'alternate'
    alternate.href = `${window.location.origin}/ranking`
    alternate.title = '無限スクロール版'
    document.head.appendChild(alternate)

    // Add prev/next links
    if (hasPrev.value) {
      const prev = document.createElement('link')
      prev.rel = 'prev'
      prev.href = currentPage.value === 2 
        ? `${window.location.origin}/ranking` 
        : `${window.location.origin}/ranking/page/${currentPage.value - 1}`
      document.head.appendChild(prev)
    }

    if (hasNext.value) {
      const next = document.createElement('link')
      next.rel = 'next'
      next.href = `${window.location.origin}/ranking/page/${currentPage.value + 1}`
      document.head.appendChild(next)
    }
  }
})
</script>