import 'server-only'

import { prisma } from '@/lib/prisma'
import type { WrapCategoryDTO } from '../types'
import { getExampleWrapCategories } from './example-wraps'

export async function getWrapCategories(): Promise<WrapCategoryDTO[]> {
    const categories = await prisma.wrapCategory.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true },
    })

    const mergedCategories = [...categories, ...getExampleWrapCategories()]

    return mergedCategories
        .filter(
            (category, index, items) => items.findIndex((item) => item.id === category.id) === index
        )
        .sort((left, right) => left.name.localeCompare(right.name))
}
