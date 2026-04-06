import {
    createHfClient,
    getHfModelName,
    getHfPreviewStrategy,
    getHfRetryCount,
    getHfSpaceId,
    withHfTimeout,
} from './client'
import { mapHfError } from './map-hf-error'
import { generateViaHfSpace } from './space-client'
import type { GenerateWrapPreviewInput, GenerateWrapPreviewResult } from '@/types/visualizer.types'

async function generateWithLegacyImageToImage(input: GenerateWrapPreviewInput, model: string) {
    const client = createHfClient()
    const generation = client.imageToImage({
        model,
        inputs: new Blob([new Uint8Array(input.boardBuffer)], { type: 'image/png' }),
        parameters: {
            prompt: `${input.prompt}\nNegative prompt: ${input.negativePrompt}`,
        },
    })

    const result = await withHfTimeout(generation)

    return Buffer.from(await result.arrayBuffer())
}

export async function generateWrapPreview(
    input: GenerateWrapPreviewInput
): Promise<GenerateWrapPreviewResult> {
    const model = input.model || getHfModelName()
    const strategy = getHfPreviewStrategy()
    const retries = getHfRetryCount()
    const notes: string[] = []

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            const imageBuffer =
                strategy === 'image_to_image'
                    ? await generateWithLegacyImageToImage(input, model)
                    : await withHfTimeout(
                          generateViaHfSpace({
                              boardBuffer: input.boardBuffer,
                              boardMaskBuffer: input.boardMaskBuffer,
                              prompt: input.prompt,
                              negativePrompt: input.negativePrompt,
                          })
                      )

            if (strategy === 'space_inpaint') {
                notes.push(`provider=huggingface-space:${getHfSpaceId()}`)
            } else {
                notes.push('provider=huggingface-image-to-image')
            }

            return {
                imageBuffer,
                status: 'ok',
                finalImageUrl: null,
                maskUrl: null,
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
