'use server'

import { revalidatePath } from 'next/cache'

import { getAppBaseUrl, getStripeClient } from '@/lib/integrations/stripe'
import { prisma } from '@/lib/db/prisma'
import {
    applyCreditSchema,
    createCheckoutSessionSchema,
    createInvoiceSchema,
    ensureInvoiceForBookingSchema,
    processPaymentSchema,
    refundInvoiceSchema,
    voidInvoiceSchema,
} from '@/schemas/billing.schemas'
import {
    type ApplyCreditInput,
    type CheckoutSessionDTO,
    type CreateInvoiceInput,
    type CreateCheckoutSessionInput,
    type InvoiceLineItemDTO,
    type ProcessPaymentInput,
    type RefundInvoiceInput,
    type EnsureInvoiceForBookingInput,
    type EnsureInvoiceResult,
    type ConfirmPaymentResult,
    type VoidInvoiceInput,
} from '@/types/billing.types'
import {
    getBillingAccessContext,
    requireInvoiceWriteAccess,
    requireOwnerOrPlatformAdmin,
} from '@/lib/authz/guards'
import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import type { Prisma } from '@prisma/client'
import type Stripe from 'stripe'
import { isInvoicePayable } from '../constants/statuses'

type InvoiceLineItemRow = Pick<InvoiceLineItemDTO, 'description' | 'quantity' | 'unitPrice'>

function toStripeAmount(cents: number): number {
    if (!Number.isFinite(cents)) {
        throw new Error('Invalid invoice amount')
    }

    return Math.round(cents)
}

export async function createCheckoutSession(
    rawInput: CreateCheckoutSessionInput
): Promise<CheckoutSessionDTO> {
    const access = await getBillingAccessContext()
    const { invoiceId } = createCheckoutSessionSchema.parse(rawInput)

    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            ...(!access.canWriteAllInvoices
                ? {
                      booking: {
                          customerId: access.session.userId,
                      },
                  }
                : {}),
        },
        select: {
            id: true,
            totalAmount: true,
            status: true,
            updatedAt: true,
            booking: {
                select: {
                    customerId: true,
                },
            },
            lineItems: {
                select: { description: true, quantity: true, unitPrice: true },
            },
        },
    })

    if (!invoice) {
        throw new Error('Forbidden: invoice not found')
    }

    requireInvoiceWriteAccess(access, invoice.booking.customerId)

    if (!isInvoicePayable(invoice.status as Parameters<typeof isInvoicePayable>[0])) {
        throw new Error(`Forbidden: invoice is not payable from status ${invoice.status}`)
    }

    const lineItems =
        invoice.lineItems.length > 0
            ? invoice.lineItems.map((li: InvoiceLineItemRow) => ({
                  price_data: {
                      currency: 'usd',
                      product_data: { name: li.description },
                      unit_amount: toStripeAmount(li.unitPrice),
                  },
                  quantity: li.quantity,
              }))
            : [
                  {
                      price_data: {
                          currency: 'usd',
                          product_data: { name: `Invoice ${invoice.id}` },
                          unit_amount: toStripeAmount(invoice.totalAmount),
                      },
                      quantity: 1,
                  },
              ]

    const baseUrl = getAppBaseUrl()
    const stripe = getStripeClient()
    const idempotencyKey = `billing:checkout:${invoice.id}:${invoice.updatedAt.getTime()}`

    const checkoutSession = await stripe.checkout.sessions.create(
        {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            client_reference_id: invoice.id,
            success_url: `${baseUrl}/billing/${invoice.id}?payment=success`,
            cancel_url: `${baseUrl}/billing/${invoice.id}?payment=cancelled`,
            metadata: {
                invoiceId: invoice.id,
                invoiceUpdatedAt: invoice.updatedAt.toISOString(),
            },
        },
        {
            idempotencyKey,
        }
    )

    if (!checkoutSession.url) {
        throw new Error('Stripe did not return a checkout URL')
    }

    if (invoice.status === 'draft') {
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'issued' },
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: access.session.userId,
            action: 'CREATE_CHECKOUT_SESSION',
            resourceType: 'Invoice',
            resourceId: invoice.id,
            details: JSON.stringify({
                sessionId: checkoutSession.id,
                idempotencyKey,
                invoiceStatus: invoice.status,
            }),
            timestamp: new Date(),
        },
    })

    revalidatePath('/billing')
    revalidatePath(`/billing/${invoice.id}`)

    return { sessionId: checkoutSession.id, url: checkoutSession.url, invoiceId: invoice.id }
}

