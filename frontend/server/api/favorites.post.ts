export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // Proxy to backend API
    const backendUrl = `${config.public.backendUrl}/api/favorites`

    const response = await $fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.private.backendApiKey
      },
      body: body
    })

    return response
  } catch (error) {
    console.error('Error proxying favorites post request:', error)

    // Forward the error from backend with proper status code
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add favorite'
    })
  }
})