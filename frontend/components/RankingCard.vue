<template>
  <article 
    :class="[
      'group relative bg-white dark:bg-gray-800 border cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
      'hover:shadow-lg transition-all duration-300',
      isTopThree ? 'rounded-xl border-2 p-6' : 'rounded-lg border p-4',
      getRankingBorderColor()
    ]"
    @click="$emit('viewDetails', book.id)"
    @keydown.enter="$emit('viewDetails', book.id)"
    @keydown.space.prevent="$emit('viewDetails', book.id)"
    tabindex="0"
    :aria-label="`${rank}位: ${book.title} の詳細を見る。${book.mentionCount}回言及`"
  >
    <!-- TOP3 Special Layout -->
    <div v-if="isTopThree" class="text-center space-y-4">
      <!-- Rank Badge for TOP3 -->
      <div class="relative">
        <div :class="[
          'w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg',
          getRankingGradient()
        ]">
          {{ rank }}
        </div>
        <div :class="[
          'absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-lg',
          rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'
        ]">
          {{ rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉' }}
        </div>
      </div>

      <!-- Book Cover -->
      <div class="relative w-24 h-32 mx-auto overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg shadow-soft">
        <img 
          v-if="book.imageUrl" 
          :src="book.imageUrl" 
          :alt="`${book.title}の表紙`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Icon name="heroicons:book-open" class="w-8 h-8 text-muted" />
        </div>
        
        <!-- Champion Badge -->
        <div v-if="rank === 1" class="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
          👑 CHAMPION
        </div>
      </div>

      <!-- Title & Meta -->
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
          {{ book.title }}
        </h3>
        <div class="text-sm text-secondary mb-3">
          <span class="font-medium">{{ book.author }}</span>
          <span v-if="book.publishDate" class="text-muted ml-2">
            • {{ formatYear(book.publishDate) }}年
          </span>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <div :class="[
            'flex items-center gap-1 px-3 py-1.5 rounded-lg text-white font-medium',
            getRankingAccentColor()
          ]">
            <Icon name="heroicons:fire" class="w-4 h-4" />
            <span class="text-sm">{{ book.mentionCount }}回言及</span>
          </div>
          
          <div class="px-3 py-1.5 bg-background text-secondary rounded-lg border border-default">
            <span class="text-sm font-medium">{{ getCategoryLabel(book.category) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <AmazonButton :amazon-url="book.amazonUrl" compact @click.stop />
      </div>
    </div>

    <!-- Regular Ranking Layout -->
    <div v-else class="flex gap-4">
      <!-- Rank Display -->
      <div class="flex-shrink-0 flex flex-col items-center">
        <div :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-sm',
          getRankingGradient()
        ]">
          {{ rank }}
        </div>
        
        <!-- Ranking Tier Badge -->
        <div v-if="rank <= 10" class="mt-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded">
          TOP10
        </div>
        <div v-else-if="rank <= 50" class="mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
          TOP50
        </div>
      </div>

      <!-- Book Cover -->
      <div class="flex-shrink-0 w-16 h-20 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg shadow-soft">
        <img 
          v-if="book.imageUrl" 
          :src="book.imageUrl" 
          :alt="`${book.title}の表紙`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Icon name="heroicons:book-open" class="w-6 h-6 text-muted" />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-cyan-500 transition-colors line-clamp-2">
              {{ book.title }}
            </h3>
            <div class="text-sm text-secondary mb-2">
              <span class="font-medium">{{ book.author }}</span>
              <span v-if="book.publishDate" class="text-muted ml-2">
                • {{ formatYear(book.publishDate) }}年
              </span>
            </div>
          </div>
          
          <!-- Mobile Amazon Button -->
          <div class="ml-4 md:hidden">
            <button
              @click.stop="openAmazon"
              class="p-2 bg-amazon text-white rounded-lg hover:bg-amazon-hover transition-colors"
            >
              <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="flex items-center gap-3 mb-3">
          <div :class="[
            'flex items-center gap-1 px-2 py-1 rounded-md text-white font-medium',
            getRankingAccentColor()
          ]">
            <Icon name="heroicons:fire" class="w-3 h-3" />
            <span class="text-xs">{{ book.mentionCount }}回</span>
          </div>
          
          <div class="px-2 py-1 bg-background text-secondary rounded-md border border-default">
            <span class="text-xs font-medium">{{ getCategoryLabel(book.category) }}</span>
          </div>
          
          <div v-if="book.trendScore" class="flex items-center gap-1 px-2 py-1 bg-background text-secondary rounded-md border border-default">
            <Icon name="heroicons:chart-bar-square" class="w-3 h-3" />
            <span class="text-xs font-medium">{{ Math.round(book.trendScore) }}</span>
          </div>

          <!-- Ranking Change Indicator (Future feature) -->
          <div v-if="false" class="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
            <Icon name="heroicons:arrow-up" class="w-3 h-3" />
            <span class="text-xs font-medium">+3</span>
          </div>
        </div>

        <!-- Tags (Limited) -->
        <div v-if="book.tags && book.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="tag in getDisplayTags(book.tags)"
            :key="tag.name"
            :class="[
              'px-2 py-0.5 text-xs rounded font-medium transition-colors',
              tag.priority === 'high' 
                ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                : 'bg-background text-muted hover:bg-border-light hover:text-secondary'
            ]"
          >
            #{{ tag.name }}
          </span>
        </div>

        <!-- Actions Row -->
        <div class="flex items-center justify-between">
          <div class="text-xs text-muted">
            {{ book.publisher }} • {{ formatYear(book.publishDate) }}
          </div>
          
          <!-- Desktop Amazon Button -->
          <div class="hidden md:block">
            <AmazonButton :amazon-url="book.amazonUrl" compact @click.stop />
          </div>
        </div>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div :class="[
      'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
      isTopThree ? 'rounded-xl' : 'rounded-lg',
      getRankingHoverColor()
    ]"></div>
  </article>
