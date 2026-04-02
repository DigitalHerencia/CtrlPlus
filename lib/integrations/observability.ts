import 'server-only'

interface ObservabilityContext {
    [key: string]: unknown
}

function toMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }

    return String(error)
}

export const observability = {
    async captureException(error: unknown, context?: ObservabilityContext): Promise<void> {
        console.error('[observability.exception]', {
            message: toMessage(error),
            context: context ?? null,
        })
    },

    async captureSoftFailure(message: string, context?: ObservabilityContext): Promise<void> {
        console.warn('[observability.soft-failure]', {
            message,
            context: context ?? null,
        })
    },
}
