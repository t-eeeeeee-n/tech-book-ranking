<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
    <!-- Book Card Skeleton -->
    <div 
      v-for="i in count" 
      :key="i"
      class="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      :class="{ 'animate-pulse': animate }"
    >
      <!-- Rank Badge Skeleton -->
      <div class="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 z-10"></div>
      
      <!-- Book Cover Skeleton -->
      <div class="w-full h-48 sm:h-52 md:h-56 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"></div>
      
      <!-- Book Info Skeleton -->
      <div class="text-center flex flex-col gap-2">
        <!-- Title -->
        <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4/5 mx-auto"></div>
        <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/5 mx-auto"></div>
        
        <!-- Author -->
        <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        
        <!-- Category -->
        <div class="h-6 bg-blue-100 dark:bg-cyan-800 rounded-full w-1/2 mx-auto my-2"></div>
        
        <!-- Stats -->
        <div class="flex flex-col gap-1 my-3">
          <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/5 mx-auto"></div>
          <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/5 mx-auto"></div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col gap-3 mt-4">
          <div class="h-10 bg-orange-200 dark:bg-orange-700 rounded-lg w-full"></div>
          <div class="flex gap-2">
            <div class="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg flex-1"></div>
            <div class="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 8,
  animate: true
})
</script>

<!-- All styles are now handled by Tailwind CSS -->