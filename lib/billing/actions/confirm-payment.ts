import type { Prisma } from '@prisma/client'
import { constructWebhookEvent } from '@/lib/billing/stripe'
import type Stripe from 'stripe'

import { type ConfirmPaymentResult } from '../types'
import { processStripeWebhookEvent } from './process-stripe-webhook-event'

export async function confirmPayment(
    payload: string,
    signature: string
): Promise<ConfirmPaymentResult> {
    let event: Stripe.Event
    try {
        event = constructWebhookEvent(payload, signature)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : ''

        if (
            message.includes('STRIPE_SECRET_KEY environment variable is not set') ||
            message.includes('STRIPE_WEBHOOK_SECRET environment variable is not set')
        ) {
            throw new Error(message)
        }

        throw new Error('Invalid Stripe webhook signature')
    }

    const result = await processStripeWebhookEvent({
        event,
        payload: JSON.parse(payload) as Prisma.InputJsonValue,
    })

    if (result.kind === 'ignored') {
        throw new Error(`Unhandled Stripe event type: ${event.type}`)
    }

    return result.result
}
