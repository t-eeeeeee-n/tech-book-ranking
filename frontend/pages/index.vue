<template>
  <div class="min-h-screen">
    <!-- Header -->
    <SimpleHeader />
    
    <!-- Modern Hero Section -->
    <ModernHeroSection 
      :total-books="totalBooks" 
      :total-categories="12"
      update-frequency="毎日"
    />
    
    <!-- Ranking Preview Section -->
    <section class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            人気技術書
            <span class="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              トップランキング
            </span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Qiita記事で最も言及されている技術書TOP10。実際の開発現場で参考にされている書籍をご紹介します。
          </p>
        </div>

        <!-- Ranking Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
          <!-- Loading state -->
          <div v-if="isLoading" class="col-span-full text-center p-8 text-gray-500">
            <div class="inline-flex items-center gap-2">
              <div class="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              読み込み中...
            </div>
          </div>
          
          <!-- No books found -->
          <div v-else-if="topBooks.length === 0" class="col-span-full text-center p-8 text-gray-500">
            書籍が見つかりませんでした
          </div>
          
          <!-- TOP10 Books Grid -->
          <BookCard
            v-for="(book, index) in topBooks" 
            :key="book.id"
            :book="book"
            :rank="index + 1"
            @click="viewBookDetails"
            @amazon-click="openAmazonLink"
            @facebook-share="shareOnFacebook"
            @twitter-share="shareOnTwitter"
          />
        </div>

        <!-- View All Button -->
        <div class="text-center">
          <NuxtLink 
            to="/ranking"
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <span>全ランキングを見る</span>
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

// Import types
import type { Book, BooksListApiResponse } from '~/types'
import BookCard from "~/components/BookCard.vue"

// Fetch top books data from API
const topBooksResponse = ref<BooksListApiResponse | null>(null)
const isLoading = ref(true)

// Extract data from API response
const topBooks = computed(() => {
  return topBooksResponse.value?.data || []
})

// Fetch data on the client-side only to avoid SSR issues
onMounted(async () => {
  try {
    topBooksResponse.value = await $fetch<BooksListApiResponse>('/api/books', {
      query: {
        limit: 10,
        sort: 'mentions'
      }
    })
  } catch (error) {
    console.error('Failed to fetch top books:', error)
  } finally {
    isLoading.value = false
  }
})

const totalBooks = computed(() => {
  return topBooksResponse.value?.meta?.totalBooks || 4000
})

// Methods
const viewBookDetails = (bookId: number) => {
  // ホームページからは通常の遷移（フィルター状態なし）
  navigateTo({ name: 'book-id', params: { id: bookId.toString() } })
}

// SNS Share functions
const shareOnFacebook = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const authorText = Array.isArray(book.author) ? book.author.join(', ') : book.author
  const text = encodeURIComponent(`📚 ${book.title} - ${authorText} がQiitaで${book.mentionCount}回言及されています！`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = (book: Book) => {
  const url = encodeURIComponent(`${window.location.origin}/book/${book.id}`)
  const authorText = Array.isArray(book.author) ? book.author.join(', ') : book.author
  const text = encodeURIComponent(`📚 ${book.title} - ${authorText}\nQiitaで${book.mentionCount}回言及されている技術書です！\n⭐ 評価: ${book.rating}\n\n#技術書 #プログラミング #TechRankBooks`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
}

const openAmazonLink = (amazonUrl: string) => {
  window.open(amazonUrl, '_blank')
}

// SEO
useHead({
  title: '技術書ランキング - Tech Book Rank',
  meta: [
    { 
      name: 'description', 
      content: 'エンジニアが実際に参考にしている技術書のランキング。Qiita記事での言及数をもとに、信頼できる技術書を発見できます。' 
    }
  ]
})
</script>

<!-- All styles are now handled by the BookCard component with Tailwind CSS -->