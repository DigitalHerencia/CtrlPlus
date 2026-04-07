import {
    getHfImg2ImgStrength,
    getHfModelName,
    getHfPreviewStrategy,
    getHfRetryCount,
    getHfSpaceId,
    withHfTimeout,
} from './client'
import { generateViaHfImg2Img } from './image-to-image-client'
import { mapHfError } from './map-hf-error'
import { generateViaHfSpace } from './space-client'
import type { GenerateWrapPreviewInput, GenerateWrapPreviewResult } from '@/types/visualizer.types'

/**
 * Dispatches to the correct HF backend based on `HF_PREVIEW_STRATEGY`:
 *
 *   space_inpaint   – Gradio Space; passes board + mask as a composite
 *                     conditioning input, equivalent to SD InpaintPipeline.
 *   image_to_image  – HF Inference API `imageToImage` task; uses `strength`
 *                     to control how many denoising timesteps are applied,
 *                     equivalent to SD Img2ImgPipeline. When a mask buffer
 *                     is present the API switches to masked-inpainting mode.
 */
async function runGenerationStrategy(
    input: GenerateWrapPreviewInput,
    model: string
): Promise<{ imageBuffer: Buffer; providerNote: string }> {
    const strategy = getHfPreviewStrategy()

    if (strategy === 'image_to_image') {
        const strength = input.strength ?? getHfImg2ImgStrength()
        const imageBuffer = await withHfTimeout(
            generateViaHfImg2Img({
                boardBuffer: input.boardBuffer,
                boardMaskBuffer: input.boardMaskBuffer,
                prompt: input.prompt,
                negativePrompt: input.negativePrompt,
                model,
                strength,
            })
        )
        return {
            imageBuffer,
            providerNote: `provider=huggingface-inference:img2img:strength=${strength}`,
        }
    }

    // Default: space_inpaint – delegate to the Gradio Space client.
    const imageBuffer = await withHfTimeout(
        generateViaHfSpace({
            boardBuffer: input.boardBuffer,
            boardMaskBuffer: input.boardMaskBuffer,
            prompt: input.prompt,
            negativePrompt: input.negativePrompt,
        })
    )
    return {
        imageBuffer,
        providerNote: `provider=huggingface-space:${getHfSpaceId()}`,
    }
}

export async function generateWrapPreview(
    input: GenerateWrapPreviewInput
): Promise<GenerateWrapPreviewResult> {
    const model = input.model || getHfModelName()
    const retries = getHfRetryCount()
    const notes = [...(input.notes ?? [])]

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            const { imageBuffer, providerNote } = await runGenerationStrategy(input, model)

            notes.push(providerNote)
            notes.push(`reference_count:${input.referenceUrls.length}`)

            return {
                imageBuffer,
                status: 'ok',
                finalImageUrl: null,
                maskUrl: input.maskUrl ?? null,
                referenceUrls: input.referenceUrls,
                model,
                prompt: input.prompt,
                notes,
            }
        } catch (error) {
            const mapped = mapHfError(error)
            if (attempt >= retries) {
                throw mapped
            }

            notes.push(`retry_${attempt + 1}:${mapped.message}`)
        }
    }

    throw mapHfError(new Error('provider_unavailable:Preview generation exhausted retries.'))
}
