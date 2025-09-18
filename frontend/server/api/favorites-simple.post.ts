export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, bookId } = body

    if (!userId || !bookId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'userId and bookId are required'
      })
    }

    // 仮のレスポンス（MongoDB接続なし）
    return {
      success: true,
      data: {
        _id: '64f8a1b2c3d4e5f6a7b8c9fb',
        userId: userId,
        bookId: bookId,
        createdAt: new Date().toISOString()
      },
      message: 'Book added to favorites successfully (mock)'
    }

  } catch (error) {
    console.error('Error adding to favorites:', error)

    // 既に定義されたエラーの場合はそのまま投げる
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add book to favorites'
    })
  }
})