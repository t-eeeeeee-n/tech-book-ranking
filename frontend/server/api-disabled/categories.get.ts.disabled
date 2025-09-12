import { mockDatabase } from '../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const includeInactive = query.includeInactive === 'true'
    const parentId = query.parentId as string

    let categories = [...mockDatabase.categories]

    // Filter by active status
    if (!includeInactive) {
      categories = categories.filter(category => category.isActive)
    }

    // Filter by parent ID
    if (parentId !== undefined) {
      if (parentId === 'null' || parentId === '') {
        categories = categories.filter(category => category.parentId === null)
      } else {
        categories = categories.filter(category => category.parentId === parentId)
      }
    }

    // Sort by display order
    categories.sort((a, b) => a.displayOrder - b.displayOrder)

    // Transform to the format expected by the frontend
    const transformedCategories = categories.map(category => ({
      value: category.slug,
      label: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      bookCount: category.bookCount
    }))

    return {
      success: true,
      data: transformedCategories,
      meta: {
        total: categories.length,
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})