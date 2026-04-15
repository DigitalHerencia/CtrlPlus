/**
 * @introduction Visualizer — TODO: short one-line summary of client.ts
 *
 * @description TODO: longer description for client.ts. Keep it short — one or two sentences.
 * Domain: visualizer
 * Public: TODO (yes/no)
 */
const DEFAULT_PUBLIC_SPACE_ID = 'black-forest-labs/FLUX.2-dev'
const DEFAULT_PUBLIC_SPACE_API_NAME = '/infer'
const DEFAULT_TIMEOUT_MS = 12000
const DEFAULT_RETRIES = 2

/**
 * VisualizerHfConfig — TODO: brief description of this type.
 */
/**
 * VisualizerHfConfig — TODO: brief description of this type.
 */
export interface VisualizerHfConfig {
    apiKey: string | null
    modelName: string
    spaceId: string
    spaceApiName: string
    timeoutMs: number
    retries: number
    /**
     * Img2img strength (0–1). Maps directly to the SD `strength` param:
     * how much noise is added to the input latents before denoising.
     * 0 = no change, 1 = fully regenerate (ignore original image).
     * Default: 0.75
     */
    img2imgStrength: number
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

/**
 * Clamps to [0, 1]. Values outside that range are replaced with the default.
 * Mirrors the Python SD pipeline's `strength` validation logic.
 */
function parseImg2ImgStrength(value: string | undefined): number {
    const DEFAULT = 0.75
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        return DEFAULT
    }
    return parsed
}

/**
 * getOptionalHfApiKey — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getOptionalHfApiKey — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getOptionalHfApiKey(): string | null {
    return trimEnvValue(process.env.HF_API_KEY) ?? trimEnvValue(process.env.HUGGINGFACE_API_TOKEN)
}

/**
 * getVisualizerHfConfig — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getVisualizerHfConfig — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getVisualizerHfConfig(): VisualizerHfConfig {
    const spaceId = trimEnvValue(process.env.HF_SPACE_ID) ?? DEFAULT_PUBLIC_SPACE_ID

    return {
        apiKey: getOptionalHfApiKey(),
        modelName:
            trimEnvValue(process.env.HF_PREVIEW_MODEL) ??
            trimEnvValue(process.env.HUGGINGFACE_VISUALIZER_PREVIEW_MODEL) ??
            spaceId,
        spaceId,
        spaceApiName: trimEnvValue(process.env.HF_SPACE_API_NAME) ?? DEFAULT_PUBLIC_SPACE_API_NAME,
        timeoutMs: parseTimeout(process.env.HF_TIMEOUT_MS ?? process.env.HUGGINGFACE_TIMEOUT_MS),
        retries: parseRetryCount(process.env.HF_RETRIES ?? process.env.HUGGINGFACE_RETRIES),
        img2imgStrength: parseImg2ImgStrength(process.env.HF_IMG2IMG_STRENGTH),
    }
}

/**
 * getHfModelName — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfModelName — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfModelName(): string {
    return getVisualizerHfConfig().modelName
}

/**
 * getHfSpaceId — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfSpaceId — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfSpaceId(): string {
    return getVisualizerHfConfig().spaceId
}

/**
 * getHfSpaceApiName — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfSpaceApiName — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfSpaceApiName(): string {
    return getVisualizerHfConfig().spaceApiName
}

/**
 * getHfTimeoutMs — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfTimeoutMs — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfTimeoutMs(): number {
    return getVisualizerHfConfig().timeoutMs
}

/**
 * getHfImg2ImgStrength — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfImg2ImgStrength — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfImg2ImgStrength(): number {
    return getVisualizerHfConfig().img2imgStrength
}

/**
 * getHfRetryCount — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * getHfRetryCount — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function getHfRetryCount(): number {
    return getVisualizerHfConfig().retries
}
