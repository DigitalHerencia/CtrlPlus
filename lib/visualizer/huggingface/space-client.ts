import { getHfSpaceApiName, getHfSpaceId } from '@/lib/visualizer/huggingface/client'

import { HuggingFaceGenerationError } from './map-hf-error'

async function fetchImageBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new HuggingFaceGenerationError(
            `space_response_invalid:Unable to fetch generated image (${response.status}).`
        )
    }

    return Buffer.from(await response.arrayBuffer())
}

function pickImageLikeValue(payload: unknown): string | Blob | null {
    if (!payload) {
        return null
    }

    if (typeof payload === 'string') {
        return payload
    }

    if (payload instanceof Blob) {
        return payload
    }

    if (Array.isArray(payload)) {
        for (const entry of payload) {
            const found = pickImageLikeValue(entry)
            if (found) {
                return found
            }
        }

        return null
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        const candidates = [record.url, record.path, record.image, record.value, record.data]
        for (const candidate of candidates) {
            const found = pickImageLikeValue(candidate)
            if (found) {
                return found
            }
        }
    }

    return null
}

export async function generateViaHfSpace(input: {
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    prompt: string
    negativePrompt: string
}): Promise<Buffer> {
    const spaceId = getHfSpaceId()
    if (!spaceId) {
        throw new HuggingFaceGenerationError('config_missing:HF_SPACE_ID is not configured.')
    }

    const moduleName = '@gradio/client'
    const gradio = (await import(moduleName)) as {
        Client: {
            connect: (spaceId: string, options?: Record<string, unknown>) => Promise<unknown>
        }
        handle_file: (input: Blob) => unknown
    }

    const apiName = getHfSpaceApiName()
    const hfToken = process.env.HF_API_KEY?.trim() || process.env.HUGGINGFACE_API_TOKEN?.trim()
    const app = (await gradio.Client.connect(spaceId, hfToken ? { hf_token: hfToken } : {})) as {
        predict: (apiName: string, payload: unknown[]) => Promise<unknown>
    }

    const imageFile = gradio.handle_file(
        new Blob([new Uint8Array(input.boardBuffer)], { type: 'image/png' })
    )
    const maskFile = gradio.handle_file(
        new Blob([new Uint8Array(input.boardMaskBuffer)], { type: 'image/png' })
    )

    const response = await app.predict(apiName, [
        imageFile,
        maskFile,
        input.prompt,
        input.negativePrompt,
    ])
    const imageLike = pickImageLikeValue(response)

    if (!imageLike) {
        throw new HuggingFaceGenerationError(
            'space_response_invalid:No image payload returned by HF Space.'
        )
    }

    if (typeof imageLike === 'string') {
        return fetchImageBuffer(imageLike)
    }

    return Buffer.from(await imageLike.arrayBuffer())
}
