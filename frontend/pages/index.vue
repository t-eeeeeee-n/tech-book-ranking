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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          <div 
            v-for="(book, index) in topBooks" 
            :key="book.id"
            class="ranking-card group cursor-pointer"
            @click="viewBookDetails(book.id)"
          >
            <!-- Rank Badge -->
            <div class="rank-badge" :class="getRankBadgeClass(index + 1)">
              {{ index + 1 }}
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

<script setup>
// Get featured books data
const totalBooks = ref(4000)

// Top ranking books data (mock data)
const topBooks = ref([
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
    category: 'JavaScript'
  },
  {
    id: 4,
    title: 'Effective Java',
    author: 'Joshua Bloch',
    imageUrl: 'https://m.media-amazon.com/images/I/51WD-F3GobL._SX379_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4621303252',
    mentionCount: 592,
    rating: 4.7,
    category: 'Java'
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
  {
    id: 6,
    title: 'React入門',
    author: 'Stoyan Stefanov',
    imageUrl: 'https://m.media-amazon.com/images/I/51vDl5D8NFL._SX352_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873117194',
    mentionCount: 487,
    rating: 4.2,
    category: 'React'
  },
  {
    id: 7,
    title: 'Pythonクックブック',
    author: 'David Beazley, Brian K. Jones',
    imageUrl: 'https://m.media-amazon.com/images/I/51Zy5DAH++L._SX389_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4873117690',
    mentionCount: 432,
    rating: 4.5,
    category: 'Python'
  },
  {
    id: 8,
    title: 'Docker実践ガイド',
    author: 'Matthias Karl',
    imageUrl: 'https://m.media-amazon.com/images/I/41QrW7-xd4L._SX347_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4295008982',
    mentionCount: 398,
    rating: 4.1,
    category: 'インフラ'
  },
  {
    id: 9,
    title: 'アルゴリズム図鑑',
    author: '石田保輝, 宮崎修一',
    imageUrl: 'https://m.media-amazon.com/images/I/51TdC0dE6bL._SX260_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4798149772',
    mentionCount: 367,
    rating: 4.4,
    category: 'アルゴリズム'
  },
  {
    id: 10,
    title: 'Vue.js入門',
    author: '川口和也, 喜多啓介, 野田陽平',
    imageUrl: 'https://m.media-amazon.com/images/I/51KqTr3kQoL._SX350_BO1,204,203,200_.jpg',
    amazonUrl: 'https://www.amazon.co.jp/dp/4774189677',
    mentionCount: 321,
    rating: 4.3,
    category: 'Vue.js'
  }
])

// Methods
const getRankBadgeClass = (rank) => {
  if (rank <= 3) {
    return 'rank-gold'
  } else if (rank <= 5) {
    return 'rank-silver'
  } else {
    return 'rank-bronze'
  }
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

<style scoped>
/* Ranking Cards */
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
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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