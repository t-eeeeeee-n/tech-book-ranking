<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transform transition-all">
        <!-- Header -->
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? 'Edit Book' : 'Add New Book' }}
          </h3>
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter book title"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Author -->
          <div>
            <label for="author" class="block text-sm font-medium text-gray-700 mb-1">
              Author(s) *
            </label>
            <input
              id="author"
              v-model="authorText"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author names (comma-separated for multiple authors)"
            />
            <p class="mt-1 text-xs text-gray-500">
              For multiple authors, separate with commas (e.g., "John Doe, Jane Smith")
            </p>
            <p v-if="errors.author" class="mt-1 text-sm text-red-600">{{ errors.author }}</p>
          </div>

          <!-- ISBN -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="isbn10" class="block text-sm font-medium text-gray-700 mb-1">
                ISBN-10
              </label>
              <input
                id="isbn10"
                v-model="form.isbn10"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 0123456789"
              />
            </div>
            <div>
              <label for="isbn13" class="block text-sm font-medium text-gray-700 mb-1">
                ISBN-13
              </label>
              <input
                id="isbn13"
                v-model="form.isbn13"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 9780123456789"
              />
            </div>
          </div>

          <!-- Publisher and Published Year -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="publisher" class="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                id="publisher"
                v-model="form.publisher"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., O'Reilly Media"
              />
            </div>
            <div>
              <label for="publishedYear" class="block text-sm font-medium text-gray-700 mb-1">
                Published Year
              </label>
              <input
                id="publishedYear"
                v-model.number="form.publishedYear"
                type="number"
                min="1900"
                :max="currentYear"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2024"
              />
            </div>
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="web-development">Web Development</option>
              <option value="ai-ml">AI/ML</option>
              <option value="mobile">Mobile</option>
              <option value="devops">DevOps</option>
              <option value="data-science">Data Science</option>
              <option value="database">Database</option>
              <option value="networking">Networking</option>
              <option value="security">Security</option>
              <option value="ui-ux">UI/UX</option>
              <option value="career">Career</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="tags"
              v-model="tagsText"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags (comma-separated, e.g., JavaScript, React, Frontend)"
            />
            <p class="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          <!-- URLs -->
          <div class="space-y-4">
            <div>
              <label for="amazonUrl" class="block text-sm font-medium text-gray-700 mb-1">
                Amazon URL
              </label>
              <input
                id="amazonUrl"
                v-model="form.amazonUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://amazon.co.jp/..."
              />
            </div>
            <div>
              <label for="rakutenUrl" class="block text-sm font-medium text-gray-700 mb-1">
                Rakuten URL
              </label>
              <input
                id="rakutenUrl"
                v-model="form.rakutenUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://books.rakuten.co.jp/..."
              />
            </div>
            <div>
              <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">
                Book Cover Image URL
              </label>
              <input
                id="imageUrl"
                v-model="form.imageUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/book-cover.jpg"
              />
              <div v-if="form.imageUrl" class="mt-2">
                <img
                  :src="form.imageUrl"
                  alt="Book cover preview"
                  class="h-20 w-auto object-cover rounded border border-gray-200"
                  @error="imageError = true"
                />
                <p v-if="imageError" class="mt-1 text-sm text-red-600">
                  Unable to load image from this URL
                </p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the book..."
            ></textarea>
          </div>

          <!-- Status (for editing only) -->
          <div v-if="isEditing">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <span class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              Saving...
            </span>
            <span v-else>
              {{ isEditing ? 'Update Book' : 'Create Book' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

// Props and emits
interface Props {
  book?: Book | null
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  isEditing: false
})

const emit = defineEmits<{
  close: []
  save: [bookData: Partial<Book>]
}>()

// Reactive state
const isSubmitting = ref(false)
const imageError = ref(false)
const currentYear = new Date().getFullYear()

// Form data
const form = reactive({
  title: '',
  author: [] as string[],
  isbn10: '',
  isbn13: '',
  publisher: '',
  publishedYear: null as number | null,
  category: '',
  tags: [] as string[],
  amazonUrl: '',
  rakutenUrl: '',
  imageUrl: '',
  description: '',
  status: 'active'
})

// Computed properties for string representations
const authorText = computed({
  get: () => Array.isArray(form.author) ? form.author.join(', ') : form.author,
  set: (value: string) => {
    form.author = value.split(',').map(s => s.trim()).filter(Boolean)
  }
})

const tagsText = computed({
  get: () => Array.isArray(form.tags) ? form.tags.join(', ') : form.tags,
  set: (value: string) => {
    form.tags = value.split(',').map(s => s.trim()).filter(Boolean)
  }
})

// Validation errors
const errors = ref<Record<string, string>>({})

// Initialize form with book data if editing
const initializeForm = () => {
  if (props.book) {
    form.title = props.book.title || ''
    form.author = Array.isArray(props.book.author) ? props.book.author : [props.book.author || '']
    form.isbn10 = props.book.isbn10 || ''
    form.isbn13 = props.book.isbn13 || ''
    form.publisher = props.book.publisher || ''
    form.publishedYear = props.book.publishedYear || null
    form.category = Array.isArray(props.book.category) ? props.book.category[0] : props.book.category || ''
    form.tags = Array.isArray(props.book.tags) ? props.book.tags : []
    form.amazonUrl = props.book.amazonUrl || ''
    form.rakutenUrl = props.book.rakutenUrl || ''
    form.imageUrl = props.book.imageUrl || ''
    form.description = props.book.description || ''
    form.status = props.book.status || 'active'
  }
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!form.author.length || !form.author[0]) {
    errors.value.author = 'At least one author is required'
  }
  
  if (!form.category) {
    errors.value.category = 'Category is required'
  }
  
  // Validate ISBN format if provided
  if (form.isbn10 && !/^\d{10}$/.test(form.isbn10.replace(/[-\s]/g, ''))) {
    errors.value.isbn10 = 'Invalid ISBN-10 format'
  }
  
  if (form.isbn13 && !/^\d{13}$/.test(form.isbn13.replace(/[-\s]/g, ''))) {
    errors.value.isbn13 = 'Invalid ISBN-13 format'
  }
  
  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Prepare data
    const bookData: Partial<Book> = {
      title: form.title.trim(),
      author: form.author.filter(Boolean),
      isbn10: form.isbn10 || undefined,
      isbn13: form.isbn13 || undefined,
      publisher: form.publisher || undefined,
      publishedYear: form.publishedYear || undefined,
      category: [form.category],
      tags: form.tags.filter(Boolean),
      amazonUrl: form.amazonUrl || undefined,
      rakutenUrl: form.rakutenUrl || undefined,
      imageUrl: form.imageUrl || undefined,
      description: form.description || undefined,
      status: form.status as 'active' | 'inactive' | 'merged'
    }
    
    // Remove undefined values
    Object.keys(bookData).forEach(key => {
      if (bookData[key as keyof Book] === undefined) {
        delete bookData[key as keyof Book]
      }
    })
    
    emit('save', bookData)
  } catch (error) {
    console.error('Error preparing book data:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Reset image error when URL changes
watch(() => form.imageUrl, () => {
  imageError.value = false
})

// Initialize form when component mounts or book prop changes
onMounted(initializeForm)
watch(() => props.book, initializeForm)
</script>