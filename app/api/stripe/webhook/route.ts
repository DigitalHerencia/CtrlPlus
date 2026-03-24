import type { Prisma } from '@prisma/client'

import { processStripeWebhookEvent } from '@/lib/billing/actions/process-stripe-webhook-event'
import { constructWebhookEvent } from '@/lib/billing/stripe'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const signature = request.headers.get('stripe-signature')
    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const payload = await request.text()

    try {
        const event = constructWebhookEvent(payload, signature)
        const result = await processStripeWebhookEvent({
            event,
            payload: JSON.parse(payload) as Prisma.InputJsonValue,
        })

        if (result.kind === 'ignored') {
            return NextResponse.json({ ok: true, ignored: true }, { status: 200 })
        }

        return NextResponse.json(result.result, { status: 200 })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Webhook processing failed'

        if (message === 'Invalid Stripe webhook signature') {
            return NextResponse.json({ error: message }, { status: 400 })
        }

        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
