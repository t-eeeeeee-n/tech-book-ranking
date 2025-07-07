<template>
  <article 
    :class="[
      'group relative bg-surface border border-default transition-all duration-300 cursor-pointer',
      'hover:border-accent/30 hover:shadow-medium hover:-translate-y-1',
      'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20',
      viewMode === 'grid' ? 'rounded-xl p-6' : 'rounded-lg p-4 flex gap-4',
      viewMode === 'compact' ? 'rounded-lg p-3 flex gap-3' : ''
    ]"
    @click="$emit('viewDetails', book.id)"
    @keydown.enter="$emit('viewDetails', book.id)"
    @keydown.space.prevent="$emit('viewDetails', book.id)"
    tabindex="0"
    role="button"
    :aria-label="`${book.title} の詳細を見る。${rank > 0 ? `${rank}位、` : ''}${book.mentionCount}回言及`"
  >
    <!-- Rank Badge (Grid view only) -->
    <div 
      v-if="rank > 0 && viewMode === 'grid'" 
      :class="[
        'absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md z-10',
        rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-accent to-accent-hover'
      ]"
    >
      {{ rank }}
    </div>

    <!-- Bookmark Button -->
    <button
      @click.stop="$emit('bookmark', book.id)"
      :class="[
        'absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 z-10',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent/50',
        isBookmarked 
          ? 'text-red-500 bg-red-50 dark:bg-red-950/20' 
          : 'text-muted bg-background/80 hover:text-accent hover:bg-accent/10'
      ]"
      :aria-label="isBookmarked ? 'お気に入りから削除' : 'お気に入りに追加'"
    >
      <Icon 
        :name="isBookmarked ? 'heroicons:heart-solid' : 'heroicons:heart'" 
        class="w-4 h-4" 
      />
    </button>

    <div :class="viewMode === 'grid' ? 'space-y-4' : 'flex-1'">
      <!-- Header Section -->
      <div :class="viewMode === 'grid' ? 'text-center' : 'flex gap-4'">
        <!-- Book Cover -->
        <div :class="[
          'relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg shadow-soft',
          viewMode === 'grid' ? 'w-24 h-32 mx-auto mb-4' : 'flex-shrink-0',
          viewMode === 'list' ? 'w-16 h-24' : '',
          viewMode === 'compact' ? 'w-12 h-16' : ''
        ]">
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
          
          <!-- Quality Badge -->
          <div 
            v-if="rank <= 10" 
            class="absolute bottom-1 left-1 px-2 py-1 bg-accent text-white text-xs font-medium rounded"
          >
            TOP{{ rank <= 3 ? rank : '10' }}
          </div>
        </div>

        <!-- Title & Meta -->
        <div :class="[
          'flex-1 min-w-0',
          viewMode === 'grid' ? 'text-center' : 'text-left'
        ]">
          <!-- Rank (List/Compact view) -->
          <div 
            v-if="rank > 0 && viewMode !== 'grid'" 
            :class="[
              'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white mb-2',
              rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-accent'
            ]"
          >
            {{ rank }}
          </div>

          <h3 :class="[
            'font-semibold text-primary leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-2',
            viewMode === 'grid' ? 'text-lg' : '',
            viewMode === 'list' ? 'text-base' : '',
            viewMode === 'compact' ? 'text-sm' : ''
          ]">
            {{ book.title }}
          </h3>
          
          <div :class="[
            'text-secondary mb-2',
            viewMode === 'grid' ? 'text-sm' : 'text-xs'
          ]">
            <span class="font-medium">{{ book.author }}</span>
            <span v-if="book.publishDate" class="text-muted ml-2">
              • {{ formatYear(book.publishDate) }}年
            </span>
          </div>

          <!-- Stats (Grid/List view) -->
          <div 
            v-if="viewMode !== 'compact'" 
            class="flex items-center gap-3 mb-3"
            :class="viewMode === 'grid' ? 'justify-center' : 'justify-start'"
          >
            <div class="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md">
              <Icon name="heroicons:fire" class="w-3 h-3" />
              <span class="text-xs font-medium">{{ book.mentionCount }}回</span>
            </div>
            
            <div v-if="book.category" class="px-2 py-1 bg-background text-secondary rounded-md border border-default">
              <span class="text-xs font-medium">{{ getCategoryLabel(book.category) }}</span>
            </div>
            
            <div v-if="book.trendScore" class="flex items-center gap-1 px-2 py-1 bg-background text-secondary rounded-md border border-default">
              <Icon name="heroicons:chart-bar-square" class="w-3 h-3" />
              <span class="text-xs font-medium">{{ Math.round(book.trendScore) }}</span>
            </div>
          </div>

          <!-- Compact Stats -->
          <div v-if="viewMode === 'compact'" class="flex items-center gap-2">
            <span class="text-xs text-accent font-medium">{{ book.mentionCount }}回言及</span>
            <span class="text-xs text-muted">• {{ getCategoryLabel(book.category) }}</span>
          </div>
        </div>
      </div>

      <!-- Tags (Grid/List view only) -->
      <div v-if="viewMode !== 'compact' && book.tags && book.tags.length > 0" class="space-y-2">
        <div class="flex flex-wrap gap-1.5" :class="viewMode === 'grid' ? 'justify-center' : 'justify-start'">
          <span
            v-for="tag in getDisplayTags(book.tags)"
            :key="tag.name"
            :class="[
              'px-2 py-1 text-xs rounded-md font-medium transition-colors',
              tag.priority === 'high' 
                ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                : 'bg-background text-muted hover:bg-border-light hover:text-secondary'
            ]"
          >
            #{{ tag.name }}
          </span>
          <span v-if="book.tags.length > 4" class="px-2 py-1 text-xs text-muted">
            +{{ book.tags.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Description (Grid view only) -->
      <div v-if="viewMode === 'grid' && book.description" class="text-center">
        <p class="text-sm text-secondary leading-relaxed line-clamp-2">
          {{ book.description }}
        </p>
      </div>

      <!-- Actions (Grid view only) -->
      <div v-if="viewMode === 'grid'" class="flex flex-col gap-3">
        <AmazonButton 
          :amazon-url="book.amazonUrl" 
          compact 
          @click.stop
        />
        
        <div class="flex justify-center gap-2">
          <ShareButtons
            :title="book.title"
            :author="book.author"
            :url="book.amazonUrl"
            compact
            @click.stop
          />
        </div>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
  </article>
</template>

<script setup lang="ts">
interface Props {
  book: any
  rank: number
  viewMode: 'grid' | 'list' | 'compact'
  isBookmarked: boolean
}

const props = defineProps<Props>()

defineEmits(['bookmark', 'viewDetails'])

// Category mapping (same as in main page)
const categoryLabels: Record<string, string> = {
  'programming': 'プログラミング',
  'web-development': 'Web開発',
  'ai-machine-learning': 'AI・機械学習',
  'infrastructure': 'インフラ',
  'database': 'データベース',
  'mobile-development': 'モバイル開発',
  'security': 'セキュリティ',
  'design-ui-ux': 'デザイン・UI/UX'
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
}

const formatYear = (dateString: string): string => {
  return new Date(dateString).getFullYear().toString()
}

// Tag processing (simplified version)
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
    .slice(0, 4)
}

const getTagPriority = (tag: string, count: number): 'high' | 'medium' | 'low' => {
  const highPriorityTags = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Python', 'Java', 'AWS', 'Docker'
  ]
  
  const mediumPriorityTags = [
    'プログラミング', 'Web開発', 'フロントエンド', 'バックエンド'
  ]
  
  if (count >= 3 || highPriorityTags.some(t => tag.toLowerCase().includes(t.toLowerCase()))) {
    return 'high'
  }
  
  if (count >= 2 || mediumPriorityTags.some(t => tag.toLowerCase().includes(t.toLowerCase()))) {
    return 'medium'
  }
  
  return 'low'
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover effects */
@media (hover: hover) {
  .group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
  }
}

/* Focus styles */
article:focus {
  outline: none;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>