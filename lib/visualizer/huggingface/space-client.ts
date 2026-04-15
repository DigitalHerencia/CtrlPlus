import {
    getHfSpaceId,
    getOptionalHfApiKey,
} from '@/lib/visualizer/huggingface/client'

import { HuggingFaceGenerationError } from './map-hf-error'

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
    const gradio = (await import('@gradio/client')) as {
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
