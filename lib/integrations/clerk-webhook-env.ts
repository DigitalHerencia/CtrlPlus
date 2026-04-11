/**
 * @introduction Integrations — TODO: short one-line summary of clerk-webhook-env.ts
 *
 * @description TODO: longer description for clerk-webhook-env.ts. Keep it short — one or two sentences.
 * Domain: integrations
 * Public: TODO (yes/no)
 */
const DEV_ONLY_EVENT_PREFIXES = ['subscription.', 'subscriptionItem.', 'paymentAttempt.']

const CLERK_WEBHOOK_SIGNING_SECRET =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? process.env.CLERK_WEBHOOK_SECRET ?? null

/**
 * ensureClerkWebhookSigningSecret — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * ensureClerkWebhookSigningSecret — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function ensureClerkWebhookSigningSecret(): string | null {
    return CLERK_WEBHOOK_SIGNING_SECRET
}

/**
 * isClerkSubscriptionSyncEnabled — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * isClerkSubscriptionSyncEnabled — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function isClerkSubscriptionSyncEnabled(): boolean {
    if (process.env.NODE_ENV === 'production') {
        return false
    }

    return process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC !== 'false'
}

/**
 * resolveClerkDevWebhookBaseUrl — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * resolveClerkDevWebhookBaseUrl — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function resolveClerkDevWebhookBaseUrl(): string | null {
    if (process.env.NODE_ENV === 'production') {
        return null
    }

    const configuredUrl =
        process.env.DEV_WEBHOOK_BASE_URL ?? process.env.CLERK_WEBHOOK_DEV_URL ?? null

    return configuredUrl?.trim() || null
}

/**
 * shouldSkipWebhookEventInCurrentEnv — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
/**
 * shouldSkipWebhookEventInCurrentEnv — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function shouldSkipWebhookEventInCurrentEnv(eventType: string): boolean {
    const isDevOnlyEvent = DEV_ONLY_EVENT_PREFIXES.some((prefix) => eventType.startsWith(prefix))
    return isDevOnlyEvent && !isClerkSubscriptionSyncEnabled()
}
