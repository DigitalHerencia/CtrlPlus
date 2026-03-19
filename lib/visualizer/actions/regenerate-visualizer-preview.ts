'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/prisma'
import { getVisualizerWrapSelectionById } from '@/lib/visualizer/fetchers/get-wrap-selections'
import { toVisualizerPreviewDTO } from '@/lib/visualizer/dto'
import { visualizerConfig } from '@/lib/visualizer/config'
import {
    createWrapPreviewGeneratorAdapter,
    HuggingFacePreviewUnavailableError,
} from '@/lib/visualizer/huggingface'
import {
    buildPreviewConditioningBoard,
    buildWrapPreviewPrompt,
    generateDeterministicCompositePreview,
    readImageBufferFromUrl,
    readPhotoBuffer,
} from '@/lib/visualizer/preview-pipeline'
import { storePreviewImage } from '@/lib/visualizer/storage'
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

    const vehicleBuffer = (await readPhotoBuffer(preview.customerPhotoUrl)).buffer
    const textureBuffer = await readImageBufferFromUrl(wrap.visualizerTextureImage.url)
    const prompt = buildWrapPreviewPrompt({
        name: wrap.name,
        description: wrap.description,
        aiPromptTemplate: wrap.aiPromptTemplate,
        aiNegativePrompt: wrap.aiNegativePrompt,
    })

    await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'processing',
            processedImageUrl: null,
        },
    })

    try {
        let processedImageUrl: string
        let fallbackReason: string | null = null

        try {
            const adapter = createWrapPreviewGeneratorAdapter()
            const boardBuffer = await buildPreviewConditioningBoard({
                vehicleBuffer,
                textureBuffer,
                wrapName: wrap.name,
                wrapDescription: wrap.description,
            })
            const generatedBuffer = await adapter.generate({
                boardBuffer,
                prompt: prompt.prompt,
                negativePrompt: prompt.negativePrompt,
            })
            processedImageUrl = await storePreviewImage({
                previewId: preview.id,
                buffer: generatedBuffer,
                contentType: 'image/png',
            })
        } catch (error) {
            fallbackReason =
                error instanceof HuggingFacePreviewUnavailableError
                    ? error.message
                    : error instanceof Error
                      ? error.message
                      : 'Hugging Face preview generation failed.'

            processedImageUrl = await generateDeterministicCompositePreview({
                previewId: preview.id,
                photoBuffer: vehicleBuffer,
                textureBuffer,
            })
        }

        const updatedPreview = await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'complete',
                processedImageUrl,
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
                    promptVersion: prompt.promptVersion,
                    sourceWrapImageId: wrap.visualizerTextureImage.id,
                    sourceWrapImageVersion: wrap.visualizerTextureImage.version,
                    generationFallbackReason: fallbackReason,
                }),
                timestamp: new Date(),
            },
        })

        return toVisualizerPreviewDTO(updatedPreview)
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
