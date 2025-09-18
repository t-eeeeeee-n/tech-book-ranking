export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    // Proxy to backend API
    const backendUrl = `${config.public.backendUrl}/api/favorites`
    const searchParams = new URLSearchParams()

    // Forward query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, String(value))
      }
    })

    const response = await $fetch(`${backendUrl}?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'x-api-key': config.private.backendApiKey
      }
    })

    return response
  } catch (error) {
    console.error('Error proxying favorites request:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch favorites'
    })
  }
})