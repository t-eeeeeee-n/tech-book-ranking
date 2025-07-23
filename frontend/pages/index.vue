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
          <BookCard-option3
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
import { getGoodBookScore } from '~/utils/bookScore'

// Get featured books data
const totalBooks = ref(4000)

// Top ranking books data (mock data)
const rawTopBooks = [
  {
    id: 1,
    title: 'リーダブルコード',
    author: 'Dustin Boswell, Trevor Foucher',
    imageUrl: 'https://m.media-amazon.com/images/I/51MgH8Jmr+L._SX350_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873115655',
    mentionCount: 892,
    rating: 4.6,
    category: 'プログラミング',
    articleCount: 45,
    totalLikes: 1250,
    newestArticleDate: '2024-11-15'
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    imageUrl: 'https://m.media-amazon.com/images/I/41SH-SvWPxL._SX376_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4048676881',
    mentionCount: 756,
    rating: 4.5,
    category: 'プログラミング',
    articleCount: 38,
    totalLikes: 980,
    newestArticleDate: '2024-10-20'
  },
  {
    id: 3,
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    imageUrl: 'https://m.media-amazon.com/images/I/5131OWtQRaL._SX381_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873113911',
    mentionCount: 673,
    rating: 4.4,
    category: 'JavaScript',
    articleCount: 32,
    totalLikes: 720,
    newestArticleDate: '2024-09-15'
  },
  {
    id: 4,
    title: 'Effective Java',
    author: 'Joshua Bloch',
    imageUrl: 'https://m.media-amazon.com/images/I/51WD-F3GobL._SX379_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4621303252',
    mentionCount: 592,
    rating: 4.7,
    category: 'Java',
    articleCount: 28,
    totalLikes: 840,
    newestArticleDate: '2024-08-10'
  },
  {
    id: 5,
    title: 'デザインパターン',
    author: 'Gang of Four',
    imageUrl: 'https://m.media-amazon.com/images/I/51szD9HC9pL._SX342_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4797311126',
    mentionCount: 534,
    rating: 4.3,
    category: 'プログラミング',
    articleCount: 25,
    totalLikes: 650,
    newestArticleDate: '2024-06-25'
  },
  {
    id: 6,
    title: 'React入門',
    author: 'Stoyan Stefanov',
    imageUrl: 'https://m.media-amazon.com/images/I/51vDl5D8NFL._SX352_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873117194',
    mentionCount: 487,
    rating: 4.2,
    category: 'React',
    articleCount: 35,
    totalLikes: 890,
    newestArticleDate: '2024-12-01'
  },
  {
    id: 7,
    title: 'Pythonクックブック',
    author: 'David Beazley, Brian K. Jones',
    imageUrl: 'https://m.media-amazon.com/images/I/51Zy5DAH++L._SX389_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873117690',
    mentionCount: 432,
    rating: 4.5,
    category: 'Python',
    articleCount: 30,
    totalLikes: 750,
    newestArticleDate: '2024-11-10'
  },
  {
    id: 8,
    title: 'Docker実践ガイド',
    author: 'Matthias Karl',
    imageUrl: 'https://m.media-amazon.com/images/I/41QrW7-xd4L._SX347_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4295008982',
    mentionCount: 398,
    rating: 4.1,
    category: 'インフラ',
    articleCount: 22,
    totalLikes: 580,
    newestArticleDate: '2024-05-15'
  },
  {
    id: 9,
    title: 'アルゴリズム図鑑',
    author: '石田保輝, 宮崎修一',
    imageUrl: 'https://m.media-amazon.com/images/I/51TdC0dE6bL._SX260_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4798149772',
    mentionCount: 367,
    rating: 4.4,
    category: 'アルゴリズム',
    articleCount: 20,
    totalLikes: 520,
    newestArticleDate: '2024-07-30'
  },
  {
    id: 10,
    title: 'Vue.js入門',
    author: '川口和也, 喜多啓介, 野田陽平',
    imageUrl: 'https://m.media-amazon.com/images/I/51KqTr3kQoL._SX350_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4774189677',
    mentionCount: 321,
    rating: 4.3,
    category: 'Vue.js',
    articleCount: 18,
    totalLikes: 460,
    newestArticleDate: '2024-04-20'
  }
]

// スコア計算付きの書籍データ
const topBooks = computed(() => {
  return rawTopBooks.map(book => ({
    ...book,
    goodBookScore: getGoodBookScore({
      id: book.id,
      title: book.title,
      articleCount: book.articleCount,
      totalLikes: book.totalLikes,
      newestArticleDate: book.newestArticleDate
    })
  }))
})

// Define Book interface
interface Book {
  id: number
  title: string
  author: string
  mentionCount: number
  rating: number
  amazonUrl: string
}

// Methods
const viewBookDetails = (bookId: number) => {
  navigateTo(`/book/${bookId}`)
}

// SNS Share functions
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