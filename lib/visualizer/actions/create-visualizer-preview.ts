'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { getVisualizerWrapSelectionById } from '@/lib/visualizer/fetchers/get-wrap-selections'
import { buildVisualizerPromptForWrap } from '@/lib/visualizer/preview-execution'
import { normalizeVehicleUpload } from '@/lib/visualizer/preview-pipeline'
import { storePreviewImage } from '@/lib/visualizer/storage'
import { visualizerConfig } from '@/lib/visualizer/config'
import { buildVisualizerCacheKey } from '@/lib/visualizer/cache-key'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import {
    createVisualizerPreviewSchema,
    type CreateVisualizerPreviewInput,
    type VisualizerPreviewDTO,
} from '../types'

export async function createVisualizerPreview(
    input: CreateVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = createVisualizerPreviewSchema.parse(input)
    const normalizedVehicle = await normalizeVehicleUpload(parsed.file)
    const includeHidden = session.isOwner || session.isPlatformAdmin

    const wrap = await getVisualizerWrapSelectionById(parsed.wrapId, { includeHidden })
    if (!wrap) {
        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    const prompt = buildVisualizerPromptForWrap(wrap)

    const cacheKey = buildVisualizerCacheKey({
        wrapId: wrap.id,
        ownerUserId: userId,
        customerPhotoHash: normalizedVehicle.hash,
        sourceWrapImageId: wrap.visualizerTextureImage.id,
        sourceAssetVersion: wrap.visualizerTextureImage.version,
        generationMode: 'hf-primary-with-deterministic-fallback',
        generationModel: visualizerConfig.previewModel || 'deterministic-fallback',
        promptVersion: prompt.promptVersion,
        blendMode: visualizerConfig.blendMode,
        opacity: visualizerConfig.overlayOpacity,
    })

    const reusablePreview = await prisma.visualizerPreview.findFirst({
        where: {
            cacheKey,
            ownerClerkUserId: userId,
            deletedAt: null,
            status: 'complete',
            processedImageUrl: {
                not: null,
            },
            expiresAt: {
                gt: new Date(),
            },
        },
    })

    if (reusablePreview) {
        return toVisualizerPreviewDTO(reusablePreview)
    }

    const customerPhotoUrl = await storePreviewImage({
        previewId: `vehicle-${cacheKey}`,
        buffer: normalizedVehicle.buffer,
        contentType: normalizedVehicle.contentType,
    })

    const preview = await prisma.visualizerPreview.create({
        data: {
            wrapId: wrap.id,
            ownerClerkUserId: userId,
            customerPhotoUrl,
            processedImageUrl: null,
            status: 'pending',
            cacheKey,
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.created',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: wrap.id,
                cacheKey,
                promptVersion: prompt.promptVersion,
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            }),
            timestamp: new Date(),
        },
    })

    return toVisualizerPreviewDTO(preview)
}
