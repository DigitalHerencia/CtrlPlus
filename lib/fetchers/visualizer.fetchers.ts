import 'server-only'
import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    getVisualizerSelectableWrapById,
    listVisualizerSelectableWraps,
    type WrapVisibilityScope,
} from '@/lib/fetchers/catalog.fetchers'
import { toVisualizerPreviewDTO } from '@/lib/fetchers/visualizer.mappers'
import { visualizerPreviewDTOFields } from '@/lib/db/selects/visualizer.selects'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export { type WrapVisibilityScope } from '@/lib/fetchers/catalog.fetchers'

export async function getVisualizerWrapSelectionById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
) {
    return getVisualizerSelectableWrapById(wrapId, scope)
}

export async function listVisualizerWrapSelections(scope: WrapVisibilityScope = {}) {
    return listVisualizerSelectableWraps(scope)
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

    return preview ? toVisualizerPreviewDTO(preview) : null
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

    return previews.map(toVisualizerPreviewDTO)
}

export async function listMyVisualizerPreviews(limit = 50): Promise<VisualizerPreviewDTO[]> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return []
    }

    requireCapability(session.authz, 'visualizer.use')

    const previews = await prisma.visualizerPreview.findMany({
        where: {
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: visualizerPreviewDTOFields,
    })

    return previews.map(toVisualizerPreviewDTO)
}

export interface VisualizerUploadSnapshot {
    id: string
    customerPhotoUrl: string
    wrapId: string
    createdAt: string
    updatedAt: string
}

export async function listMyVisualizerUploads(limit = 50): Promise<VisualizerUploadSnapshot[]> {
    const previews = await listMyVisualizerPreviews(limit)

    const uploadsById = new Map<string, VisualizerUploadSnapshot>()

    for (const preview of previews) {
        if (!uploadsById.has(preview.id)) {
            uploadsById.set(preview.id, {
                id: preview.id,
                customerPhotoUrl: preview.customerPhotoUrl,
                wrapId: preview.wrapId,
                createdAt: preview.createdAt,
                updatedAt: preview.updatedAt,
            })
        }
    }

    return [...uploadsById.values()]
}

export async function getMyVisualizerUploadById(
    uploadId: string
): Promise<VisualizerUploadSnapshot | null> {
    const preview = await getPreviewById(uploadId)

    if (!preview) {
        return null
    }

    return {
        id: preview.id,
        customerPhotoUrl: preview.customerPhotoUrl,
        wrapId: preview.wrapId,
        createdAt: preview.createdAt,
        updatedAt: preview.updatedAt,
    }
}
