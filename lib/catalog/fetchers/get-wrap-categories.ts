import { prisma } from '@/lib/prisma'
import type { WrapCategoryDTO } from '../types'

export async function getWrapCategories(): Promise<WrapCategoryDTO[]> {
    return prisma.wrapCategory.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true },
    })
}