</template>

<script setup lang="ts">
interface Props {
  book: any
  rank: number
  isTopThree: boolean
}

const props = defineProps<Props>()

defineEmits(['viewDetails'])

// Category mapping
const categoryLabels: Record<string, string> = {
  'programming': 'プログラミング',
  'web-development': 'Web開発',
  'ai-machine-learning': 'AI・機械学習',
  'infrastructure': 'インフラ',
  'database': 'データベース',
  'mobile': 'モバイル開発',
  'security': 'セキュリティ'
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
}

const formatYear = (dateString: string): string => {
  return new Date(dateString).getFullYear().toString()
}

// Ranking-specific styling
const getRankingGradient = () => {
  if (props.rank === 1) {
    return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600'
  } else if (props.rank === 2) {
    return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500'
  } else if (props.rank === 3) {
    return 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800'
  } else if (props.rank <= 10) {
    return 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-accent-500'
  } else if (props.rank <= 50) {
    return 'bg-gradient-to-br from-blue-500 to-blue-600'
  } else {
    return 'bg-gradient-to-br from-gray-500 to-gray-600'
  }
}

const getRankingBorderColor = () => {
  if (props.rank === 1) {
    return 'border-yellow-400/50'
  } else if (props.rank === 2) {
    return 'border-gray-400/50'
  } else if (props.rank === 3) {
    return 'border-amber-600/50'
  } else if (props.rank <= 10) {
    return 'border-accent/30'
  } else {
    return 'border-default'
  }
}

const getRankingAccentColor = () => {
  if (props.rank <= 3) {
    return 'bg-yellow-500'
  } else if (props.rank <= 10) {
    return 'bg-accent'
  } else if (props.rank <= 50) {
    return 'bg-blue-500'
  } else {
    return 'bg-gray-500'
  }
}

const getRankingHoverColor = () => {
  if (props.rank <= 3) {
    return 'bg-yellow-500/5'
  } else if (props.rank <= 10) {
    return 'bg-accent/5'
  } else {
    return 'bg-accent/3'
  }
}

// Tag processing (simplified)
const getDisplayTags = (tags: string[]) => {
  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const tagObjects = Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count,
    priority: getTagPriority(name, count)
  }))
  
  return tagObjects
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.count - a.count
    })
    .slice(0, props.isTopThree ? 4 : 3)
}

const getTagPriority = (tag: string, count: number): 'high' | 'medium' | 'low' => {
  const highPriorityTags = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Python', 'Java', 'AWS', 'Docker'
  ]
  
  if (count >= 3 || highPriorityTags.some(t => tag.toLowerCase().includes(t.toLowerCase()))) {
    return 'high'
  }
  
  if (count >= 2) {
    return 'medium'
  }
  
  return 'low'
}

const openAmazon = () => {
  if (props.book.amazonUrl) {
    window.open(props.book.amazonUrl, '_blank', 'noopener,noreferrer')
  }
}
</script>

