<template>
  <div v-if="amazonUrl" :class="compact ? 'w-full' : 'w-full space-y-4'">
    <!-- Main Purchase Button -->
    <button
      @click.stop="openAmazon"
      :class="[
        'group relative w-full btn-amazon text-white font-semibold overflow-hidden touch-target transition-all duration-200',
        compact ? 'py-2 px-4' : 'py-3 px-6'
      ]"
      style="border-radius: var(--radius-sm);"
    >
      <!-- Content -->
      <div class="relative flex items-center justify-center gap-2">
        <Icon name="heroicons:shopping-cart" class="w-4 h-4 opacity-90" />
        <span :class="compact ? 'text-sm' : 'text-body'">
          {{ compact ? 'Amazon' : 'Amazonで詳細を確認' }}
        </span>
        <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 opacity-90" />
      </div>
      
      <!-- Subtle hover effect -->
      <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
    
    <!-- Amazon Guidelines Notice (Full version only) -->
    <div v-if="!compact" class="p-3 bg-background border border-default rounded-lg">
      <div class="flex items-start gap-2">
        <Icon name="heroicons:information-circle" class="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
        <div class="text-caption text-secondary leading-relaxed">
          <p class="mb-1">価格・在庫・配送などの最新情報は</p>
          <p class="font-medium text-amazon">Amazon公式サイトでご確認ください</p>
        </div>
      </div>
    </div>
    
    <!-- Quality Indicator (Full version only) -->
    <div v-if="!compact" class="p-3 bg-accent/5 border border-accent/20 rounded-lg">
      <div class="flex items-center gap-2">
        <Icon name="heroicons:fire" class="w-4 h-4 text-accent" />
        <span class="text-caption text-accent font-medium">エンジニア注目の技術書</span>
      </div>
      <p class="text-xs text-secondary mt-1">Qiita記事での言及データに基づく</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  amazonUrl: String,
  compact: Boolean
})

const openAmazon = () => {
  if (props.amazonUrl) {
    window.open(props.amazonUrl, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
/* Amazon Button Styles */
.btn-amazon {
  background: linear-gradient(135deg, #ff9500 0%, #ff7300 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(255, 149, 0, 0.3);
  transition: all 0.2s ease;
}

.btn-amazon:hover {
  background: linear-gradient(135deg, #ff7300 0%, #ff5500 100%);
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.4);
  transform: translateY(-1px);
}

.btn-amazon:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3);
}

/* Touch target for accessibility */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Text styles */
.text-body {
  font-size: 1rem;
  line-height: 1.5;
}

.text-caption {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Color utilities */
.text-secondary {
  color: #6b7280;
}

.text-amazon {
  color: #ff9500;
}

.text-accent {
  color: #06b6d4;
}

/* Background utilities */
.bg-background {
  background-color: #ffffff;
}

.bg-accent\/5 {
  background-color: rgba(6, 182, 212, 0.05);
}

.border-default {
  border-color: #e5e7eb;
}

.border-accent\/20 {
  border-color: rgba(6, 182, 212, 0.2);
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .bg-background {
    background-color: #1f2937;
  }
  
  .text-secondary {
    color: #9ca3af;
  }
  
  .border-default {
    border-color: #374151;
  }
}

/* Dark mode class-based styles */
.dark .bg-background {
  background-color: #1f2937;
}

.dark .text-secondary {
  color: #9ca3af;
}

.dark .border-default {
  border-color: #374151;
}

.dark .bg-accent\/5 {
  background-color: rgba(6, 182, 212, 0.1);
}

.dark .border-accent\/20 {
  border-color: rgba(6, 182, 212, 0.3);
}
</style>