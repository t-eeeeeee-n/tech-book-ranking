<template>
  <div class="book-score-badge" :class="containerClasses">
    <!-- Compact Style (デフォルト) -->
    <div v-if="variant === 'compact'" class="flex items-center gap-2">
      <!-- スコア数値 -->
      <div class="flex items-center gap-1">
        <div 
          class="text-xs font-bold tabular-nums"
          :class="scoreTextClass"
        >
          {{ Math.round(score) }}
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500">/100</div>
      </div>
      
      <!-- プログレスバー -->
      <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          class="h-full transition-all duration-500 ease-out rounded-full"
          :class="progressBarClass"
          :style="{ width: `${Math.min(100, Math.max(0, score))}%` }"
        ></div>
      </div>
    </div>

    <!-- Detailed Style -->
    <div v-else-if="variant === 'detailed'" class="space-y-2">
      <!-- スコアとラベル -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-1">
          <span 
            class="text-lg font-bold tabular-nums"
            :class="scoreTextClass"
          >
            {{ Math.round(score) }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">/100</span>
        </div>
        <div 
          class="text-xs font-medium px-2 py-1 rounded-full"
          :class="labelBadgeClass"
        >
          {{ scoreLabel }}
        </div>
      </div>
      
      <!-- プログレスバー -->
      <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          class="h-full transition-all duration-700 ease-out rounded-full"
          :class="progressBarClass"
          :style="{ width: `${Math.min(100, Math.max(0, score))}%` }"
        ></div>
      </div>
    </div>

    <!-- Minimal Style -->
    <div v-else-if="variant === 'minimal'" class="flex items-center gap-2">
      <!-- スコアドット -->
      <div 
        class="w-2 h-2 rounded-full"
        :class="dotClass"
      ></div>
      
      <!-- スコアとラベル -->
      <div class="flex items-center gap-2">
        <span 
          class="text-sm font-semibold tabular-nums"
          :class="scoreTextClass"
        >
          {{ Math.round(score) }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ scoreLabel }}
        </span>
      </div>
    </div>

    <!-- Circular Style -->
    <div v-else-if="variant === 'circular'" class="flex items-center gap-3">
      <!-- 円形プログレス -->
      <div class="relative w-12 h-12">
        <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
          <!-- 背景円 -->
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            fill="none"
            class="text-gray-200 dark:text-gray-700"
          />
          <!-- プログレス円 -->
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            fill="none"
            :class="circularProgressClass"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            class="transition-all duration-700 ease-out"
          />
        </svg>
        <!-- 中央のスコア -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span 
            class="text-xs font-bold tabular-nums"
            :class="scoreTextClass"
          >
            {{ Math.round(score) }}
          </span>
        </div>
      </div>
      
      <!-- ラベル -->
      <div class="flex-1">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
          いい本スコア
        </div>
        <div 
          class="text-xs font-medium"
          :class="scoreTextClass"
        >
          {{ scoreLabel }}
        </div>
      </div>
    </div>

    <!-- Pill Style -->
    <div v-else-if="variant === 'pill'" 
         class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
         :class="pillContainerClass">
      <div 
        class="w-1.5 h-1.5 rounded-full"
        :class="dotClass"
      ></div>
      <span 
        class="text-sm font-semibold tabular-nums"
        :class="pillTextClass"
      >
        {{ Math.round(score) }}
      </span>
      <span class="text-xs opacity-75">{{ scoreLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getScoreLevel } from '~/utils/bookScore'

interface Props {
  score: number
  variant?: 'compact' | 'detailed' | 'minimal' | 'circular' | 'pill'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'compact',
  showLabel: true,
  size: 'md',
  animate: true
})

// スコアレベルとラベルを取得
const scoreLabel = computed(() => getScoreLevel(props.score))

// スコアに応じたクラス計算
const scoreTextClass = computed(() => {
  if (props.score >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (props.score >= 80) return 'text-green-600 dark:text-green-400'
  if (props.score >= 70) return 'text-blue-600 dark:text-blue-400'
  if (props.score >= 60) return 'text-yellow-600 dark:text-yellow-400'
  if (props.score >= 40) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
})

const progressBarClass = computed(() => {
  if (props.score >= 90) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  if (props.score >= 80) return 'bg-gradient-to-r from-green-500 to-green-600'
  if (props.score >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (props.score >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (props.score >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-600'
  return 'bg-gradient-to-r from-red-500 to-red-600'
})

const dotClass = computed(() => {
  if (props.score >= 90) return 'bg-emerald-500'
  if (props.score >= 80) return 'bg-green-500'
  if (props.score >= 70) return 'bg-blue-500'
  if (props.score >= 60) return 'bg-yellow-500'
  if (props.score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
})

const labelBadgeClass = computed(() => {
  if (props.score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
  if (props.score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  if (props.score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
  if (props.score >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  if (props.score >= 40) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
})

const pillContainerClass = computed(() => {
  if (props.score >= 90) return 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300'
  if (props.score >= 80) return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
  if (props.score >= 70) return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
  if (props.score >= 60) return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300'
  if (props.score >= 40) return 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300'
  return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
})

const pillTextClass = computed(() => {
  return 'text-current'
})

const circularProgressClass = computed(() => {
  if (props.score >= 90) return 'text-emerald-500'
  if (props.score >= 80) return 'text-green-500'
  if (props.score >= 70) return 'text-blue-500'
  if (props.score >= 60) return 'text-yellow-500'
  if (props.score >= 40) return 'text-orange-500'
  return 'text-red-500'
})

const containerClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  return [
    sizeClasses[props.size],
    props.animate ? 'transition-all duration-300' : ''
  ].filter(Boolean).join(' ')
})

// 円形プログレス用の計算
const strokeWidth = 3
const radius = 20
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  const progress = Math.min(100, Math.max(0, props.score))
  return circumference - (progress / 100) * circumference
})
</script>

<style scoped>

/* Tabular numsでスコア数値を等幅に */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>