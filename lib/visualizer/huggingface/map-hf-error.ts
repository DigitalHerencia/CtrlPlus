/**
 * Error wrapper specific to Hugging Face generation-related failures.
 * Using a dedicated error class makes mapping and handling clearer in callers.
 */
/**
 * HuggingFaceGenerationError — TODO: brief description of this class.
 */
/**
 * HuggingFaceGenerationError — TODO: brief description of this class.
 */
export class HuggingFaceGenerationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HuggingFaceGenerationError'
    }
}

/**
 * Map an unknown error into a HuggingFaceGenerationError with a compact
 * machine-readable prefix to aid triage and metrics.
 */
/**
 * mapHfError — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * mapHfError — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function mapHfError(error: unknown): HuggingFaceGenerationError {
    if (error instanceof HuggingFaceGenerationError) {
        return error
    }

    if (error instanceof Error) {
        const message = error.message

        if (/timed out|timeout/i.test(message)) {
            return new HuggingFaceGenerationError(`space_queue_timeout:${message}`)
        }

        if (/HF_API_KEY|token|authentication|unauthorized|401|403/i.test(message)) {
            return new HuggingFaceGenerationError(`config_missing:${message}`)
        }

        if (/invalid url|failed to parse|url/i.test(message)) {
            return new HuggingFaceGenerationError(`invalid_url:${message}`)
        }

        if (/no image|invalid response|unexpected|empty/i.test(message)) {
            return new HuggingFaceGenerationError(`space_response_invalid:${message}`)
        }

        return new HuggingFaceGenerationError(`provider_unavailable:${message}`)
    }

    return new HuggingFaceGenerationError('Hugging Face preview generation failed.')
}
