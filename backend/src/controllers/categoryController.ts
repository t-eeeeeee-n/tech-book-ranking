import { Request, Response } from 'express'
import { Category } from '@/models'
import { asyncHandler } from '@/middleware/errorHandler'

class CategoryController {
    getCategories = asyncHandler(async (req: Request, res: Response) => {
        const { includeInactive, parentId } = req.query

        // Build query based on filters
        const query: any = {}

        // Filter by active status
        if (includeInactive !== 'true') {
            query.isActive = true
        }

        // Filter by parent ID
        if (parentId !== undefined) {
            if (parentId === 'null' || parentId === '') {
                query.parentId = null
            } else {
                query.parentId = parentId
            }
        }

        const categories = await Category.find(query)
            .sort({ displayOrder: 1, name: 1 })
            .lean()
            .exec()

        // Transform to the format expected by the frontend
        const transformedCategories = categories.map(category => ({
            value: category.slug,
            label: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
            bookCount: category.bookCount
        }))

        res.json({
            success: true,
            data: transformedCategories,
            meta: {
                total: categories.length,
                lastUpdated: new Date().toISOString()
            }
        })
    })

    getCategoryById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params
        
        const category = await Category.findOne({
            $or: [
                { _id: id },
                { slug: id }
            ]
        }).lean().exec()

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }

        return res.json({
            success: true,
            data: {
                ...category,
                _id: category._id.toString()
            }
        })
    })
}

export default new CategoryController()