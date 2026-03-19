import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { type VisualizerPreviewDTO, visualizerPreviewDTOFields, type PreviewStatus } from '../types'

function toPreviewDTO(record: {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}): VisualizerPreviewDTO {
    return {
        id: record.id,
        wrapId: record.wrapId,
        customerPhotoUrl: record.customerPhotoUrl,
        processedImageUrl: record.processedImageUrl,
        status: record.status as PreviewStatus,
        cacheKey: record.cacheKey,
        sourceWrapImageId: record.sourceWrapImageId,
        sourceWrapImageVersion: record.sourceWrapImageVersion,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    }
}

export async function getPreviewById(previewId: string): Promise<VisualizerPreviewDTO | null> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return null
    }
    requireCapability(session.authz, 'visualizer.use')

    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        select: visualizerPreviewDTOFields,
    })

    return preview ? toPreviewDTO(preview) : null
}

export async function getPreviewsByWrap(wrapId: string): Promise<VisualizerPreviewDTO[]> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return []
    }
    requireCapability(session.authz, 'visualizer.use')

    const previews = await prisma.visualizerPreview.findMany({
        where: {
            wrapId,
            ownerClerkUserId: userId,
            deletedAt: null,
            expiresAt: {
                gt: new Date(),
            },
        },
        orderBy: { createdAt: 'desc' },
        select: visualizerPreviewDTOFields,
    })

    return previews.map(toPreviewDTO)
}
