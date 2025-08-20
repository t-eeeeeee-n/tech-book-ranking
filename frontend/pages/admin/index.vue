<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Redirecting to admin dashboard...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth middleware
definePageMeta({
  middleware: 'admin'
})

// Auto-redirect to books management
await navigateTo('/admin/books', { replace: true })
</script>