<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Books Management</h1>
          <p class="mt-2 text-sm text-gray-700">
            Manage tech books in the ranking system
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
          <!-- User info -->
          <div class="text-sm text-gray-600 mb-2 sm:mb-0">
            Welcome, <strong>{{ user?.username }}</strong>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="handleLogout"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
              Logout
            </button>
            
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Add Book
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Search Books
            </label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, author, or ISBN..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              @input="debouncedSearch"
            />
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              v-model="selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              @change="fetchBooks"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="web-development">Web Development</option>
              <option value="ai-ml">AI/ML</option>
              <option value="mobile">Mobile</option>
              <option value="devops">DevOps</option>
              <option value="data-science">Data Science</option>
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              v-model="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              @change="fetchBooks"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Books Table -->
      <div v-else-if="books?.length" class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentions
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img
                        v-if="book.imageUrl"
                        :src="book.imageUrl"
                        :alt="book.title"
                        class="h-12 w-8 object-cover rounded mr-4"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ book.title }}
                        </p>
                        <p v-if="book.isbn13" class="text-xs text-gray-500">
                          ISBN: {{ book.isbn13 }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ Array.isArray(book.author) ? book.author.join(', ') : book.author }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {{ Array.isArray(book.category) ? book.category[0] : book.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ book.mentionCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        book.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ book.status || 'active' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openEditModal(book)"
                      class="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Icon name="heroicons:pencil" class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmDeleteBook(book)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
              {{ pagination.total }} books
            </div>
            <div class="flex space-x-1">
              <button
                v-if="pagination.hasPrev"
                @click="changePage(pagination.page - 1)"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                v-if="pagination.hasNext"
                @click="changePage(pagination.page + 1)"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white shadow sm:rounded-md p-12 text-center">
        <Icon name="heroicons:book-open" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No books found</h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery ? 'No books match your search criteria.' : 'Get started by adding your first book.' }}
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Add Book
        </button>
      </div>
    </div>

    <!-- Book Modal -->
    <BookModal
      v-if="showModal"
      :book="selectedBook"
      :is-editing="isEditing"
      @close="closeModal"
      @save="handleSaveBook"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :title="'Delete Book'"
      :message="`Are you sure you want to delete '${bookToDelete?.title}'? This action cannot be undone.`"
      @confirm="handleDeleteBook"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Book, BooksListApiResponse } from '~/types'

// Auth middleware
definePageMeta({
  middleware: 'admin'
})

// Meta and title
useHead({
  title: 'Books Management - Admin',
  meta: [
    { name: 'description', content: 'Manage tech books in the ranking system' },
    { name: 'robots', content: 'noindex,nofollow' }
  ]
})

// Reactive state
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const limit = ref(20)

const showModal = ref(false)
const isEditing = ref(false)
const selectedBook = ref<Book | null>(null)

const showDeleteModal = ref(false)
const bookToDelete = ref<Book | null>(null)

// Auth
const { authenticatedFetch, user, logout } = useAuth()

// Fetch books data
const { data: response, pending, refresh } = await useLazyFetch<BooksListApiResponse>('/api/books', {
  server: false,
  query: computed(() => ({
    page: currentPage.value,
    limit: limit.value,
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    status: selectedStatus.value || undefined
  })),
  credentials: 'include'
})

// Computed properties
const books = computed(() => response.value?.data || [])
const pagination = computed(() => response.value?.pagination)

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  refresh()
}, 500)

// Methods
const fetchBooks = () => {
  currentPage.value = 1
  refresh()
}

const changePage = (page: number) => {
  currentPage.value = page
  refresh()
}

const openCreateModal = () => {
  selectedBook.value = null
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (book: Book) => {
  selectedBook.value = book
  isEditing.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedBook.value = null
}

const handleSaveBook = async (bookData: Partial<Book>) => {
  try {
    let response

    if (isEditing.value && selectedBook.value) {
      // Update existing book
      response = await authenticatedFetch(`/api/books/${selectedBook.value._id || selectedBook.value.id}`, {
        method: 'PUT',
        body: bookData
      })
    } else {
      // Create new book
      response = await authenticatedFetch('/api/books', {
        method: 'POST',
        body: bookData
      })
    }

    if (response) {
      closeModal()
      refresh()
      
      // Show success message
      const message = isEditing.value ? 'Book updated successfully' : 'Book created successfully'
    }
  } catch (error) {
    console.error('Error saving book:', error)
    // Note: You could add error handling/notification here
  }
}

const confirmDeleteBook = (book: Book) => {
  bookToDelete.value = book
  showDeleteModal.value = true
}

const handleDeleteBook = async () => {
  if (!bookToDelete.value) return

  try {
    await authenticatedFetch(`/api/books/${bookToDelete.value._id || bookToDelete.value.id}`, {
      method: 'DELETE'
    })

    showDeleteModal.value = false
    bookToDelete.value = null
    refresh()

  } catch (error) {
    console.error('Error deleting book:', error)
    showDeleteModal.value = false
  }
}

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>