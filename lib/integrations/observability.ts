/**
 * @introduction Integrations — TODO: short one-line summary of observability.ts
 *
 * @description TODO: longer description for observability.ts. Keep it short — one or two sentences.
 * Domain: integrations
 * Public: TODO (yes/no)
 */
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

/**
 * observability — TODO: brief description.
 */
/**
 * observability — TODO: brief description.
 */
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
