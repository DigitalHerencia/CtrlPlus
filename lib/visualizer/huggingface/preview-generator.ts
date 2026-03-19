import { InferenceClient } from '@huggingface/inference'

import { visualizerConfig } from '@/lib/visualizer/config'

export class HuggingFacePreviewUnavailableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HuggingFacePreviewUnavailableError'
    }
}

export interface WrapPreviewGeneratorInput {
    boardBuffer: Buffer
    prompt: string
    negativePrompt?: string | null
}

export interface WrapPreviewGeneratorAdapter {
    generate(input: WrapPreviewGeneratorInput): Promise<Buffer>
}

class HuggingFaceWrapPreviewAdapter implements WrapPreviewGeneratorAdapter {
    private readonly client: InferenceClient

    constructor() {
        if (!visualizerConfig.huggingFaceToken) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview generation is not configured.'
            )
        }

        if (!visualizerConfig.previewModel) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview model is not configured.'
            )
        }

        this.client = new InferenceClient(visualizerConfig.huggingFaceToken)
    }

    async generate(input: WrapPreviewGeneratorInput): Promise<Buffer> {
        const prompt = input.negativePrompt
            ? `${input.prompt}\nNegative prompt: ${input.negativePrompt}`
            : input.prompt

        const generationPromise = this.client.imageToImage({
            provider: visualizerConfig.previewProvider,
            model: visualizerConfig.previewModel,
            inputs: input.boardBuffer,
            parameters: {
                prompt,
            },
        })

        const result = await Promise.race([
            generationPromise,
            new Promise<never>((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new HuggingFacePreviewUnavailableError(
                                'Hugging Face preview generation timed out.'
                            )
                        ),
                    visualizerConfig.huggingFaceTimeoutMs
                )
            ),
        ]).catch((error: unknown) => {
            if (error instanceof HuggingFacePreviewUnavailableError) {
                throw error
            }

            const message = error instanceof Error ? error.message : 'Hugging Face preview failed.'
            throw new HuggingFacePreviewUnavailableError(message)
        })

        return Buffer.from(await result.arrayBuffer())
    }
}

export function createWrapPreviewGeneratorAdapter(): WrapPreviewGeneratorAdapter {
    return new HuggingFaceWrapPreviewAdapter()
}
