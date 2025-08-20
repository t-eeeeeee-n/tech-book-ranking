export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side
  if (process.server) return

  const { checkAuth, hasRole } = useAuth()
  
  try {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
      return navigateTo({
        path: '/admin/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    
    // Check if user has admin role
    if (!hasRole('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  } catch (error) {
    console.error('Admin middleware error:', error)
    
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 403) {
      throw error
    }
    
    // On auth error, redirect to login
    return navigateTo('/admin/login')
  }
})