<template>
  <div class="flex justify-center items-center p-8 animate-fade-in" :class="{ 'fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[1000]': overlay }">
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner -->
      <div class="relative inline-block" :class="sizeClasses">
        <div class="absolute border-transparent rounded-full animate-spin border-t-blue-500 dark:border-t-blue-400" :class="ringClasses" style="animation-delay: -450ms"></div>
        <div class="absolute border-transparent rounded-full animate-spin border-t-cyan-500 dark:border-t-cyan-400" :class="ringClasses" style="animation-delay: -300ms"></div>
        <div class="absolute border-transparent rounded-full animate-spin border-t-purple-500 dark:border-t-purple-400" :class="ringClasses" style="animation-delay: -150ms"></div>
        <div class="absolute border-transparent rounded-full animate-spin border-t-pink-500 dark:border-t-pink-400" :class="ringClasses"></div>
      </div>
      
      <!-- Loading Text -->
      <div v-if="showText" class="text-center flex flex-col gap-1">
        <p class="text-base md:text-sm font-medium text-gray-700 dark:text-gray-100 m-0">{{ text }}</p>
        <p v-if="subText" class="text-sm md:text-xs text-gray-500 dark:text-gray-400 m-0">{{ subText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  subText?: string
  size?: 'small' | 'medium' | 'large'
  overlay?: boolean
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '読み込み中...',
  subText: '',
  size: 'medium',
  overlay: false,
  showText: true
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-6 h-6'
    case 'large':
      return 'w-14 h-14'
    default:
      return 'w-10 h-10'
  }
})

const ringClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-full h-full border-2'
    case 'large':
      return 'w-full h-full border-4'
    default:
      return 'w-full h-full border-3'
  }
})
</script>

