'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { getVisualizerWrapSelectionById } from '@/lib/visualizer/fetchers/get-wrap-selections'
import {
    executeVisualizerPreviewGeneration,
    resolveVisualizerGenerationAssets,
} from '@/lib/visualizer/preview-execution'
import { readPhotoBuffer } from '@/lib/visualizer/preview-pipeline'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import { visualizerConfig } from '@/lib/visualizer/config'
import {
    processVisualizerPreviewSchema,
    type ProcessVisualizerPreviewInput,
    type VisualizerPreviewDTO,
} from '../types'

export async function processVisualizerPreview(
    input: ProcessVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = processVisualizerPreviewSchema.parse(input)
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

    if (preview.status === 'complete' && preview.processedImageUrl) {
        return toVisualizerPreviewDTO(preview)
    }

    const wrap = await getVisualizerWrapSelectionById(preview.wrapId, {
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })
    if (!wrap) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
            },
        })

        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'processing',
            processedImageUrl: null,
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
        },
    })

    try {
        const [{ buffer: vehicleBuffer }, { textureBuffer, prompt }] = await Promise.all([
            readPhotoBuffer(preview.customerPhotoUrl),
            resolveVisualizerGenerationAssets(wrap),
        ])

        const result = await executeVisualizerPreviewGeneration({
            previewId: preview.id,
            vehicleBuffer,
            textureBuffer,
            wrap,
            prompt,
        })

        const completedPreview = await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'complete',
                processedImageUrl: result.processedImageUrl,
                expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'visualizerPreview.processed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    promptVersion: result.promptVersion,
                    sourceWrapImageId: wrap.visualizerTextureImage.id,
                    sourceWrapImageVersion: wrap.visualizerTextureImage.version,
                    generationFallbackReason: result.generationFallbackReason,
                }),
                timestamp: new Date(),
            },
        })

        return toVisualizerPreviewDTO(completedPreview)
    } catch (error) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'visualizerPreview.processingFailed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    sourceWrapImageId: wrap.visualizerTextureImage.id,
                    sourceWrapImageVersion: wrap.visualizerTextureImage.version,
                    error: error instanceof Error ? error.message : 'Preview generation failed.',
                }),
                timestamp: new Date(),
            },
        })

        throw new Error(
            error instanceof Error ? error.message : 'Preview generation failed.'
        )
    }
}
