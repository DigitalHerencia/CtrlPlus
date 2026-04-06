import { getHfModelName, getHfRetryCount, getHfSpaceId, withHfTimeout } from './client'
import { mapHfError } from './map-hf-error'
import { generateViaHfSpace } from './space-client'
import type { GenerateWrapPreviewInput, GenerateWrapPreviewResult } from '@/types/visualizer.types'

export async function generateWrapPreview(
    input: GenerateWrapPreviewInput
): Promise<GenerateWrapPreviewResult> {
    const model = input.model || getHfModelName()
    const retries = getHfRetryCount()
    const notes: string[] = []

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            const imageBuffer = await withHfTimeout(
                generateViaHfSpace({
                    vehicleBuffer: input.vehicleBuffer,
                    referenceBuffers: input.referenceBuffers,
                    prompt: input.prompt,
                    negativePrompt: input.negativePrompt,
                })
            )

            notes.push(`provider=huggingface-space:${getHfSpaceId()}`)
            notes.push(`reference_count:${input.referenceBuffers.length}`)

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
