import 'server-only'
import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    getVisualizerSelectableWrapById,
    listVisualizerSelectableWraps,
    type WrapVisibilityScope,
} from '@/lib/fetchers/catalog.fetchers'
import { visualizerUploadSnapshotFields, visualizerPreviewDTOFields } from '@/lib/db/selects/visualizer.selects'
import {
    toVisualizerPreviewDTO,
    toVisualizerUploadSnapshot,
} from '@/lib/fetchers/visualizer.mappers'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

export type { VisualizerUploadSnapshot } from '@/types/visualizer.types'

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

export async function listMyVisualizerUploads(limit = 50): Promise<VisualizerUploadSnapshot[]> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return []
    }

    requireCapability(session.authz, 'visualizer.use')

    const uploads = await prisma.visualizerUpload.findMany({
        where: {
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: visualizerUploadSnapshotFields,
    })

    return uploads.map(toVisualizerUploadSnapshot)
}

export async function getMyVisualizerUploadById(
    uploadId: string
): Promise<VisualizerUploadSnapshot | null> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return null
    }

    requireCapability(session.authz, 'visualizer.use')

    const upload = await prisma.visualizerUpload.findFirst({
        where: {
            id: uploadId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        select: visualizerUploadSnapshotFields,
    })

    return upload ? toVisualizerUploadSnapshot(upload) : null
}
