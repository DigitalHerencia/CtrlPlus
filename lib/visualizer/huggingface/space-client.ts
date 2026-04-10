import {
    getHfSpaceApiName,
    getHfSpaceId,
    getOptionalHfApiKey,
} from '@/lib/visualizer/huggingface/client'

import { HuggingFaceGenerationError } from './map-hf-error'

function parsePositiveInt(
    value: string | undefined,
    fallback: number,
    min = 1,
    max = 4096
): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
        return fallback
    }

    const normalized = Math.trunc(parsed)
    if (normalized < min || normalized > max) {
        return fallback
    }

    return normalized
}

function parsePositiveNumber(
    value: string | undefined,
    fallback: number,
    min = 0,
    max = 30
): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
        return fallback
    }

    return parsed
}

function getSpaceGenerationDefaults() {
    return {
        // Free-tier friendly defaults. Can be overridden via env.
        width: parsePositiveInt(process.env.HF_SPACE_WIDTH, 768, 64, 2048),
        height: parsePositiveInt(process.env.HF_SPACE_HEIGHT, 768, 64, 2048),
        guidanceScale: parsePositiveNumber(process.env.HF_SPACE_GUIDANCE_SCALE, 6.5, 0, 30),
        inferenceSteps: parsePositiveInt(process.env.HF_SPACE_INFERENCE_STEPS, 20, 1, 100),
        strength: parsePositiveNumber(process.env.HF_IMG2IMG_STRENGTH, 0.6, 0, 1),
    }
}

async function fetchImageBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new HuggingFaceGenerationError(
            `space_response_invalid:Unable to fetch generated image (${response.status}).`
        )
    }

    return Buffer.from(await response.arrayBuffer())
}

function stringifyUnknown(value: unknown): string {
    try {
        const serialized = JSON.stringify(value)
        return serialized && serialized !== '{}' ? serialized : ''
    } catch {
        return ''
    }
}

function extractErrorMessage(value: unknown, depth = 0): string {
    if (depth > 4) {
        return ''
    }

    if (typeof value === 'string') {
        return value.trim()
    }

    if (value instanceof Error) {
        return value.message?.trim() || value.name
    }

    if (Array.isArray(value)) {
        for (const entry of value) {
            const extracted = extractErrorMessage(entry, depth + 1)
            if (extracted) {
                return extracted
            }
        }

        return ''
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>
        const candidates = [
            record.message,
            record.error,
            record.errors,
            record.detail,
            record.details,
            record.reason,
            record.cause,
            record.statusText,
            record.body,
            record.response,
            record.data,
        ]

        for (const candidate of candidates) {
            const extracted = extractErrorMessage(candidate, depth + 1)
            if (extracted) {
                return extracted
            }
        }

        return stringifyUnknown(value)
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
    }

    return ''
}

function resolveErrorMessage(value: unknown, fallback = 'Unknown HF Space error.'): string {
    return extractErrorMessage(value) || fallback
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
        const candidates = [
            record.url,
            record.path,
            record.image,
            record.value,
            record.data,
            record.output,
            record.result,
            record.payload,
            record.file,
        ]
        for (const candidate of candidates) {
            const found = pickImageLikeValue(candidate)
            if (found) {
                return found
            }
        }
    }

    return null
}

function pickPromptTextValue(payload: unknown): string {
    if (!payload) {
        return ''
    }

    if (typeof payload === 'string') {
        return payload
    }

    if (Array.isArray(payload)) {
        for (const entry of payload) {
            const found = pickPromptTextValue(entry)
            if (found) {
                return found
            }
        }

        return ''
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        const candidates = [
            record.prompt,
            record.prompt_used,
            record.text,
            record.value,
            record.data,
            record.output,
            record.result,
            record.payload,
        ]
        for (const candidate of candidates) {
            const found = pickPromptTextValue(candidate)
            if (found) {
                return found
            }
        }
    }

    return ''
}

