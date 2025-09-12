import { mockDatabase } from '../../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          success: false,
          error: 'Category ID is required'
        }
      })
    }

    const category = mockDatabase.categories.find(c => c._id === id)

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        data: {
          success: false,
          error: 'Category not found'
        }
      })
    }

    // Get child categories
    const childCategories = mockDatabase.categories
      .filter(c => c.parentId === id && c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)

    // Get parent category if exists
    const parentCategory = category.parentId 
      ? mockDatabase.categories.find(c => c._id === category.parentId)
      : null

    return {
      success: true,
      data: {
        ...category,
        children: childCategories,
        parent: parentCategory
      },
      meta: {
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch category',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})