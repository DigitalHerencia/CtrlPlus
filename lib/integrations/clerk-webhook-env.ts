const DEV_ONLY_EVENT_PREFIXES = ['subscription.', 'subscriptionItem.', 'paymentAttempt.']

export function ensureClerkWebhookSigningSecret(): string | null {
    const signingSecret =
        process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? process.env.CLERK_WEBHOOK_SECRET ?? null

    if (signingSecret && !process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
        process.env.CLERK_WEBHOOK_SIGNING_SECRET = signingSecret
    }

    return signingSecret
}

export function isClerkSubscriptionSyncEnabled(): boolean {
    if (process.env.NODE_ENV === 'production') {
        return false
    }

    return process.env.ENABLE_CLERK_SUBSCRIPTION_SYNC !== 'false'
}

export function resolveClerkDevWebhookBaseUrl(): string | null {
    if (process.env.NODE_ENV === 'production') {
        return null
    }

    const configuredUrl =
        process.env.DEV_WEBHOOK_BASE_URL ?? process.env.CLERK_WEBHOOK_DEV_URL ?? null

    return configuredUrl?.trim() || null
}

export function shouldSkipWebhookEventInCurrentEnv(eventType: string): boolean {
    const isDevOnlyEvent = DEV_ONLY_EVENT_PREFIXES.some((prefix) => eventType.startsWith(prefix))
    return isDevOnlyEvent && !isClerkSubscriptionSyncEnabled()
}