function pickErrorTextValue(payload: unknown): string {
    if (!payload) {
        return ''
    }

    if (typeof payload === 'string') {
        return ''
    }

    if (Array.isArray(payload)) {
        for (const entry of payload) {
            const found = pickErrorTextValue(entry)
            if (found) {
                return found
            }
        }

        return ''
    }

    if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>
        const candidates = [
            record.error,
            record.errors,
            record.message,
            record.detail,
            record.reason,
        ]
        for (const candidate of candidates) {
            const found = extractErrorMessage(candidate)
            if (found) {
                return found
            }
        }

        const nestedCandidates = [
            record.output,
            record.result,
            record.payload,
            record.data,
            record.value,
        ]
        for (const candidate of nestedCandidates) {
            const found = pickErrorTextValue(candidate)
            if (found) {
                return found
            }
        }
    }

    return ''
}

function toDataUrlFromBlob(blob: Blob): Promise<string> {
    return blob.arrayBuffer().then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64')
        const contentType = blob.type || 'image/png'
        return `data:${contentType};base64,${base64}`
    })
}

async function connectToSpaceClient() {
    const spaceId = getHfSpaceId()
    const moduleName = '@gradio/client'
    const gradio = (await import(/* webpackIgnore: true */ moduleName)) as {
        Client: {
            connect: (spaceId: string, options?: Record<string, unknown>) => Promise<unknown>
        }
        handle_file: (input: Blob) => unknown
    }

    const hfToken = getOptionalHfApiKey()
    const connectWithOptions = async (options?: Record<string, unknown>) =>
        (await gradio.Client.connect(spaceId, options ?? {})) as {
            predict: (apiName: string, payload: unknown[]) => Promise<unknown>
            view_api?: () => Promise<unknown>
        }

    try {
        const app = await connectWithOptions(hfToken ? { hf_token: hfToken } : undefined)
        return { app, gradio }
    } catch (error) {
        const message = resolveErrorMessage(error)
        const tokenRejected = /invalid username or password|unauthorized|401|403/i.test(message)

        if (!hfToken || !tokenRejected) {
            throw new HuggingFaceGenerationError(`space_connect_failed:${message}`)
        }

        const app = await connectWithOptions()
        return { app, gradio }
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

function buildApiNameCandidates(
    configuredApiName: string,
    viewApi: ViewApiResponse | null
): string[] {
    const trimmed = configuredApiName.trim()
    const normalizedBase = trimmed.replace(/^\/+/, '')

    const candidates = [
        trimmed,
        `/${normalizedBase}`,
        `//${normalizedBase}`,
        normalizedBase,
    ].filter(Boolean)

    const deduped = Array.from(new Set(candidates))
    const known = Object.keys(viewApi?.named_endpoints ?? {})

    if (known.length === 0) {
        return deduped
    }

    const knownFirst = deduped.filter((name) => known.includes(name))
    const rest = deduped.filter((name) => !known.includes(name))
    return [...knownFirst, ...rest]
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
        defaults: ReturnType<typeof getSpaceGenerationDefaults>
    }
) {
    const normalizedName = parameterName.toLowerCase()

    if (normalizedName === 'seed' || normalizedName.endsWith('_seed')) {
        return Math.floor(Math.random() * 1_000_000_000)
    }

    if (normalizedName.includes('randomize') && normalizedName.includes('seed')) {
        return true
    }

    if (normalizedName === 'width') {
        return payload.defaults.width
    }

    if (normalizedName === 'height') {
        return payload.defaults.height
    }

    if (normalizedName === 'guidance_scale' || normalizedName.includes('guidance')) {
        return payload.defaults.guidanceScale
    }

    if (
        normalizedName === 'num_inference_steps' ||
        normalizedName === 'inference_steps' ||
        normalizedName.includes('steps')
    ) {
        return payload.defaults.inferenceSteps
    }

    if (normalizedName === 'strength' || normalizedName === 'denoising_strength') {
        return payload.defaults.strength
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
        defaults: ReturnType<typeof getSpaceGenerationDefaults>
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

function normalizeVehiclePreviewResponsePayload(response: unknown): unknown {
    if (!response) {
        return response
    }

    if (Array.isArray(response)) {
        return response
    }

    if (typeof response !== 'object') {
        return response
    }

    const record = response as Record<string, unknown>

    if (record.output && typeof record.output === 'object') {
        const output = record.output as Record<string, unknown>
        if (Array.isArray(output.data)) {
            return output.data
        }

        if (output.value) {
            return output.value
        }
    }

    if (record.result && typeof record.result === 'object') {
        const result = record.result as Record<string, unknown>
        if (Array.isArray(result.data)) {
            return result.data
        }

        if (result.value) {
            return result.value
        }
    }

    if (Array.isArray(record.data)) {
        return record.data
    }

    if (record.value) {
        return record.value
    }

    return response
}

function isEndpointNameMismatch(message: string): boolean {
    return /no endpoint matching that name|fn_index/i.test(message)
}

export async function generateViaHfSpace(input: {
    boardBuffer: Buffer
    boardMaskBuffer: Buffer
    prompt: string
    negativePrompt: string
}): Promise<Buffer> {
    const { app, gradio } = await connectToSpaceClient()

    const configuredApiName = getHfSpaceApiName()

    const payload = {
        boardImage: buildHandledFile(gradio, input.boardBuffer),
        boardMask: buildHandledFile(gradio, input.boardMaskBuffer),
        prompt: input.prompt,
        negativePrompt: input.negativePrompt,
        defaults: getSpaceGenerationDefaults(),
    }
    const viewApi = (
        typeof app.view_api === 'function' ? await app.view_api() : null
    ) as ViewApiResponse | null
    const apiNameCandidates = buildApiNameCandidates(configuredApiName, viewApi)
    const resolvedApiName = apiNameCandidates[0]

    const parameterNames =
        viewApi?.named_endpoints?.[resolvedApiName]?.parameters
            ?.map((parameter) => parameter.parameter_name ?? '')
            .filter(Boolean) ?? []

    let response: unknown
    let lastPredictError: unknown = null
    for (const apiName of apiNameCandidates) {
        try {
            response = await app.predict(apiName, buildPredictPayload(parameterNames, payload))
            lastPredictError = null
            break
        } catch (error) {
            lastPredictError = error
            const message = resolveErrorMessage(error)
            if (!/no endpoint matching that name|fn_index/i.test(message)) {
                throw error
            }
        }
    }

    if (lastPredictError || response == null) {
        const message = resolveErrorMessage(lastPredictError)
        throw new HuggingFaceGenerationError(
            `space_endpoint_not_found:configured=${configuredApiName}; tried=${apiNameCandidates.join(',')}; ${message}`
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

export async function generateVehicleWrapPreviewViaHfSpace(input: {
    make: string
    model: string
    year: string
    trim: string
    wrapName: string
}): Promise<{ imageUrl: string; promptUsed: string }> {
    const { app } = await connectToSpaceClient()
    const vehiclePreviewApiName = '/generate_wrap_preview'
    const viewApi = (
        typeof app.view_api === 'function' ? await app.view_api() : null
    ) as ViewApiResponse | null
    const apiNameCandidates = buildApiNameCandidates(vehiclePreviewApiName, viewApi)

    let response: unknown = null
    let lastPredictError: unknown = null

    for (const apiName of apiNameCandidates) {
        try {
            response = await app.predict(apiName, [
                input.make,
                input.model,
                input.year,
                input.trim,
                input.wrapName,
            ])
            lastPredictError = null
            break
        } catch (error) {
            const message = resolveErrorMessage(error)

            if (/value\s*:\s*.+\s+is not in the list of choices/i.test(message)) {
                throw new HuggingFaceGenerationError(`space_catalog_mismatch:${message}`)
            }

            lastPredictError = error

            if (!isEndpointNameMismatch(message)) {
                throw new HuggingFaceGenerationError(`provider_unavailable:${message}`)
            }
        }
    }

    if (lastPredictError || response == null) {
        const message = resolveErrorMessage(lastPredictError)
        throw new HuggingFaceGenerationError(
            `space_endpoint_not_found:configured=${vehiclePreviewApiName}; tried=${apiNameCandidates.join(',')}; ${message}`
        )
    }

    const normalizedPayload = normalizeVehiclePreviewResponsePayload(response)
    const payloadError = pickErrorTextValue(normalizedPayload)
    if (payloadError) {
        throw new HuggingFaceGenerationError(`provider_unavailable:${payloadError}`)
    }

    const imageLike = pickImageLikeValue(normalizedPayload)
    const promptUsed = pickPromptTextValue(normalizedPayload)

    if (!imageLike) {
        throw new HuggingFaceGenerationError(
            'space_response_invalid:No image payload returned by HF Space.'
        )
    }

    const imageUrl = typeof imageLike === 'string' ? imageLike : await toDataUrlFromBlob(imageLike)

    return {
        imageUrl,
        promptUsed,
    }
}
