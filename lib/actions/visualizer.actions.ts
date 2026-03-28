'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    getVisualizerWrapSelectionById,
} from '@/lib/fetchers/visualizer.fetchers'
import { buildVisualizerPromptForWrap } from '@/lib/visualizer/preview-execution'
import { normalizeVehicleUpload, readPhotoBuffer } from '@/lib/visualizer/preview-pipeline'
import { storePreviewImage } from '@/lib/visualizer/storage'
import { visualizerConfig } from '@/lib/visualizer/config'
import { buildVisualizerCacheKey } from '@/lib/visualizer/cache-key'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import {
    createVisualizerPreviewSchema,
    processVisualizerPreviewSchema,
    regenerateVisualizerPreviewSchema,
} from '@/schema/visualizer'
import type {
    CreateVisualizerPreviewInput,
    RegenerateVisualizerPreviewInput,
    ProcessVisualizerPreviewInput,
    GeneratePreviewInput,
    UploadPhotoInput,
    VisualizerPreviewDTO,
} from '@/types/visualizer'
import {
    executeVisualizerPreviewGeneration,
    resolveVisualizerGenerationAssets,
} from '@/lib/visualizer/preview-execution'

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

        throw new Error(error instanceof Error ? error.message : 'Preview generation failed.')
    }
}

export async function generatePreview(input: GeneratePreviewInput): Promise<VisualizerPreviewDTO> {
    return processVisualizerPreview(input)
}

export async function uploadAndGeneratePreview(
    input: UploadPhotoInput
): Promise<VisualizerPreviewDTO> {
    return createVisualizerPreview(input)
}

export async function uploadVehiclePhoto(input: UploadPhotoInput): Promise<VisualizerPreviewDTO> {
    return createVisualizerPreview(input)
}
