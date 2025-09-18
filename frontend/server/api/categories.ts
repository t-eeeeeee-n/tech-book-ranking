export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    // Proxy to backend API
    const backendUrl = `${config.public.backendUrl}/api/categories`

    const response = await $fetch(backendUrl, {
      method: "GET",
      headers: {
        "x-api-key": config.private.backendApiKey
      },
      query: query
    })

    return response
  } catch (error) {
    console.error("Error proxying categories request:", error)

    // Forward the error from backend with proper status code
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch categories"
    })
  }
})
