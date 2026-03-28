import 'server-only'

import { getVisualizerWrapSelectionById } from '@/lib/fetchers/visualizer.fetchers'
import {
    createWrapPreviewGeneratorAdapter,
    HuggingFacePreviewUnavailableError,
} from '@/lib/visualizer/huggingface'
import {
    buildPreviewConditioningBoard,
    buildWrapPreviewPrompt,
    generateDeterministicCompositePreview,
    readImageBufferFromUrl,
} from '@/lib/visualizer/preview-pipeline'
import { storePreviewImage } from '@/lib/visualizer/storage'

export interface VisualizerGenerationAssets {
    textureBuffer: Buffer
    prompt: ReturnType<typeof buildWrapPreviewPrompt>
}

export function buildVisualizerPromptForWrap(
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
) {
    return buildWrapPreviewPrompt({
        name: wrap.name,
        description: wrap.description,
        aiPromptTemplate: wrap.aiPromptTemplate,
        aiNegativePrompt: wrap.aiNegativePrompt,
    })
}

export async function resolveVisualizerGenerationAssets(
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
): Promise<VisualizerGenerationAssets> {
    const [textureBuffer, prompt] = await Promise.all([
        readImageBufferFromUrl(wrap.visualizerTextureImage.url),
        Promise.resolve(buildVisualizerPromptForWrap(wrap)),
    ])

    return {
        textureBuffer,
        prompt,
    }
}

export async function executeVisualizerPreviewGeneration(params: {
    previewId: string
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
    prompt: ReturnType<typeof buildWrapPreviewPrompt>
}): Promise<{
    processedImageUrl: string
    promptVersion: string
    generationFallbackReason: string | null
}> {
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
            prompt: params.prompt.prompt,
            negativePrompt: params.prompt.negativePrompt,
        })

        return {
            processedImageUrl: await storePreviewImage({
                previewId: params.previewId,
                buffer: generatedBuffer,
                contentType: 'image/png',
            }),
            promptVersion: params.prompt.promptVersion,
            generationFallbackReason: null,
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
            promptVersion: params.prompt.promptVersion,
            generationFallbackReason: fallbackReason,
        }
    }
}
