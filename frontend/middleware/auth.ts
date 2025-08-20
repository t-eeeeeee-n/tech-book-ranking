export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check on server-side to avoid hydration issues
  if (process.server) return

  const { checkAuth } = useAuth()
  
  try {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      return navigateTo({
        path: '/admin/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    // On error, redirect to login
    return navigateTo('/admin/login')
  }
})