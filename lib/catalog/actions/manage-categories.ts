'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import {
    createWrapCategorySchema,
    setWrapCategoryMappingsSchema,
    updateWrapCategorySchema,
    type CreateWrapCategoryInput,
    type SetWrapCategoryMappingsInput,
    type UpdateWrapCategoryInput,
    type WrapCategoryDTO,
} from '../types'

export async function createWrapCategory(input: CreateWrapCategoryInput): Promise<WrapCategoryDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = createWrapCategorySchema.parse(input)

    const category = await prisma.wrapCategory.create({
        data: {
            name: parsed.name,
            slug: parsed.slug,
        },
        select: { id: true, name: true, slug: true },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.created',
            resourceType: 'WrapCategory',
            resourceId: category.id,
            details: JSON.stringify({ slug: category.slug }),
            timestamp: new Date(),
        },
    })

    return category
}

export async function updateWrapCategory(
    categoryId: string,
    input: UpdateWrapCategoryInput
): Promise<WrapCategoryDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapCategorySchema.parse(input)

    const result = await prisma.wrapCategory.updateMany({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        data: parsed,
    })

    if (result.count === 0) {
        throw new Error('Forbidden: category not found')
    }

    const category = await prisma.wrapCategory.findFirst({
        where: { id: categoryId, deletedAt: null },
        select: { id: true, name: true, slug: true },
    })

    if (!category) {
        throw new Error('Forbidden: category not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.updated',
            resourceType: 'WrapCategory',
            resourceId: category.id,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    return category
}

export async function deleteWrapCategory(categoryId: string): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrapCategory.updateMany({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: category not found')
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            categoryId,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.deleted',
            resourceType: 'WrapCategory',
            resourceId: categoryId,
            timestamp: new Date(),
        },
    })
}

export async function setWrapCategoryMappings(input: SetWrapCategoryMappingsInput): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = setWrapCategoryMappingsSchema.parse(input)

    const wrap = await prisma.wrap.findFirst({
        where: {
            id: parsed.wrapId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (!wrap) {
        throw new Error('Forbidden: wrap not found')
    }

    if (parsed.categoryIds.length > 0) {
        const categories = await prisma.wrapCategory.findMany({
            where: {
                id: { in: parsed.categoryIds },
                deletedAt: null,
            },
            select: { id: true },
        })

        if (categories.length !== parsed.categoryIds.length) {
            throw new Error('Forbidden: one or more categories not found')
        }
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            wrapId: parsed.wrapId,
        },
    })

    if (parsed.categoryIds.length > 0) {
        await prisma.wrapCategoryMapping.createMany({
            data: parsed.categoryIds.map((categoryId) => ({
                wrapId: parsed.wrapId,
                categoryId,
            })),
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.mappingsSet',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({ categoryIds: parsed.categoryIds }),
            timestamp: new Date(),
        },
    })
}
