<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-auto flex items-center justify-center">
          <Icon name="heroicons:book-open" class="w-12 h-12 text-blue-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access the TechBook Ranking admin panel
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your username"
              :disabled="isLoading"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">
              {{ errors.username }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your password"
              :disabled="isLoading"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Login Failed
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <span class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="heroicons:lock-closed" class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!-- Default Credentials Info (Development only) -->
        <div v-if="isDevelopment" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="heroicons:information-circle" class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Development Mode
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>Default credentials: <strong>admin</strong> / <strong>admin123</strong></p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: 'Admin Login - TechBook Ranking',
  meta: [
    { name: 'robots', content: 'noindex,nofollow' }
  ]
})

// Reactive state
const loginForm = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const errors = reactive({
  username: '',
  password: ''
})

// Runtime config
const config = useRuntimeConfig()
const isDevelopment = process.env.NODE_ENV === 'development'

// Auth composable
const { login } = useAuth()
const router = useRouter()

// Computed
const isFormValid = computed(() => {
  return loginForm.username.length >= 3 && loginForm.password.length >= 6
})

// Methods
const validateForm = () => {
  errors.username = ''
  errors.password = ''
  
  if (!loginForm.username.trim()) {
    errors.username = 'Username is required'
    return false
  }
  
  if (loginForm.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    return false
  }
  
  if (!loginForm.password) {
    errors.password = 'Password is required'
    return false
  }
  
  if (loginForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const success = await login({
      username: loginForm.username.trim(),
      password: loginForm.password
    })
    
    if (success) {
      // Get redirect URL from query or default to admin books
      const route = useRoute()
      const redirectTo = (route.query.redirect as string) || '/admin/books'
      await router.push(redirectTo)
    } else {
      errorMessage.value = 'Invalid username or password'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Clear errors when form values change
watch(() => loginForm.username, () => {
  if (errors.username) errors.username = ''
  if (errorMessage.value) errorMessage.value = ''
})

watch(() => loginForm.password, () => {
  if (errors.password) errors.password = ''
  if (errorMessage.value) errorMessage.value = ''
})

// Check if already logged in
onMounted(async () => {
  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()
  
  if (isAuthenticated) {
    await router.push('/admin/books')
  }
})
</script>