function isUniqueConstraintError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
    )
}

function normalizeCents(amount: number): number {
    if (!Number.isFinite(amount)) {
        throw new Error('Invalid booking price')
    }

    return Math.round(amount)
}

function mapStripeRefundStatus(status: Stripe.Refund['status']): 'pending' | 'succeeded' | 'failed' {
    if (status === 'succeeded') {
        return 'succeeded'
    }

    if (status === 'failed' || status === 'canceled') {
        return 'failed'
    }

    return 'pending'
}

export async function ensureInvoiceForBooking(
    rawInput: EnsureInvoiceForBookingInput
): Promise<EnsureInvoiceResult> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const { bookingId } = ensureInvoiceForBookingSchema.parse(rawInput)

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            deletedAt: null,
            ...(!session.isOwner && !session.isPlatformAdmin ? { customerId: userId } : {}),
        },
        select: {
            id: true,
            customerId: true,
            wrapId: true,
            totalPrice: true,
            invoice: {
                where: { deletedAt: null },
                select: { id: true },
            },
            wrap: {
                select: { name: true },
            },
        },
    })

    if (!booking) {
        throw new Error('Forbidden: booking not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, booking.customerId)

    if (booking.invoice) {
        return {
            invoiceId: booking.invoice.id,
            created: false,
        }
    }

    const roundedTotalPrice = normalizeCents(booking.totalPrice)

    const createInvoice = async (tx: Prisma.TransactionClient) => {
        const created = await tx.invoice.create({
            data: {
                bookingId: booking.id,
                status: 'draft',
                totalAmount: roundedTotalPrice,
                lineItems: {
                    create: [
                        {
                            description: booking.wrap?.name ?? 'Wrap installation',
                            quantity: 1,
                            unitPrice: roundedTotalPrice,
                            totalPrice: roundedTotalPrice,
                        },
                    ],
                },
            },
            select: { id: true },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'ENSURE_INVOICE_FOR_BOOKING',
                resourceType: 'Invoice',
                resourceId: created.id,
                details: JSON.stringify({ bookingId: booking.id }),
                timestamp: new Date(),
            },
        })

        return created
    }

    try {
        const created = await prisma.$transaction(createInvoice)

        return {
            invoiceId: created.id,
            created: true,
        }
    } catch (error) {
        if (!isUniqueConstraintError(error)) {
            throw error
        }

        const existingInvoice = await prisma.invoice.findUnique({
            where: { bookingId: booking.id },
            select: { id: true },
        })

        if (!existingInvoice) {
            throw new Error('Invoice creation race detected but invoice could not be found')
        }

        return {
            invoiceId: existingInvoice.id,
            created: false,
        }
    }
}

export async function createInvoice(rawInput: CreateInvoiceInput): Promise<EnsureInvoiceResult> {
    const parsed = createInvoiceSchema.parse(rawInput)
    return ensureInvoiceForBooking({ bookingId: parsed.bookingId })
}

export async function processPayment(rawInput: ProcessPaymentInput): Promise<CheckoutSessionDTO> {
    const { invoiceId } = processPaymentSchema.parse(rawInput)
    return createCheckoutSession({ invoiceId })
}

export async function applyCredit(
    rawInput: ApplyCreditInput
): Promise<{ invoiceId: string; status: string }> {
    const session = await requireOwnerOrPlatformAdmin()
    const userId = session.userId
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const { invoiceId, amount, notes } = applyCreditSchema.parse(rawInput)

    const invoice = await prisma.invoice.findFirst({
        where: { id: invoiceId, deletedAt: null },
        select: { id: true, status: true, totalAmount: true },
    })

    if (!invoice) {
        throw new Error('Invoice not found')
    }

    if (invoice.status === 'paid' || invoice.status === 'refunded' || invoice.status === 'void') {
        throw new Error(`Cannot apply credit to invoice in ${invoice.status} status`)
    }

    const nextAmount = Math.max(0, invoice.totalAmount - amount)

    await prisma.$transaction([
        prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                totalAmount: nextAmount,
                lineItems: {
                    create: {
                        description: 'Credit adjustment',
                        quantity: 1,
                        unitPrice: -amount,
                        totalPrice: -amount,
                    },
                },
            },
        }),
        prisma.auditLog.create({
            data: {
                userId,
                action: 'APPLY_INVOICE_CREDIT',
                resourceType: 'Invoice',
                resourceId: invoice.id,
                details: JSON.stringify({ amount, notes: notes ?? null }),
            },
        }),
    ])

    revalidatePath('/billing')
    revalidatePath(`/billing/${invoice.id}`)

    return { invoiceId: invoice.id, status: invoice.status }
}

