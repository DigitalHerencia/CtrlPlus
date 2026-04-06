import sharp from 'sharp'

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

function clampDimension(value: number) {
    const rounded = Math.round(value / 32) * 32
    return Math.max(256, Math.min(1024, rounded))
}

async function getOutputDimensions(vehicleBuffer: Buffer) {
    const metadata = await sharp(vehicleBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        return { width: 768, height: 1024 }
    }

    const longestSide = Math.max(metadata.width, metadata.height)
    const scale = Math.min(1, 1024 / longestSide)

    return {
        width: clampDimension(metadata.width * scale),
        height: clampDimension(metadata.height * scale),
    }
}

type ViewApiResponse = {
    named_endpoints?: Record<
        string,
        {
            parameters?: Array<{ parameter_name?: string }>
        }
    >
}

function buildGalleryPayload(
    gradio: { handle_file: (input: Blob) => unknown },
    input: { vehicleBuffer: Buffer; referenceBuffers: Buffer[] }
) {
    const sourceBuffers = [input.vehicleBuffer, ...input.referenceBuffers.slice(0, 3)]

    return sourceBuffers.map((buffer, index) => ({
        image: gradio.handle_file(new Blob([new Uint8Array(buffer)], { type: 'image/png' })),
        caption: index === 0 ? 'source vehicle photo' : `wrap reference ${index}`,
    }))
}

export async function generateViaHfSpace(input: {
    vehicleBuffer: Buffer
    referenceBuffers: Buffer[]
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
    const hfToken = process.env.HF_API_KEY?.trim() || process.env.HUGGINGFACE_API_TOKEN?.trim()
    const app = (await gradio.Client.connect(spaceId, hfToken ? { hf_token: hfToken } : {})) as {
        predict: (apiName: string, payload: unknown[]) => Promise<unknown>
        view_api?: () => Promise<unknown>
    }

    const gallery = buildGalleryPayload(gradio, input)
    const dimensions = await getOutputDimensions(input.vehicleBuffer)
    const combinedPrompt = `${input.prompt} Strictly avoid the following: ${input.negativePrompt}`
    const viewApi = (
        typeof app.view_api === 'function' ? await app.view_api() : null
    ) as ViewApiResponse | null
    const parameterNames =
        viewApi?.named_endpoints?.[apiName]?.parameters
            ?.map((parameter) => parameter.parameter_name ?? '')
            .filter(Boolean) ?? []

    let response: unknown

    if (parameterNames.includes('input_images')) {
        response = await app.predict(apiName, [
            combinedPrompt,
            gallery,
            0,
            true,
            dimensions.width,
            dimensions.height,
            12,
            3.5,
            true,
        ])
    } else if (parameterNames.includes('images')) {
        response = await app.predict(apiName, [
            gallery,
            combinedPrompt,
            0,
            true,
            4,
            20,
            dimensions.height,
            dimensions.width,
            true,
        ])
    } else {
        throw new HuggingFaceGenerationError(
            `space_response_invalid:Unsupported HF Space API contract for ${spaceId}:${apiName}.`
        )
    }

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
