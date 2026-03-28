import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { type NextRequest } from 'next/server'

export interface ClerkWebhookEvent {
    data: unknown
    object: string
    type: string
}

export async function verifyAndParseClerkWebhook(req: NextRequest): Promise<ClerkWebhookEvent> {
    try {
        return (await verifyWebhook(req)) as ClerkWebhookEvent
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('[Clerk Webhook] signature verification failed:', message)
        throw error
    }
}
