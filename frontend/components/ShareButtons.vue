<template>
  <div :class="compact ? 'flex items-center gap-1' : 'flex items-center gap-2 w-full'">
    <button
      @click="shareToFacebook"
      :class="[
        'group flex items-center justify-center gap-2 btn-facebook text-white font-medium transition-all duration-200',
        compact 
          ? 'p-2 rounded-lg' 
          : 'flex-1 text-sm touch-target'
      ]"
    >
      <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span v-if="!compact" class="hidden sm:inline">Facebook</span>
    </button>
    
    <button
      @click="shareToTwitter"
      :class="[
        'group flex items-center justify-center gap-2 btn-x-twitter font-medium transition-all duration-200',
        compact 
          ? 'p-2 rounded-lg' 
          : 'flex-1 text-sm touch-target'
      ]"
    >
      <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span v-if="!compact" class="hidden sm:inline">X</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  author: string
  url?: string
  compact?: boolean
}

const props = defineProps<Props>()

const shareToFacebook = () => {
  const shareText = `「${props.title}」by ${props.author} - テクランBooksで技術書ランキングをチェック！`
  const shareUrl = props.url || window.location.href
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
  
  window.open(facebookUrl, 'facebook-share', 'width=600,height=400')
}

const shareToTwitter = () => {
  const shareText = `「${props.title}」by ${props.author} - テクランBooksで技術書ランキングをチェック！`
  const shareUrl = props.url || window.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  
  window.open(twitterUrl, 'twitter-share', 'width=600,height=400')
}
</script>