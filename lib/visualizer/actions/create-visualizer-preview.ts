'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { getVisualizerWrapSelectionById } from '@/lib/visualizer/fetchers/get-wrap-selections'
import {
    createWrapPreviewGeneratorAdapter,
    HuggingFacePreviewUnavailableError,
} from '@/lib/visualizer/huggingface'
import {
    buildPreviewConditioningBoard,
    buildWrapPreviewPrompt,
    generateDeterministicCompositePreview,
    normalizeVehicleUpload,
    readImageBufferFromUrl,
} from '@/lib/visualizer/preview-pipeline'
import { storePreviewImage } from '@/lib/visualizer/storage'
import { visualizerConfig } from '@/lib/visualizer/config'
import { buildVisualizerCacheKey } from '@/lib/visualizer/cache-key'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import {
    createVisualizerPreviewSchema,
    type CreateVisualizerPreviewInput,
    type VisualizerPreviewDTO,
} from '../types'

async function generatePreviewResult(params: {
    previewId: string
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    wrap: Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>
}) {
    if (!params.wrap) {
        throw new Error('Wrap not found.')
    }

    const prompt = buildWrapPreviewPrompt({
        name: params.wrap.name,
        description: params.wrap.description,
        aiPromptTemplate: params.wrap.aiPromptTemplate,
        aiNegativePrompt: params.wrap.aiNegativePrompt,
    })

    try {
        const adapter = createWrapPreviewGeneratorAdapter()
        const boardBuffer = await buildPreviewConditioningBoard({
            vehicleBuffer: params.vehicleBuffer,
            textureBuffer: params.textureBuffer,
            wrapName: params.wrap.name,
            wrapDescription: params.wrap.description,
        })
        const generatedBuffer = await adapter.generate({
            boardBuffer,
            prompt: prompt.prompt,
            negativePrompt: prompt.negativePrompt,
        })

        return {
            processedImageUrl: await storePreviewImage({
                previewId: params.previewId,
                buffer: generatedBuffer,
                contentType: 'image/png',
            }),
            promptVersion: prompt.promptVersion,
            generationFallbackReason: null as string | null,
        }
    } catch (error) {
        const fallbackReason =
            error instanceof HuggingFacePreviewUnavailableError
                ? error.message
                : error instanceof Error
                  ? error.message
                  : 'Hugging Face preview generation failed.'

        return {
            processedImageUrl: await generateDeterministicCompositePreview({
                previewId: params.previewId,
                photoBuffer: params.vehicleBuffer,
                textureBuffer: params.textureBuffer,
            }),
            promptVersion: prompt.promptVersion,
            generationFallbackReason: fallbackReason,
        }
    }
}

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

    const textureBuffer = await readImageBufferFromUrl(wrap.visualizerTextureImage.url)
    const prompt = buildWrapPreviewPrompt({
        name: wrap.name,
        description: wrap.description,
        aiPromptTemplate: wrap.aiPromptTemplate,
        aiNegativePrompt: wrap.aiNegativePrompt,
    })

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
            status: 'processing',
            cacheKey,
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
        },
    })

    try {
        const result = await generatePreviewResult({
            previewId: preview.id,
            vehicleBuffer: normalizedVehicle.buffer,
            textureBuffer,
            wrap,
        })

        const completedPreview = await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'complete',
                processedImageUrl: result.processedImageUrl,
                expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'visualizerPreview.created',
                resourceType: 'VisualizerPreview',
                resourceId: completedPreview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey,
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

        const message = error instanceof Error ? error.message : 'Preview generation failed.'
        throw new Error(message)
    }
}
