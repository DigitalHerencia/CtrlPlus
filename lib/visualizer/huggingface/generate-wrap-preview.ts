import { createHfClient, getHfModelName, withHfTimeout } from './client'
import { mapHfError } from './map-hf-error'
import type { GenerateWrapPreviewInput, GenerateWrapPreviewResult } from './types'

export async function generateWrapPreview(
    input: GenerateWrapPreviewInput
): Promise<GenerateWrapPreviewResult> {
    const model = input.model || getHfModelName()
    const client = createHfClient()

    try {
        const generation = client.imageToImage({
            model,
            inputs: new Blob([new Uint8Array(input.boardBuffer)], { type: 'image/png' }),
            parameters: {
                prompt: `${input.prompt}\nNegative prompt: ${input.negativePrompt}`,
            },
        })

        const result = await withHfTimeout(generation)

        return {
            imageBuffer: Buffer.from(await result.arrayBuffer()),
            model,
        }
    } catch (error) {
        throw mapHfError(error)
    }
}
