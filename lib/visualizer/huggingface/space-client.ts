import {
    getHfSpaceApiName,
    getHfSpaceId,
    getOptionalHfApiKey,
} from '@/lib/visualizer/huggingface/client'

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

type ViewApiResponse = {
    named_endpoints?: Record<
        string,
        {
            parameters?: Array<{ parameter_name?: string }>
        }
    >
}

function buildHandledFile(gradio: { handle_file: (input: Blob) => unknown }, buffer: Buffer) {
    return gradio.handle_file(new Blob([new Uint8Array(buffer)], { type: 'image/png' }))
}

function resolveParameterValue(
    parameterName: string,
    payload: {
        boardImage: unknown
        boardMask: unknown
        prompt: string
        negativePrompt: string
    }
) {
    const normalizedName = parameterName.toLowerCase()

    if (normalizedName === 'seed' || normalizedName.endsWith('_seed')) {
        return Math.floor(Math.random() * 1_000_000_000)
    }

    if (normalizedName.includes('randomize') && normalizedName.includes('seed')) {
        return true
    }

    if (normalizedName.includes('mask')) {
        return payload.boardMask
    }

    if (
        normalizedName === 'prompt' ||
        normalizedName === 'text_prompt' ||
        normalizedName === 'positive_prompt'
    ) {
        return payload.prompt
    }

    if (normalizedName === 'negative_prompt' || normalizedName === 'negative') {
        return payload.negativePrompt
    }

    if (
        normalizedName.includes('image') ||
        normalizedName.includes('board') ||
        normalizedName.includes('source')
    ) {
        return payload.boardImage
    }

    return null
}

function buildPredictPayload(
    parameterNames: string[],
    payload: {
        boardImage: unknown
        boardMask: unknown
        prompt: string
        negativePrompt: string
    }
) {
    if (parameterNames.length === 0) {
        return [payload.boardImage, payload.boardMask, payload.prompt, payload.negativePrompt]
    }

    return parameterNames.map((parameterName) => {
        const resolved = resolveParameterValue(parameterName, payload)

        return resolved
    })
}

export async function generateViaHfSpace(input: {
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    prompt: string
    negativePrompt: string
}): Promise<Buffer> {
    const spaceId = getHfSpaceId()

    const moduleName = '@gradio/client'
    const gradio = (await import(/* webpackIgnore: true */ moduleName)) as {
        Client: {
            connect: (spaceId: string, options?: Record<string, unknown>) => Promise<unknown>
        }
        handle_file: (input: Blob) => unknown
    }

    const apiName = getHfSpaceApiName()
    const hfToken = getOptionalHfApiKey()
    const app = (await gradio.Client.connect(spaceId, hfToken ? { hf_token: hfToken } : {})) as {
        predict: (apiName: string, payload: unknown[]) => Promise<unknown>
        view_api?: () => Promise<unknown>
    }

    const payload = {
        boardImage: buildHandledFile(gradio, input.boardBuffer),
        boardMask: buildHandledFile(gradio, input.boardMaskBuffer),
        prompt: input.prompt,
        negativePrompt: input.negativePrompt,
    }
    const viewApi = (
        typeof app.view_api === 'function' ? await app.view_api() : null
    ) as ViewApiResponse | null
    const parameterNames =
        viewApi?.named_endpoints?.[apiName]?.parameters
            ?.map((parameter) => parameter.parameter_name ?? '')
            .filter(Boolean) ?? []

    const response = await app.predict(apiName, buildPredictPayload(parameterNames, payload))

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