export async function voidInvoice(
    rawInput: VoidInvoiceInput
): Promise<{ invoiceId: string; status: string }> {
    const session = await requireOwnerOrPlatformAdmin()
    const userId = session.userId
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const { invoiceId, notes } = voidInvoiceSchema.parse(rawInput)

    const invoice = await prisma.invoice.findFirst({
        where: { id: invoiceId, deletedAt: null },
        select: { id: true, status: true },
    })

    if (!invoice) {
        throw new Error('Invoice not found')
    }

    if (invoice.status === 'paid' || invoice.status === 'refunded') {
        throw new Error(`Cannot void invoice in ${invoice.status} status`)
    }

    await prisma.$transaction([
        prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'void' },
        }),
        prisma.auditLog.create({
            data: {
                userId,
                action: 'VOID_INVOICE',
                resourceType: 'Invoice',
                resourceId: invoice.id,
                details: JSON.stringify({ notes: notes ?? null }),
            },
        }),
    ])

    revalidatePath('/billing')
    revalidatePath(`/billing/${invoice.id}`)

    return { invoiceId: invoice.id, status: 'void' }
}

export async function refundInvoice(
    rawInput: RefundInvoiceInput
): Promise<{ invoiceId: string; status: string }> {
    const session = await requireOwnerOrPlatformAdmin()
    const userId = session.userId
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const { invoiceId, amount, notes } = refundInvoiceSchema.parse(rawInput)

    const invoice = await prisma.invoice.findFirst({
        where: { id: invoiceId, deletedAt: null },
        select: {
            id: true,
            totalAmount: true,
            status: true,
            payments: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    stripePaymentIntentId: true,
                    status: true,
                    amount: true,
                },
            },
        },
    })

    if (!invoice) {
        throw new Error('Invoice not found')
    }

    if (invoice.status !== 'paid') {
        throw new Error(`Cannot refund invoice in ${invoice.status} status`)
    }

    const refundAmount = Math.min(amount ?? invoice.totalAmount, invoice.totalAmount)
    const existingRefund = invoice.payments.find(
        (payment) =>
            payment.amount < 0 && (payment.status === 'pending' || payment.status === 'succeeded')
    )

    if (existingRefund) {
        throw new Error('A refund has already been initiated for this invoice')
    }

    const sourcePayment = invoice.payments.find(
        (payment) => payment.amount > 0 && payment.status === 'succeeded'
    )

    if (!sourcePayment) {
        throw new Error('No succeeded Stripe payment was found for this invoice')
    }

    const stripe = getStripeClient()
    const refund = await stripe.refunds.create(
        {
            payment_intent: sourcePayment.stripePaymentIntentId,
            amount: refundAmount,
            metadata: {
                invoiceId: invoice.id,
            },
        },
        {
            idempotencyKey: `billing:refund:${invoice.id}:${sourcePayment.id}:${refundAmount}`,
        }
    )

    const refundStatus = mapStripeRefundStatus(refund.status)
    const nextInvoiceStatus = refundStatus === 'succeeded' ? 'refunded' : invoice.status

    await prisma.$transaction([
        prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                stripePaymentIntentId: refund.id,
                status: refundStatus,
                amount: -refundAmount,
            },
        }),
        prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: nextInvoiceStatus },
        }),
        prisma.auditLog.create({
            data: {
                userId,
                action: 'REFUND_INVOICE',
                resourceType: 'Invoice',
                resourceId: invoice.id,
                details: JSON.stringify({
                    amount: refundAmount,
                    notes: notes ?? null,
                    refundId: refund.id,
                    refundStatus,
                    stripePaymentIntentId: sourcePayment.stripePaymentIntentId,
                }),
            },
        }),
    ])

    revalidatePath('/billing')
    revalidatePath(`/billing/${invoice.id}`)

    return { invoiceId: invoice.id, status: nextInvoiceStatus }
}

