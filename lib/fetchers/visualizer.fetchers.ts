import "server-only"
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
