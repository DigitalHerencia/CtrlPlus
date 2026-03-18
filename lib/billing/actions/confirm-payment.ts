import { constructWebhookEvent } from '@/lib/billing/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'
import { type ConfirmPaymentResult } from '../types'

export const STRIPE_WEBHOOK_ACTOR = 'system:stripe-webhook'

type WebhookEventState = 'process' | 'processed' | 'processing'

function isPrismaUniqueConstraintError(err: unknown): boolean {
    return (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
    )
}

function toPaymentStatus(status: string): ConfirmPaymentResult['status'] {
    if (status === 'pending' || status === 'succeeded' || status === 'failed') {
        return status
    }

    throw new Error(`Unsupported payment status: ${status}`)
}

async function claimStripeWebhookEvent(
    eventId: string,
    eventType: string
): Promise<WebhookEventState> {
    try {
        await prisma.stripeWebhookEvent.create({
            data: {
                id: eventId,
                type: eventType,
                status: 'processing',
            },
        })

        return 'process'
    } catch (error: unknown) {
        if (!isPrismaUniqueConstraintError(error)) {
            throw error
        }
    }

    const existingEvent = await prisma.stripeWebhookEvent.findUnique({
        where: { id: eventId },
        select: { status: true },
    })

    if (!existingEvent) {
        throw new Error(`Stripe webhook event state missing for ${eventId}`)
    }

    if (existingEvent.status === 'failed') {
        const retryClaim = await prisma.stripeWebhookEvent.updateMany({
            where: {
                id: eventId,
                status: 'failed',
            },
            data: {
                type: eventType,
                status: 'processing',
                processedAt: new Date(),
            },
        })

        if (retryClaim.count === 1) {
            return 'process'
        }

        const refreshedEvent = await prisma.stripeWebhookEvent.findUnique({
            where: { id: eventId },
            select: { status: true },
        })

        if (!refreshedEvent) {
            throw new Error(`Stripe webhook event state missing for ${eventId}`)
        }

        return refreshedEvent.status === 'processed' ? 'processed' : 'processing'
    }

    return existingEvent.status === 'processed' ? 'processed' : 'processing'
}

async function finalizeStripeWebhookEvent(eventId: string, status: 'processed' | 'failed') {
    await prisma.stripeWebhookEvent.update({
        where: { id: eventId },
        data: {
            status,
            processedAt: new Date(),
        },
    })
}

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

    const webhookState = await claimStripeWebhookEvent(event.id, event.type)

    if (event.type !== 'checkout.session.completed') {
        if (webhookState === 'process') {
            await finalizeStripeWebhookEvent(event.id, 'processed')
        }

        throw new Error(`Unhandled Stripe event type: ${event.type}`)
    }

    const session = event.data.object
    const invoiceId = session.client_reference_id ?? session.metadata?.invoiceId ?? null
    if (!invoiceId) {
        throw new Error(
            'Stripe session is missing invoiceId (client_reference_id or metadata.invoiceId)'
        )
    }

    const stripePaymentIntentId =
        typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? null)

    if (!stripePaymentIntentId) {
        throw new Error('Stripe session is missing payment_intent')
    }

    if (webhookState !== 'process') {
        const duplicatePayment = await prisma.payment.findUnique({
            where: { stripePaymentIntentId },
            select: { id: true, invoiceId: true, status: true },
        })

        if (duplicatePayment) {
            return {
                invoiceId: duplicatePayment.invoiceId,
                paymentId: duplicatePayment.id,
                status: toPaymentStatus(duplicatePayment.status),
            }
        }

        return {
            invoiceId,
            paymentId: stripePaymentIntentId,
            status: 'pending',
        }
    }

    try {
        const invoice = await prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                deletedAt: null,
            },
            select: {
                id: true,
                bookingId: true,
                totalAmount: true,
            },
        })

        if (!invoice) {
            throw new Error(`Invoice not found: ${invoiceId}`)
        }

        const existingPayment = await prisma.payment.findUnique({
            where: { stripePaymentIntentId },
            select: { id: true, status: true },
        })

        if (existingPayment) {
            await finalizeStripeWebhookEvent(event.id, 'processed')

            return {
                invoiceId: invoice.id,
                paymentId: existingPayment.id,
                status: toPaymentStatus(existingPayment.status),
            }
        }

        const amountPaid = session.amount_total ?? invoice.totalAmount

        let payment: { id: string }
        try {
            const [createdPayment] = await prisma.$transaction([
                prisma.payment.create({
                    data: {
                        invoiceId: invoice.id,
                        stripePaymentIntentId,
                        status: 'succeeded',
                        amount: amountPaid,
                    },
                }),
                prisma.invoice.update({
                    where: { id: invoice.id },
                    data: { status: 'paid' },
                }),
                prisma.booking.update({
                    where: { id: invoice.bookingId },
                    data: { status: 'confirmed' },
                }),
            ])
            payment = createdPayment
        } catch (err: unknown) {
            if (isPrismaUniqueConstraintError(err)) {
                const winner = await prisma.payment.findUnique({
                    where: { stripePaymentIntentId },
                    select: { id: true, status: true },
                })
                if (winner) {
                    await finalizeStripeWebhookEvent(event.id, 'processed')

                    return {
                        invoiceId: invoice.id,
                        paymentId: winner.id,
                        status: toPaymentStatus(winner.status),
                    }
                }
            }

            throw err
        }

        await prisma.auditLog.create({
            data: {
                userId: STRIPE_WEBHOOK_ACTOR,
                action: 'CONFIRM_PAYMENT',
                resourceType: 'Payment',
                resourceId: payment.id,
                details: JSON.stringify({
                    invoiceId: invoice.id,
                    bookingId: invoice.bookingId,
                    stripePaymentIntentId,
                    amount: amountPaid,
                }),
            },
        })

        await finalizeStripeWebhookEvent(event.id, 'processed')

        return {
            invoiceId: invoice.id,
            paymentId: payment.id,
            status: 'succeeded',
        }
    } catch (error) {
        await finalizeStripeWebhookEvent(event.id, 'failed')
        throw error
    }
}
