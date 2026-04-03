import { verifyAndParseClerkWebhook } from '@/lib/integrations/clerk'
import { processClerkWebhookEvent } from '@/lib/actions/auth-webhook.actions'
import { ensureClerkWebhookSigningSecret } from '@/lib/integrations/clerk-webhook-env'
import { type NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
    try {
        const signingSecret = ensureClerkWebhookSigningSecret()

        if (!signingSecret) {
            console.error(
                '[Clerk Webhook] CLERK_WEBHOOK_SIGNING_SECRET environment variable not set'
            )
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
        }

        const eventId = req.headers.get('svix-id')
        if (!eventId) {
            return NextResponse.json({ error: 'Missing svix-id header' }, { status: 400 })
        }

        const evt = await verifyAndParseClerkWebhook(req)
        const result = await processClerkWebhookEvent(eventId, evt)

        if (result.kind === 'ignored') {
            return NextResponse.json({ message: result.message }, { status: 200 })
        }

        if (result.kind === 'duplicate') {
            return NextResponse.json({ message: `Event already ${result.state}` }, { status: 200 })
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error('[Clerk Webhook] Error:', errorMessage)

        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 })
    }
}
