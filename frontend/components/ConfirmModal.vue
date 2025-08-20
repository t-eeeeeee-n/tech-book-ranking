<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('cancel')"></div>
    
    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all">
        <!-- Header -->
        <div class="px-6 pt-6">
          <div class="flex items-center">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div class="mt-3 text-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex justify-center space-x-3">
          <button
            @click="$emit('cancel')"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            type="button"
            :disabled="isConfirming"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isConfirming" class="flex items-center">
              <span class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              Deleting...
            </span>
            <span v-else>
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to perform this action? This cannot be undone.'
})

// Emits
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// State
const isConfirming = ref(false)

// Handle confirm action
const handleConfirm = async () => {
  isConfirming.value = true
  
  try {
    emit('confirm')
  } finally {
    // Reset the confirming state after a short delay to show the loading state
    setTimeout(() => {
      isConfirming.value = false
    }, 100)
  }
}
</script>