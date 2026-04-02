export class HuggingFaceGenerationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HuggingFaceGenerationError'
    }
}

export function mapHfError(error: unknown): HuggingFaceGenerationError {
    if (error instanceof HuggingFaceGenerationError) {
        return error
    }

    if (error instanceof Error) {
        return new HuggingFaceGenerationError(error.message)
    }

    return new HuggingFaceGenerationError('Hugging Face preview generation failed.')
}
