import { mockDatabase } from '../../utils/mockDatabase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
    const batchType = query.batchType as string
    const status = query.status as string

    let logs = [...mockDatabase.batch_logs]

    // Filter by batch type
    if (batchType && batchType !== 'all') {
      logs = logs.filter(log => log.batchType === batchType)
    }

    // Filter by status
    if (status && status !== 'all') {
      logs = logs.filter(log => log.status === status)
    }

    // Sort by created date (newest first)
    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = logs.slice(startIndex, endIndex)

    return {
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        limit,
        total: logs.length,
        totalPages: Math.ceil(logs.length / limit),
        hasMore: endIndex < logs.length,
        hasNext: page < Math.ceil(logs.length / limit),
        hasPrev: page > 1
      },
      meta: {
        totalLogs: mockDatabase.batch_logs.length,
        filteredCount: logs.length,
        appliedFilters: {
          batchType: batchType || null,
          status: status || null
        },
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        success: false,
        error: 'Failed to fetch batch logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})