// --- webhook processor (kept here so callers import a single domain actions file)
const STRIPE_WEBHOOK_ACTOR = 'system:stripe-webhook'

type WebhookEventState = 'process' | 'processed' | 'processing'

export type ProcessStripeWebhookEventResult =
    | {
          kind: 'ignored'
          eventId: string
          eventType: string
      }
    | {
          kind: 'processed'
          result: ConfirmPaymentResult
      }

interface ProcessStripeWebhookEventInput {
    event: Stripe.Event
    payload: unknown
}

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
    eventType: string,
    payload: unknown
): Promise<WebhookEventState> {
    const now = new Date()

    try {
        await prisma.stripeWebhookEvent.create({
            data: {
                id: eventId,
                type: eventType,
                status: 'processing',
                payload: payload as Prisma.InputJsonValue,
                lastAttemptedAt: now,
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
        select: {
            status: true,
        },
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
                processedAt: now,
                lastAttemptedAt: now,
                payload: payload as Prisma.InputJsonValue,
                retryCount: {
                    increment: 1,
                },
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

async function finalizeStripeWebhookEvent(
    eventId: string,
    status: 'processed' | 'failed',
    error?: string
) {
    await prisma.stripeWebhookEvent.update({
        where: { id: eventId },
        data: {
            status,
            error: error ?? null,
            processedAt: new Date(),
        },
    })
}

function resolveInvoiceId(session: Stripe.Checkout.Session | Record<string, unknown>): string {
    const s = session as Partial<Stripe.Checkout.Session>
    const invoiceId = s.client_reference_id ?? s.metadata?.invoiceId ?? null
    if (!invoiceId) {
        throw new Error(
            'Stripe session is missing invoiceId (client_reference_id or metadata.invoiceId)'
        )
    }

    return invoiceId
}

function resolveStripePaymentIntentId(
    session: Stripe.Checkout.Session | Record<string, unknown>
): string {
    const s = session as Partial<Stripe.Checkout.Session>
    const paymentIntent = s.payment_intent as string | { id?: string } | undefined
    const stripePaymentIntentId =
        typeof paymentIntent === 'string' ? paymentIntent : (paymentIntent?.id ?? null)

    if (!stripePaymentIntentId) {
        throw new Error('Stripe session is missing payment_intent')
    }

    return stripePaymentIntentId
}

async function buildDuplicatePaymentResult(
    invoiceId: string,
    stripePaymentIntentId: string
): Promise<ConfirmPaymentResult> {
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

async function processCheckoutSessionCompleted(
    event: Stripe.Event,
    webhookState: WebhookEventState
): Promise<ConfirmPaymentResult> {
    const session = event.data.object as Partial<Stripe.Checkout.Session>
    const invoiceId = resolveInvoiceId(session)
    const stripePaymentIntentId = resolveStripePaymentIntentId(session)

    if (webhookState !== 'process') {
        return buildDuplicatePaymentResult(invoiceId, stripePaymentIntentId)
    }

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
    } catch (error: unknown) {
        if (isPrismaUniqueConstraintError(error)) {
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

        throw error
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
}

export async function processStripeWebhookEvent({
    event,
    payload,
}: ProcessStripeWebhookEventInput): Promise<ProcessStripeWebhookEventResult> {
    const webhookState = await claimStripeWebhookEvent(event.id, event.type, payload)

    if (event.type !== 'checkout.session.completed') {
        if (webhookState === 'process') {
            await finalizeStripeWebhookEvent(event.id, 'processed')
        }

        return {
            kind: 'ignored',
            eventId: event.id,
            eventType: event.type,
        }
    }

    try {
        const result = await processCheckoutSessionCompleted(event, webhookState)

        return {
            kind: 'processed',
            result,
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed'
        await finalizeStripeWebhookEvent(event.id, 'failed', errorMessage)
        throw error
    }
}
