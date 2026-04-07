import { InferenceClient } from '@huggingface/inference'

import { HuggingFaceGenerationError, mapHfError } from './map-hf-error'

const DEFAULT_PUBLIC_SPACE_ID = 'black-forest-labs/FLUX.2-dev'
const DEFAULT_PUBLIC_SPACE_API_NAME = '/infer'
const DEFAULT_TIMEOUT_MS = 12000
const DEFAULT_RETRIES = 2

export type HfPreviewStrategy = 'space_inpaint' | 'image_to_image'

export interface VisualizerHfConfig {
    apiKey: string | null
    modelName: string
    previewStrategy: HfPreviewStrategy
    spaceId: string
    spaceApiName: string
    timeoutMs: number
    retries: number
}

function trimEnvValue(value: string | undefined): string | null {
    const trimmed = value?.trim()
    return trimmed ? trimmed : null
}

function parseTimeout(value: string | undefined): number {
    const parsed = Number(value ?? DEFAULT_TIMEOUT_MS)

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_TIMEOUT_MS
    }

    return parsed
}

function parseRetryCount(value: string | undefined): number {
    const parsed = Number(value ?? DEFAULT_RETRIES)
    if (!Number.isFinite(parsed) || parsed < 0) {
        return DEFAULT_RETRIES
    }

    return Math.min(Math.trunc(parsed), 5)
}

function parsePreviewStrategy(value: string | null): HfPreviewStrategy {
    return value === 'image_to_image' ? 'image_to_image' : 'space_inpaint'
}

export function getOptionalHfApiKey(): string | null {
    return trimEnvValue(process.env.HF_API_KEY) ?? trimEnvValue(process.env.HUGGINGFACE_API_TOKEN)
}

export function getVisualizerHfConfig(): VisualizerHfConfig {
    const spaceId = trimEnvValue(process.env.HF_SPACE_ID) ?? DEFAULT_PUBLIC_SPACE_ID

    return {
        apiKey: getOptionalHfApiKey(),
        modelName:
            trimEnvValue(process.env.HF_PREVIEW_MODEL) ??
            trimEnvValue(process.env.HF_IMAGE_TO_IMAGE_MODEL) ??
            trimEnvValue(process.env.HUGGINGFACE_VISUALIZER_PREVIEW_MODEL) ??
            spaceId,
        previewStrategy: parsePreviewStrategy(trimEnvValue(process.env.HF_PREVIEW_STRATEGY)),
        spaceId,
        spaceApiName: trimEnvValue(process.env.HF_SPACE_API_NAME) ?? DEFAULT_PUBLIC_SPACE_API_NAME,
        timeoutMs: parseTimeout(process.env.HF_TIMEOUT_MS ?? process.env.HUGGINGFACE_TIMEOUT_MS),
        retries: parseRetryCount(process.env.HF_RETRIES ?? process.env.HUGGINGFACE_RETRIES),
    }
}

function getHfApiKey(): string {
    const apiKey = getOptionalHfApiKey()

    if (!apiKey) {
        throw new HuggingFaceGenerationError('HF_API_KEY is not configured.')
    }

    return apiKey
}

export function getHfModelName(): string {
    return getVisualizerHfConfig().modelName
}

export function getHfPreviewStrategy(): HfPreviewStrategy {
    return getVisualizerHfConfig().previewStrategy
}

export function getHfSpaceId(): string {
    return getVisualizerHfConfig().spaceId
}

export function getHfSpaceApiName(): string {
    return getVisualizerHfConfig().spaceApiName
}

export function getHfTimeoutMs(): number {
    return getVisualizerHfConfig().timeoutMs
}

export function getHfRetryCount(): number {
    return getVisualizerHfConfig().retries
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
