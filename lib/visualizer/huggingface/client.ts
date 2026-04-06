import { InferenceClient } from '@huggingface/inference'

import { HuggingFaceGenerationError, mapHfError } from './map-hf-error'

const DEFAULT_PUBLIC_SPACE_ID = 'black-forest-labs/FLUX.2-dev'
const DEFAULT_PUBLIC_SPACE_API_NAME = '/infer'

function getHfApiKey(): string {
    const apiKey = process.env.HF_API_KEY?.trim() || process.env.HUGGINGFACE_API_TOKEN?.trim()

    if (!apiKey) {
        throw new HuggingFaceGenerationError('HF_API_KEY is not configured.')
    }

    return apiKey
}

export function getHfModelName(): string {
    return process.env.HF_IMAGE_TO_IMAGE_MODEL?.trim() || DEFAULT_PUBLIC_SPACE_ID
}

export function getHfPreviewStrategy(): 'space_inpaint' | 'image_to_image' {
    return 'space_inpaint'
}

export function getHfSpaceId(): string {
    return process.env.HF_SPACE_ID?.trim() || DEFAULT_PUBLIC_SPACE_ID
}

export function getHfSpaceApiName(): string {
    return process.env.HF_SPACE_API_NAME?.trim() || DEFAULT_PUBLIC_SPACE_API_NAME
}

export function getHfTimeoutMs(): number {
    const raw = Number(process.env.HF_TIMEOUT_MS ?? process.env.HUGGINGFACE_TIMEOUT_MS ?? 12000)

    if (!Number.isFinite(raw) || raw <= 0) {
        return 12000
    }

    return raw
}

export function getHfRetryCount(): number {
    const raw = Number(process.env.HF_RETRIES ?? process.env.HUGGINGFACE_RETRIES ?? 2)
    if (!Number.isFinite(raw) || raw < 0) {
        return 2
    }

    return Math.min(Math.trunc(raw), 5)
}

export function createHfClient(): InferenceClient {
    return new InferenceClient(getHfApiKey())
}

export async function withHfTimeout<T>(promise: Promise<T>): Promise<T> {
    const timeoutMs = getHfTimeoutMs()

    return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            setTimeout(
                () => reject(new HuggingFaceGenerationError('Hugging Face request timed out.')),
                timeoutMs
            )
        }),
    ]).catch((error: unknown) => {
        throw mapHfError(error)
    })
}
