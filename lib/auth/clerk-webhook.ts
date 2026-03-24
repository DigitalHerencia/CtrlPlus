import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { type NextRequest } from 'next/server'

export interface ClerkWebhookEvent {
    data: unknown
    object: string
    type: string
}

/**
 * verifyAndParseClerkWebhook
 * Wrapper around @clerk/nextjs/webhooks verifyWebhook to provide a
 * single location for logging and potential raw-body fallbacks in the future.
 */
export async function verifyAndParseClerkWebhook(req: NextRequest): Promise<ClerkWebhookEvent> {
    try {
        const evt = (await verifyWebhook(req)) as ClerkWebhookEvent
        return evt
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[Clerk Webhook] signature verification failed:', msg)
        throw err
    }
}
