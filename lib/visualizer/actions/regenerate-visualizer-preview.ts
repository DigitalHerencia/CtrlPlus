'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { visualizerConfig } from '@/lib/visualizer/config'
import { getVisualizerWrapSelectionById } from '@/lib/visualizer/fetchers/get-wrap-selections'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import {
    regenerateVisualizerPreviewSchema,
    type RegenerateVisualizerPreviewInput,
    type VisualizerPreviewDTO,
} from '../types'

export async function regenerateVisualizerPreview(
    input: RegenerateVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = regenerateVisualizerPreviewSchema.parse(input)
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: parsed.previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
    })

    if (!preview) {
        throw new Error('Preview not found.')
    }

    const wrap = await getVisualizerWrapSelectionById(preview.wrapId, {
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })
    if (!wrap) {
        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    const resetPreview = await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'pending',
            processedImageUrl: null,
            expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.regenerated',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: wrap.id,
                cacheKey: preview.cacheKey,
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            }),
            timestamp: new Date(),
        },
    })

    return toVisualizerPreviewDTO(resetPreview)
}
