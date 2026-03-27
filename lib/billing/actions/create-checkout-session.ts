'use server'

import { revalidatePath } from 'next/cache'

import { getAppBaseUrl, getStripeClient } from '@/lib/billing/stripe'
import { prisma } from '@/lib/prisma'
import { createCheckoutSessionSchema } from '@/schema/billing'
import {
    type CheckoutSessionDTO,
    type CreateCheckoutSessionInput,
    type InvoiceLineItemDTO,
    type InvoiceStatus,
} from '@/types/billing'
import {
    getBillingAccessContext,
    isInvoiceCheckoutEligible,
    requireInvoiceWriteAccess,
} from '../access'

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
        where: { id: invoiceId, deletedAt: null },
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

    const invoiceStatus = invoice.status as InvoiceStatus

    if (!isInvoiceCheckoutEligible(invoiceStatus)) {
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
            data: { status: 'sent' },
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
                invoiceStatus,
            }),
            timestamp: new Date(),
        },
    })

    revalidatePath('/billing')
    revalidatePath(`/billing/${invoice.id}`)

    return { sessionId: checkoutSession.id, url: checkoutSession.url, invoiceId: invoice.id }
}
