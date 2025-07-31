<template>
  <header class="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-default transition-all duration-200">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo Section -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <div class="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
              <span class="text-white font-medium text-lg">📚</span>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full opacity-75"></div>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-heading-3 text-primary group-hover:text-accent transition-colors duration-200">
              テクランBooks
            </h1>
            <p class="text-caption text-secondary">エンジニアが選ぶ技術書ランキング</p>
          </div>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink 
            to="/"
            class="flex items-center gap-2 px-4 py-2 text-body-small font-medium text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:chart-bar" class="w-4 h-4" />
            <span>ランキング</span>
          </NuxtLink>
          <NuxtLink 
            to="/about"
            class="flex items-center gap-2 px-4 py-2 text-body-small font-medium text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
            <span>サイトについて</span>
          </NuxtLink>
          
          <div class="w-px h-5 bg-border-light mx-3"></div>
          
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="p-2.5 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200"
            :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
          >
            <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-4 h-4" />
          </button>
          
          <!-- Status Badge -->
          <div class="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/20">
            <div class="w-1.5 h-1.5 bg-accent rounded-full"></div>
            <span class="text-caption font-medium hidden lg:inline">毎日更新</span>
            <span class="text-caption font-medium lg:hidden">更新中</span>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200"
          :aria-label="mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'"
        >
          <Icon 
            :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
            class="w-5 h-5"
          />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-default mt-4">
          <nav class="flex flex-col py-4">
            <NuxtLink 
              to="/"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200 font-medium"
            >
              <Icon name="heroicons:chart-bar" class="w-4 h-4" />
              <span>ランキング</span>
            </NuxtLink>
            <NuxtLink 
              to="/about"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200 font-medium"
            >
              <Icon name="heroicons:information-circle" class="w-4 h-4" />
              <span>サイトについて</span>
            </NuxtLink>
            
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-default">
              <button 
                @click="toggleTheme"
                class="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary hover:bg-background rounded-lg transition-colors duration-200 font-medium"
              >
                <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-4 h-4" />
                <span>{{ isDark ? 'ライトモード' : 'ダークモード' }}</span>
              </button>
              
              <div class="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/20">
                <div class="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span class="text-caption font-medium">更新中</span>
              </div>
            </div>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const { isDark, toggleTheme } = useTheme()

// Close the mobile menu when clicking outside
const closeOnClickOutside = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>