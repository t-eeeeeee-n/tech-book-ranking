<template>
  <div v-if="amazonUrl" :class="compact ? 'w-full' : 'w-full space-y-4'">
    <!-- Main Purchase Button -->
    <button
      @click.stop="openAmazon"
      :class="[
        'group relative w-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
        'text-white font-semibold border-none rounded-lg overflow-hidden transition-all duration-200',
        'shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40',
        'hover:-translate-y-0.5 active:translate-y-0 active:shadow-md active:shadow-orange-500/30',
        'min-h-[44px] min-w-[44px]', // touch-target
        compact ? 'py-2 px-4 text-sm' : 'py-3 px-6 text-base'
      ]"
    >
      <!-- Content -->
      <span class="relative flex items-center justify-center gap-2">
        <Icon name="heroicons:shopping-cart" class="w-4 h-4 opacity-90" />
        <span>
          {{ compact ? 'Amazon' : 'Amazonで詳細を確認' }}
        </span>
        <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 opacity-90" />
      </span>
      
      <!-- Subtle hover effect -->
      <span class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
    </button>
    
    <!-- Amazon Guidelines Notice (Full version only) -->
    <div v-if="!compact" class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div class="flex items-start gap-2">
        <Icon name="heroicons:information-circle" class="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
        <div class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          <p class="mb-1">価格・在庫・配送などの最新情報は</p>
          <p class="font-medium text-orange-500">Amazon公式サイトでご確認ください</p>
        </div>
      </div>
    </div>
    
    <!-- Quality Indicator (Full version only) -->
    <div v-if="!compact" class="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 rounded-lg">
      <div class="flex items-center gap-2">
        <Icon name="heroicons:fire" class="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        <span class="text-sm text-cyan-600 dark:text-cyan-400 font-medium">エンジニア注目の技術書</span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Qiita記事での言及データに基づく</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

