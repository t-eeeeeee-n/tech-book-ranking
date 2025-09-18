export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    return {
      success: true,
      message: 'Test POST endpoint working',
      data: body,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Test POST error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Test endpoint failed'
    })
  }
})