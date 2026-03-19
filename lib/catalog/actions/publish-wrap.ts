'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/prisma'
import { getCatalogWrapById, getWrapById } from '../fetchers/get-wraps'
import { revalidateCatalogAndVisualizerPaths } from '../revalidation'
import type { WrapDTO } from '../types'
import { assertWrapIsPublishReady } from '../validators/publish-wrap'

export async function publishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const wrap = await getCatalogWrapById(wrapId, { includeHidden: true })

    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    assertWrapIsPublishReady(wrap.readiness)

    await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: false,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.published',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                readiness: wrap.readiness,
            }),
            timestamp: new Date(),
        },
    })

    const publishedWrap = await getWrapById(wrapId, { includeHidden: true })
    if (!publishedWrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return publishedWrap
}

export async function unpublishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: true,
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.unpublished',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                isHidden: true,
            }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(wrapId, { includeHidden: true })
    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return wrap
}
