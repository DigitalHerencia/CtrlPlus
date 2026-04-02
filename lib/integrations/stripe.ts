import Stripe from 'stripe'

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-02-25.clover'

let stripeClient: Stripe | null = null

function getRequiredEnv(name: 'STRIPE_SECRET_KEY' | 'STRIPE_WEBHOOK_SECRET'): string {
    const value =
        name === 'STRIPE_SECRET_KEY'
            ? (process.env.STRIPE_SECRET_KEY?.trim() ??
              process.env.ctrl_plus_STRIPE_SECRET_KEY?.trim())
            : process.env.STRIPE_WEBHOOK_SECRET?.trim()

    if (!value) {
        throw new Error(`${name} environment variable is not set`)
    }

    return value
}

export function getStripeClient(): Stripe {
    if (!stripeClient) {
        stripeClient = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'), {
            apiVersion: STRIPE_API_VERSION,
        })
    }

    return stripeClient
}

export function getAppBaseUrl(): string {
    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

    if (!rawBaseUrl) {
        throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set')
    }

    try {
        return new URL(rawBaseUrl).origin
    } catch {
        throw new Error('NEXT_PUBLIC_APP_URL must be a valid absolute URL')
    }
}

export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
    return getStripeClient().webhooks.constructEvent(
        payload,
        signature,
        getRequiredEnv('STRIPE_WEBHOOK_SECRET')
    )
}
