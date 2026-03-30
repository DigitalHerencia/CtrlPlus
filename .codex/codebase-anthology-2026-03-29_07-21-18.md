---
generatedAt: 2026-03-29_07-21-18
sourceFolders: [types, schemas, lib, prisma]
---

# Codebase anthology - 2026-03-29_07-21-18

## Table of contents

- [/lib/actions/admin.actions.ts](#lib-actions-adminactionsts)
- [/lib/actions/auth.actions.ts](#lib-actions-authactionsts)
- [/lib/actions/billing.actions.ts](#lib-actions-billingactionsts)
- [/lib/actions/catalog.actions.ts](#lib-actions-catalogactionsts)
- [/lib/actions/platform.actions.ts](#lib-actions-platformactionsts)
- [/lib/actions/scheduling.actions.ts](#lib-actions-schedulingactionsts)
- [/lib/actions/settings.actions.ts](#lib-actions-settingsactionsts)
- [/lib/actions/visualizer.actions.ts](#lib-actions-visualizeractionsts)
- [/lib/auth/clerk.ts](#lib-auth-clerkts)
- [/lib/auth/identity.ts](#lib-auth-identityts)
- [/lib/auth/redirect.ts](#lib-auth-redirectts)
- [/lib/auth/session.ts](#lib-auth-sessionts)
- [/lib/authz/capabilities.ts](#lib-authz-capabilitiests)
- [/lib/authz/guards.ts](#lib-authz-guardsts)
- [/lib/authz/policy.ts](#lib-authz-policyts)
- [/lib/cache/cache-keys.ts](#lib-cache-cache-keysts)
- [/lib/cache/revalidate-tags.ts](#lib-cache-revalidate-tagsts)
- [/lib/cache/unstable-cache.ts](#lib-cache-unstable-cachets)
- [/lib/constants/app.ts](#lib-constants-appts)
- [/lib/constants/permissions.ts](#lib-constants-permissionsts)
- [/lib/constants/statuses.ts](#lib-constants-statusests)
- [/lib/db/prisma.ts](#lib-db-prismats)
- [/lib/db/selects/admin.selects.ts](#lib-db-selects-adminselectsts)
- [/lib/db/selects/auth.selects.ts](#lib-db-selects-authselectsts)
- [/lib/db/selects/billing.selects.ts](#lib-db-selects-billingselectsts)
- [/lib/db/selects/catalog.selects.ts](#lib-db-selects-catalogselectsts)
- [/lib/db/selects/platform.selects.ts](#lib-db-selects-platformselectsts)
- [/lib/db/selects/scheduling.selects.ts](#lib-db-selects-schedulingselectsts)
- [/lib/db/selects/settings.selects.ts](#lib-db-selects-settingsselectsts)
- [/lib/db/selects/visualizer.selects.ts](#lib-db-selects-visualizerselectsts)
- [/lib/db/transactions/admin.transactions.ts](#lib-db-transactions-admintransactionsts)
- [/lib/db/transactions/auth.transactions.ts](#lib-db-transactions-authtransactionsts)
- [/lib/db/transactions/billing.transactions.ts](#lib-db-transactions-billingtransactionsts)
- [/lib/db/transactions/catalog.transactions.ts](#lib-db-transactions-catalogtransactionsts)
- [/lib/db/transactions/platform.transactions.ts](#lib-db-transactions-platformtransactionsts)
- [/lib/db/transactions/scheduling.transactions.ts](#lib-db-transactions-schedulingtransactionsts)
- [/lib/db/transactions/settings.transactions.ts](#lib-db-transactions-settingstransactionsts)
- [/lib/db/transactions/visualizer.transactions.ts](#lib-db-transactions-visualizertransactionsts)
- [/lib/fetchers/admin.fetchers.ts](#lib-fetchers-adminfetchersts)
- [/lib/fetchers/auth.fetchers.ts](#lib-fetchers-authfetchersts)
- [/lib/fetchers/billing.fetchers.ts](#lib-fetchers-billingfetchersts)
- [/lib/fetchers/catalog.fetchers.ts](#lib-fetchers-catalogfetchersts)
- [/lib/fetchers/catalog.mappers.ts](#lib-fetchers-catalogmappersts)
- [/lib/fetchers/platform.fetchers.ts](#lib-fetchers-platformfetchersts)
- [/lib/fetchers/scheduling.fetchers.ts](#lib-fetchers-schedulingfetchersts)
- [/lib/fetchers/settings.fetchers.ts](#lib-fetchers-settingsfetchersts)
- [/lib/fetchers/visualizer.fetchers.ts](#lib-fetchers-visualizerfetchersts)
- [/lib/fetchers/visualizer.mappers.ts](#lib-fetchers-visualizermappersts)
- [/lib/integrations/blob.ts](#lib-integrations-blobts)
- [/lib/integrations/clerk.ts](#lib-integrations-clerkts)
- [/lib/integrations/cloudinary.ts](#lib-integrations-cloudinaryts)
- [/lib/integrations/huggingface.ts](#lib-integrations-huggingfacets)
- [/lib/integrations/stripe.ts](#lib-integrations-stripets)
- [/lib/uploads/file-validation.ts](#lib-uploads-file-validationts)
- [/lib/uploads/image-processing.ts](#lib-uploads-image-processingts)
- [/lib/uploads/storage.ts](#lib-uploads-storagets)
- [/lib/utils/assertions.ts](#lib-utils-assertionsts)
- [/lib/utils/cn.ts](#lib-utils-cnts)
- [/lib/utils/currency.ts](#lib-utils-currencyts)
- [/lib/utils/dates.ts](#lib-utils-datests)
- [/lib/utils/pagination.ts](#lib-utils-paginationts)
- [/lib/utils/search-params.ts](#lib-utils-search-paramsts)
- [/prisma/migrations/20260305170120_init/migration.sql](#prisma-migrations-20260305170120_init-migrationsql)
- [/prisma/migrations/20260305235900_add_user_and_clerk_webhook_event/migration.sql](#prisma-migrations-20260305235900_add_user_and_clerk_webhook_event-migrationsql)
- [/prisma/migrations/20260306004909_add_stripe_webhook_event/migration.sql](#prisma-migrations-20260306004909_add_stripe_webhook_event-migrationsql)
- [/prisma/migrations/20260306152117_add_clerk_webhook_event_tables/migration.sql](#prisma-migrations-20260306152117_add_clerk_webhook_event_tables-migrationsql)
- [/prisma/migrations/20260306194258_add_user_relation_to_membership/migration.sql](#prisma-migrations-20260306194258_add_user_relation_to_membership-migrationsql)
- [/prisma/migrations/20260307150000_add_clerk_webhook_status/migration.sql](#prisma-migrations-20260307150000_add_clerk_webhook_status-migrationsql)
- [/prisma/migrations/20260307193000_harden_neon_prisma_integration/migration.sql](#prisma-migrations-20260307193000_harden_neon_prisma_integration-migrationsql)
- [/prisma/migrations/20260308105459_add_clerkwebhookevent_status/migration.sql](#prisma-migrations-20260308105459_add_clerkwebhookevent_status-migrationsql)
- [/prisma/migrations/20260310190000_single_store_authz_rebuild/migration.sql](#prisma-migrations-20260310190000_single_store_authz_rebuild-migrationsql)
- [/prisma/migrations/20260311034334_single_store_authorization/migration.sql](#prisma-migrations-20260311034334_single_store_authorization-migrationsql)
- [/prisma/migrations/20260311063716_new/migration.sql](#prisma-migrations-20260311063716_new-migrationsql)
- [/prisma/migrations/20260313120000_catalog_visualizer_asset_security/migration.sql](#prisma-migrations-20260313120000_catalog_visualizer_asset_security-migrationsql)
- [/prisma/migrations/20260318113000_add_wrap_ai_prompt_fields/migration.sql](#prisma-migrations-20260318113000_add_wrap_ai_prompt_fields-migrationsql)
- [/prisma/migrations/20260323062347_new/migration.sql](#prisma-migrations-20260323062347_new-migrationsql)
- [/prisma/migrations/migration_lock.toml](#prisma-migrations-migration_locktoml)
- [/prisma/schema.prisma](#prisma-schemaprisma)
- [/schemas/admin.schemas.ts](#schemas-adminschemasts)
- [/schemas/api.schemas.ts](#schemas-apischemasts)
- [/schemas/auth.schemas.ts](#schemas-authschemasts)
- [/schemas/billing.schemas.ts](#schemas-billingschemasts)
- [/schemas/catalog.schemas.ts](#schemas-catalogschemasts)
- [/schemas/common.schemas.ts](#schemas-commonschemasts)
- [/schemas/platform.schemas.ts](#schemas-platformschemasts)
- [/schemas/scheduling.schemas.ts](#schemas-schedulingschemasts)
- [/schemas/settings.schemas.ts](#schemas-settingsschemasts)
- [/schemas/visualizer.schemas.ts](#schemas-visualizerschemasts)
- [/types/admin.types.ts](#types-admintypests)
- [/types/api.types.ts](#types-apitypests)
- [/types/auth.types.ts](#types-authtypests)
- [/types/billing.types.ts](#types-billingtypests)
- [/types/catalog.client.types.ts](#types-catalogclienttypests)
- [/types/catalog.types.ts](#types-catalogtypests)
- [/types/common.types.ts](#types-commontypests)
- [/types/platform.types.ts](#types-platformtypests)
- [/types/scheduling.client.types.ts](#types-schedulingclienttypests)
- [/types/scheduling.types.ts](#types-schedulingtypests)
- [/types/settings.types.ts](#types-settingstypests)
- [/types/visualizer.client.types.ts](#types-visualizerclienttypests)
- [/types/visualizer.types.ts](#types-visualizertypests)

---

## /lib/actions/admin.actions.ts


```ts
'use server'

import { getSession } from '@/lib/auth/session'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { createAdminInvoice } from '@/lib/db/transactions/billing.transactions'
import { confirmAdminAppointment } from '@/lib/db/transactions/scheduling.transactions'
import { createInvoiceSchema, confirmAppointmentSchema } from '@/schemas/admin.schemas'
import type { CreateInvoiceInput, ConfirmAppointmentInput } from '@/types/admin.types'

export async function createInvoice(input: CreateInvoiceInput) {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) throw new Error('Unauthorized')

    await requireOwnerOrPlatformAdmin()

    const parsed = createInvoiceSchema.parse(input)

    const result = await createAdminInvoice(prisma, {
        bookingId: parsed.bookingId,
        amountCents: parsed.amountCents,
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'admin.createInvoice',
            resourceType: 'Invoice',
            resourceId: result.invoiceId,
            details: JSON.stringify({ tenantId: parsed.tenantId, invoiceResult: result }),
        },
    })

    return result
}

export async function confirmAppointment(input: ConfirmAppointmentInput) {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized')
    }

    await requireOwnerOrPlatformAdmin()

    const parsed = confirmAppointmentSchema.parse(input)

    const result = await confirmAdminAppointment(prisma, {
        bookingId: parsed.bookingId,
        status: parsed.status,
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'admin.confirmAppointment',
            resourceType: 'Booking',
            resourceId: parsed.bookingId,
            details: JSON.stringify({ tenantId: parsed.tenantId, status: parsed.status }),
        },
    })

    return result
}

```

## /lib/actions/auth.actions.ts


```ts
'use server'

/**
 * Server actions for auth/domain mutations.
 * Call these helpers from server components, API routes, or other server actions.
 */
import { prisma } from '@/lib/db/prisma'
import type { GlobalRole } from '@/types/auth.types'

export async function upsertUserFromClerk(payload: {
    clerkUserId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
    globalRole?: GlobalRole | null
}) {
    const { clerkUserId, email, firstName, lastName, imageUrl, globalRole } = payload

    return prisma.user.upsert({
        where: { clerkUserId },
        create: {
            clerkUserId,
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            imageUrl: imageUrl ?? null,
            globalRole: globalRole ?? 'customer',
        },
        update: {
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            imageUrl: imageUrl ?? undefined,
            globalRole: globalRole ?? undefined,
            deletedAt: null,
        },
    })
}

```

## /lib/actions/billing.actions.ts


```ts
'use server'

import { revalidatePath } from 'next/cache'

import { getAppBaseUrl, getStripeClient } from '@/lib/integrations/stripe'
import { prisma } from '@/lib/db/prisma'
import {
    createCheckoutSessionSchema,
    ensureInvoiceForBookingSchema,
} from '@/schemas/billing.schemas'
import {
    type CheckoutSessionDTO,
    type CreateCheckoutSessionInput,
    type InvoiceLineItemDTO,
    type EnsureInvoiceForBookingInput,
    type EnsureInvoiceResult,
    type ConfirmPaymentResult,
} from '@/types/billing.types'
import { getBillingAccessContext, requireInvoiceWriteAccess } from '@/lib/authz/guards'
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

// --- webhook processor (kept here so callers import a single domain actions file)
export const STRIPE_WEBHOOK_ACTOR = 'system:stripe-webhook'

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
    payload: Prisma.InputJsonValue
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
    payload: Prisma.InputJsonValue
): Promise<WebhookEventState> {
    const now = new Date()

    try {
        await prisma.stripeWebhookEvent.create({
            data: {
                id: eventId,
                type: eventType,
                status: 'processing',
                payload,
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
                payload,
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

```

## /lib/actions/catalog.actions.ts


```ts
'use server'

import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { createWrapSchema, updateWrapSchema } from '@/schemas/catalog.schemas'
import {
    createWrapCategorySchema,
    setWrapCategoryMappingsSchema,
    updateWrapCategorySchema,
} from '@/schemas/catalog.schemas'
import { assertWrapIsPublishReady } from '@/lib/fetchers/catalog.mappers'
import { updateWrapImageMetadataSchema, wrapImageUploadSchema } from '@/schemas/catalog.schemas'
import {
    revalidateCatalogAndVisualizerPaths,
    revalidateCatalogPaths,
} from '@/lib/cache/revalidate-tags'
import {
    deletePersistedWrapImage,
    persistWrapImage,
    persistWrapImageFromBuffer,
} from '@/lib/uploads/storage'
import {
    validateWrapImageFile,
    MAX_WRAP_IMAGE_BYTES,
    ALLOWED_WRAP_IMAGE_MIME_TYPES,
} from '@/lib/uploads/file-validation'
import { readPhotoBuffer } from '@/lib/uploads/image-processing'
import { getCatalogWrapById, getWrapById } from '@/lib/fetchers/catalog.fetchers'
import {
    type CreateWrapCategoryInput,
    type CreateWrapInput,
    type SetWrapCategoryMappingsInput,
    type UpdateWrapCategoryInput,
    type UpdateWrapImageMetadataInput,
    type UpdateWrapInput,
    type WrapImageUploadInput,
} from '@/types/catalog.types'
import { WrapImageKind, type WrapImageKind as WrapImageKindType } from '@/lib/constants/statuses'
import type { WrapCategoryDTO, WrapDTO, WrapImageDTO } from '@/types/catalog.types'

type WrapImageRecord = {
    id: string
    url: string
    kind: string
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
}

function toWrapImageDTO(image: WrapImageRecord): WrapImageDTO {
    return {
        id: image.id,
        url: image.url,
        kind: image.kind as WrapImageKindType,
        isActive: image.isActive,
        version: image.version,
        contentHash: image.contentHash,
        displayOrder: image.displayOrder,
    }
}

async function assertWrapExists(wrapId: string): Promise<void> {
    const wrap = await prisma.wrap.findFirst({
        where: { id: wrapId, deletedAt: null },
        select: { id: true },
    })

    if (!wrap) {
        throw new Error('Forbidden: wrap not found')
    }
}

async function normalizeExclusiveActiveKinds(params: {
    wrapId: string
    kind: WrapImageKindType
    nextImageId?: string
}): Promise<void> {
    if (params.kind !== WrapImageKind.HERO && params.kind !== WrapImageKind.VISUALIZER_TEXTURE) {
        return
    }

    await prisma.wrapImage.updateMany({
        where: {
            wrapId: params.wrapId,
            deletedAt: null,
            kind: params.kind,
            ...(params.nextImageId ? { NOT: { id: params.nextImageId } } : {}),
        },
        data: { isActive: false },
    })
}

export async function createWrap(input: CreateWrapInput): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = createWrapSchema.parse(input)

    const created = await prisma.wrap.create({
        data: {
            name: parsed.name,
            description: parsed.description ?? null,
            price: parsed.price,
            installationMinutes: parsed.installationMinutes ?? null,
            aiPromptTemplate: parsed.aiPromptTemplate ?? null,
            aiNegativePrompt: parsed.aiNegativePrompt ?? null,
            isHidden: true,
        },
        select: { id: true },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.created',
            resourceType: 'Wrap',
            resourceId: created.id,
            details: JSON.stringify({
                name: parsed.name,
                priceInCents: parsed.price,
                aiPromptTemplate: parsed.aiPromptTemplate ?? null,
                aiNegativePrompt: parsed.aiNegativePrompt ?? null,
                isHidden: true,
            }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(created.id, { includeHidden: true })
    if (!wrap) {
        throw new Error('Failed to load created wrap')
    }

    revalidateCatalogPaths(created.id)

    return wrap
}

export async function deleteWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()

    const existing = await prisma.wrap.findFirst({
        where: { id: wrapId, deletedAt: null },
        include: {
            images: {
                where: { deletedAt: null },
                select: {
                    id: true,
                    url: true,
                    kind: true,
                    isActive: true,
                    version: true,
                    contentHash: true,
                    displayOrder: true,
                },
                orderBy: { displayOrder: 'asc' },
            },
            categoryMappings: {
                select: {
                    category: {
                        select: { id: true, name: true, slug: true, deletedAt: true },
                    },
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.wrap.update({
        where: { id: wrapId },
        data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.deleted',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ name: existing.name }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths(wrapId)

    return {
        id: existing.id,
        name: existing.name,
        description: existing.description,
        price: Number.isInteger(existing.price) ? existing.price : Math.round(existing.price),
        isHidden: existing.isHidden,
        installationMinutes: existing.installationMinutes,
        aiPromptTemplate: existing.aiPromptTemplate,
        aiNegativePrompt: existing.aiNegativePrompt,
        images: existing.images.map((image) => ({
            id: image.id,
            url: image.url,
            kind: image.kind as WrapImageDTO['kind'],
            isActive: image.isActive,
            version: image.version,
            contentHash: image.contentHash,
            displayOrder: image.displayOrder,
        })),
        categories: existing.categoryMappings
            .map((mapping) => mapping.category)
            .filter((category) => category.deletedAt === null)
            .map(({ ...category }) => category),
        createdAt: existing.createdAt.toISOString(),
        updatedAt: existing.updatedAt.toISOString(),
    }
}

export async function createWrapCategory(input: CreateWrapCategoryInput): Promise<WrapCategoryDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = createWrapCategorySchema.parse(input)

    const category = await prisma.wrapCategory.create({
        data: {
            name: parsed.name,
            slug: parsed.slug,
        },
        select: { id: true, name: true, slug: true },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.created',
            resourceType: 'WrapCategory',
            resourceId: category.id,
            details: JSON.stringify({ slug: category.slug }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths()

    return category
}

export async function updateWrapCategory(
    categoryId: string,
    input: UpdateWrapCategoryInput
): Promise<WrapCategoryDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapCategorySchema.parse(input)

    const result = await prisma.wrapCategory.updateMany({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        data: parsed,
    })

    if (result.count === 0) {
        throw new Error('Forbidden: category not found')
    }

    const category = await prisma.wrapCategory.findFirst({
        where: { id: categoryId, deletedAt: null },
        select: { id: true, name: true, slug: true },
    })

    if (!category) {
        throw new Error('Forbidden: category not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.updated',
            resourceType: 'WrapCategory',
            resourceId: category.id,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths()

    return category
}

export async function deleteWrapCategory(categoryId: string): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrapCategory.updateMany({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: category not found')
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            categoryId,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.deleted',
            resourceType: 'WrapCategory',
            resourceId: categoryId,
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths()
}

export async function setWrapCategoryMappings(input: SetWrapCategoryMappingsInput): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = setWrapCategoryMappingsSchema.parse(input)

    const wrap = await prisma.wrap.findFirst({
        where: {
            id: parsed.wrapId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (!wrap) {
        throw new Error('Forbidden: wrap not found')
    }

    if (parsed.categoryIds.length > 0) {
        const categories = await prisma.wrapCategory.findMany({
            where: {
                id: { in: parsed.categoryIds },
                deletedAt: null,
            },
            select: { id: true },
        })

        if (categories.length !== parsed.categoryIds.length) {
            throw new Error('Forbidden: one or more categories not found')
        }
    }

    await prisma.wrapCategoryMapping.deleteMany({
        where: {
            wrapId: parsed.wrapId,
        },
    })

    if (parsed.categoryIds.length > 0) {
        await prisma.wrapCategoryMapping.createMany({
            data: parsed.categoryIds.map((categoryId) => ({
                wrapId: parsed.wrapId,
                categoryId,
            })),
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapCategory.mappingsSet',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({ categoryIds: parsed.categoryIds }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogPaths(parsed.wrapId)
}

export async function addWrapImage(input: WrapImageUploadInput): Promise<WrapImageDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = wrapImageUploadSchema.parse(input)
    await assertWrapExists(parsed.wrapId)

    // parsed.fileKey is a server-side upload reference (data URL or approved remote URL)
    const photo = await readPhotoBuffer(parsed.fileKey)

    // basic validation
    if (!ALLOWED_WRAP_IMAGE_MIME_TYPES.has(photo.contentType)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP.')
    }

    if (photo.buffer.length <= 0 || photo.buffer.length > MAX_WRAP_IMAGE_BYTES) {
        throw new Error('Image exceeds size limit of 5MB.')
    }

    const stored = await persistWrapImageFromBuffer({
        wrapId: parsed.wrapId,
        buffer: photo.buffer,
        contentType: photo.contentType,
    })

    const maxDisplayOrder = await prisma.wrapImage.aggregate({
        where: { wrapId: parsed.wrapId, deletedAt: null },
        _max: { displayOrder: true },
    })

    const image = await prisma.wrapImage.create({
        data: {
            wrapId: parsed.wrapId,
            url: stored.url,
            kind: parsed.kind,
            isActive: parsed.isActive,
            version: 1,
            contentHash: stored.contentHash,
            displayOrder: (maxDisplayOrder._max.displayOrder ?? -1) + 1,
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
    })

    if (parsed.isActive) {
        await normalizeExclusiveActiveKinds({
            wrapId: parsed.wrapId,
            kind: parsed.kind,
            nextImageId: image.id,
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.added',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({
                wrapImageId: image.id,
                imageUrl: stored.url,
                kind: parsed.kind,
            }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogAndVisualizerPaths(parsed.wrapId)

    return toWrapImageDTO(image)
}

export async function updateWrapImageMetadata(
    input: UpdateWrapImageMetadataInput
): Promise<WrapImageDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapImageMetadataSchema.parse(input)
    await assertWrapExists(parsed.wrapId)

    const existing = await prisma.wrapImage.findFirst({
        where: {
            id: parsed.imageId,
            wrapId: parsed.wrapId,
            deletedAt: null,
        },
        select: {
            id: true,
            kind: true,
            isActive: true,
            version: true,
        },
    })

    if (!existing) {
        throw new Error('Image not found')
    }

    const nextKind = (parsed.kind ?? existing.kind) as WrapImageKindType
    const nextIsActive = parsed.isActive ?? existing.isActive
    const shouldBumpVersion = parsed.kind !== undefined || parsed.isActive !== undefined

    const updated = await prisma.wrapImage.update({
        where: { id: parsed.imageId },
        data: {
            ...(parsed.kind !== undefined ? { kind: parsed.kind } : {}),
            ...(parsed.isActive !== undefined ? { isActive: parsed.isActive } : {}),
            ...(shouldBumpVersion ? { version: existing.version + 1 } : {}),
        },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
    })

    if (nextIsActive) {
        await normalizeExclusiveActiveKinds({
            wrapId: parsed.wrapId,
            kind: nextKind,
            nextImageId: updated.id,
        })
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.metadataUpdated',
            resourceType: 'Wrap',
            resourceId: parsed.wrapId,
            details: JSON.stringify({
                imageId: parsed.imageId,
                changes: { kind: parsed.kind, isActive: parsed.isActive },
            }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogAndVisualizerPaths(parsed.wrapId)

    return toWrapImageDTO(updated)
}

export async function removeWrapImage(wrapId: string, imageId: string): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    await assertWrapExists(wrapId)

    const image = await prisma.wrapImage.findFirst({
        where: {
            id: imageId,
            wrapId,
            deletedAt: null,
        },
        select: { id: true, url: true },
    })

    if (!image) {
        throw new Error('Image not found')
    }

    await prisma.wrapImage.update({
        where: { id: imageId },
        data: { deletedAt: new Date() },
    })

    await deletePersistedWrapImage(image.url)

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.removed',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ wrapImageId: imageId }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogAndVisualizerPaths(wrapId)
}

export async function reorderWrapImages(wrapId: string, imageIdsInOrder: string[]): Promise<void> {
    const session = await requireOwnerOrPlatformAdmin()
    await assertWrapExists(wrapId)

    const existing = await prisma.wrapImage.findMany({
        where: {
            wrapId,
            deletedAt: null,
        },
        select: { id: true },
    })

    if (existing.length !== imageIdsInOrder.length) {
        throw new Error('Image reorder payload does not match wrap image set.')
    }

    const existingIds = new Set(existing.map((image) => image.id))
    for (const imageId of imageIdsInOrder) {
        if (!existingIds.has(imageId)) {
            throw new Error('Image reorder payload contains invalid image IDs.')
        }
    }

    await prisma.$transaction(
        imageIdsInOrder.map((imageId, index) =>
            prisma.wrapImage.update({
                where: { id: imageId },
                data: { displayOrder: index },
            })
        )
    )

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrapImage.reordered',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ imageIdsInOrder }),
            timestamp: new Date(),
        },
    })

    revalidateCatalogAndVisualizerPaths(wrapId)
}

export async function publishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const wrap = await getCatalogWrapById(wrapId, { includeHidden: true })

    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    assertWrapIsPublishReady(wrap.readiness)

    await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: false,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.published',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                readiness: wrap.readiness,
            }),
            timestamp: new Date(),
        },
    })

    const publishedWrap = await getWrapById(wrapId, { includeHidden: true })
    if (!publishedWrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return publishedWrap
}

export async function unpublishWrap(wrapId: string): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()

    const result = await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data: {
            isHidden: true,
        },
    })

    if (result.count === 0) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.unpublished',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({
                isHidden: true,
            }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(wrapId, { includeHidden: true })
    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogAndVisualizerPaths(wrapId)

    return wrap
}

export async function updateWrap(wrapId: string, input: UpdateWrapInput): Promise<WrapDTO> {
    const session = await requireOwnerOrPlatformAdmin()
    const parsed = updateWrapSchema.parse(input)

    const existing = await prisma.wrap.findFirst({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        select: {
            id: true,
            isHidden: true,
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    const data = Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => value !== undefined)
    ) as Record<string, unknown>

    const result = await prisma.wrap.updateMany({
        where: {
            id: wrapId,
            deletedAt: null,
        },
        data,
    })

    if (result.count === 0) {
        throw new Error('Forbidden: resource not found')
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId ?? 'system',
            action: 'wrap.updated',
            resourceType: 'Wrap',
            resourceId: wrapId,
            details: JSON.stringify({ changes: parsed }),
            timestamp: new Date(),
        },
    })

    const wrap = await getWrapById(wrapId, { includeHidden: true })
    if (!wrap) {
        throw new Error('Forbidden: resource not found')
    }

    revalidateCatalogPaths(wrapId)

    return wrap
}

```

## /lib/actions/platform.actions.ts


```ts
'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'

import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import { processStripeWebhookEvent } from '@/lib/actions/billing.actions'
import { resetWebhookLocksSchema } from '@/schemas/platform.schemas'
import type { ResetWebhookLocksInput } from '@/types/platform.types'
import type { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import type Stripe from 'stripe'

import type { WebhookMutationResultDTO, WebhookReplayResultDTO } from '@/types/platform.types'

export async function pruneOldPreviews(): Promise<void> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    requireCapability(session.authz, 'dashboard.owner')

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)

    const result = await prisma.visualizerPreview.updateMany({
        where: {
            deletedAt: null,
            createdAt: { lt: cutoff },
        },
        data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'platform.pruneOldPreviews',
            resourceType: 'VisualizerPreview',
            resourceId: '',
            details: JSON.stringify({ prunedCount: result.count }),
            timestamp: new Date(),
        },
    })
}

function getStoredStripeEvent(
    payload: unknown,
    eventId: string,
    eventType: string
): Stripe.Event | null {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return null
    }

    const candidate = payload as Partial<Stripe.Event>
    if (candidate.id !== eventId || candidate.type !== eventType) {
        return null
    }

    if (!candidate.data || typeof candidate.data !== 'object' || !('object' in candidate.data)) {
        return null
    }

    return candidate as Stripe.Event
}

export async function clearStuckWebhookProcessingEvents(): Promise<WebhookMutationResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const staleCutoff = new Date(Date.now() - 5 * 60_000)

    const [releasedClerk, releasedStripe] = await prisma.$transaction([
        prisma.clerkWebhookEvent.updateMany({
            where: {
                status: 'processing',
                processedAt: {
                    lt: staleCutoff,
                },
            },
            data: {
                status: 'failed',
                processedAt: new Date(),
                error: 'Processing lock released by platform admin.',
            },
        }),
        prisma.stripeWebhookEvent.updateMany({
            where: {
                status: 'processing',
                processedAt: {
                    lt: staleCutoff,
                },
            },
            data: {
                status: 'failed',
                processedAt: new Date(),
                error: 'Processing lock released by platform admin.',
            },
        }),
    ])

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'PLATFORM_WEBHOOK_STALE_LOCKS_CLEARED',
            resourceType: 'WebhookEvent',
            resourceId: 'platform:webhook-locks',
            details: JSON.stringify({
                staleCutoff: staleCutoff.toISOString(),
                clerkAffectedCount: releasedClerk.count,
                stripeAffectedCount: releasedStripe.count,
            }),
        },
    })

    revalidatePath('/platform')

    return {
        affectedCount: releasedClerk.count + releasedStripe.count,
        clerkAffectedCount: releasedClerk.count,
        stripeAffectedCount: releasedStripe.count,
    }
}

export async function replayStripeWebhookFailures(rawInput: {
    eventIds: string[]
}): Promise<WebhookReplayResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const input = resetWebhookLocksSchema.pick({ eventIds: true }).parse(rawInput)
    const failedEvents = await prisma.stripeWebhookEvent.findMany({
        where: {
            id: { in: input.eventIds },
            status: 'failed',
        },
        select: { id: true, type: true, payload: true },
    })

    const failedEventMap = new Map(failedEvents.map((event) => [event.id, event]))
    let replayedCount = 0
    let ignoredCount = 0
    let nonReplayableCount = 0
    let failedCount = 0
    const failedIds: string[] = []
    const ignoredIds: string[] = []
    const nonReplayableIds: string[] = []

    for (const eventId of input.eventIds) {
        const event = failedEventMap.get(eventId)

        if (!event) {
            failedCount += 1
            failedIds.push(eventId)
            continue
        }

        const storedEvent = getStoredStripeEvent(event.payload, event.id, event.type)
        if (!storedEvent) {
            nonReplayableCount += 1
            nonReplayableIds.push(event.id)
            continue
        }

        try {
            const result = await processStripeWebhookEvent({
                event: storedEvent,
                payload: event.payload as unknown as Prisma.InputJsonValue,
            })

            if (result.kind === 'ignored') {
                ignoredCount += 1
                ignoredIds.push(event.id)
                continue
            }

            replayedCount += 1
        } catch {
            failedCount += 1
            failedIds.push(event.id)
        }
    }

    await prisma.auditLog.create({
        data: {
            userId: session.userId,
            action: 'PLATFORM_STRIPE_WEBHOOK_REPLAY_REQUESTED',
            resourceType: 'StripeWebhookEvent',
            resourceId: input.eventIds.join(','),
            details: JSON.stringify({
                requestedIds: input.eventIds,
                replayedCount,
                ignoredCount,
                nonReplayableCount,
                failedCount,
                ignoredIds,
                nonReplayableIds,
                failedIds,
            }),
        },
    })

    revalidatePath('/platform')

    return {
        requestedCount: input.eventIds.length,
        replayedCount,
        ignoredCount,
        nonReplayableCount,
        failedCount,
    }
}

export async function resetFailedWebhookLocks(rawInput: {
    source: 'clerk' | 'stripe'
    eventIds: string[]
}): Promise<WebhookMutationResultDTO> {
    const session = await requirePlatformDeveloperAdmin()

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const input = resetWebhookLocksSchema.parse(rawInput as ResetWebhookLocksInput)

    if (input.source === 'clerk') {
        throw new Error(
            'Clerk replay remains owned by auth/authz and is not available from platform.'
        )
    }

    const result = await replayStripeWebhookFailures({ eventIds: input.eventIds })

    return {
        affectedCount: result.replayedCount + result.ignoredCount,
        clerkAffectedCount: 0,
        stripeAffectedCount: result.replayedCount + result.ignoredCount,
    }
}

```

## /lib/actions/scheduling.actions.ts


```ts
'use server'

import { getSession } from '@/lib/auth/session'
import { requireCustomerOwnedResourceAccess } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import { reserveSlotSchema, updateBookingSchema } from '@/schemas/scheduling.schemas'
import { assertSlotHasCapacity } from '@/lib/db/transactions/scheduling.transactions'
import { ensureInvoiceForBooking } from '@/lib/actions/billing.actions'
import {
    revalidateBillingBookingRoute,
    revalidateSchedulingPages,
} from '@/lib/cache/revalidate-tags'
import type {
    ReserveSlotInput,
    ReservedBookingDTO,
    BookingDTO,
    CreatedBookingDTO,
    UpdateBookingInput,
    BookingActionDTO,
} from '@/types/scheduling.types'
import { getBookingDisplayStatus } from '@/lib/constants/statuses'
import { Prisma } from '@prisma/client'

// Reservation TTL (minutes)
export const RESERVATION_TTL_MINUTES = 15

export async function reserveSlot(input: ReserveSlotInput): Promise<ReservedBookingDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = reserveSlotSchema.parse(input)

    return prisma.$transaction(
        async (tx) => {
            const now = new Date()
            const expiresAt = new Date(now.getTime() + RESERVATION_TTL_MINUTES * 60 * 1000)

            const wrap = await tx.wrap.findFirst({
                where: {
                    id: parsed.wrapId,
                    deletedAt: null,
                    ...(!session.isOwner && !session.isPlatformAdmin ? { isHidden: false } : {}),
                },
                select: { id: true, name: true, price: true, isHidden: true },
            })

            if (!wrap) {
                throw new Error('Wrap not found')
            }

            await assertSlotHasCapacity(tx, {
                startTime: parsed.startTime,
                endTime: parsed.endTime,
                now,
            })

            const existingReservation = await tx.bookingReservation.findFirst({
                where: {
                    expiresAt: { gt: now },
                    booking: {
                        customerId: userId,
                        status: 'pending',
                        deletedAt: null,
                    },
                },
                select: { id: true },
            })

            if (existingReservation) {
                throw new Error('You already have an active reservation')
            }

            const booking = await tx.booking.create({
                data: {
                    customerId: userId,
                    wrapId: parsed.wrapId,
                    startTime: parsed.startTime,
                    endTime: parsed.endTime,
                    status: 'pending',
                    totalPrice: wrap.price,
                    reservation: {
                        create: {
                            expiresAt,
                        },
                    },
                },
                select: {
                    id: true,
                    wrapId: true,
                    startTime: true,
                    endTime: true,
                    status: true,
                    totalPrice: true,
                },
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'RESERVE_SLOT',
                    resourceType: 'Booking',
                    resourceId: booking.id,
                    details: JSON.stringify({
                        wrapId: booking.wrapId,
                        status: booking.status,
                        startTime: booking.startTime.toISOString(),
                        endTime: booking.endTime.toISOString(),
                        reservationExpiresAt: expiresAt.toISOString(),
                    }),
                    timestamp: now,
                },
            })

            return {
                id: booking.id,
                wrapId: booking.wrapId,
                wrapName: wrap.name,
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
                status: booking.status as ReservedBookingDTO['status'],
                totalPrice: booking.totalPrice,
                reservationExpiresAt: expiresAt.toISOString(),
                displayStatus: 'reserved',
            }
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )
}

export async function createBooking(input: ReserveSlotInput): Promise<CreatedBookingDTO> {
    const booking = await reserveSlot(input)
    const { invoiceId } = await ensureInvoiceForBooking({ bookingId: booking.id })
    revalidateSchedulingPages()
    revalidateBillingBookingRoute(invoiceId)

    return {
        invoiceId,
        ...booking,
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reservationExpiresAt: booking.reservationExpiresAt,
        displayStatus: booking.displayStatus,
    }
}

export async function updateBooking(
    bookingId: string,
    input: UpdateBookingInput
): Promise<BookingActionDTO> {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const parsed = updateBookingSchema.parse(input)
    const { startTime, endTime } = parsed

    const existing = await prisma.booking.findFirst({
        where: { id: bookingId, deletedAt: null },
        select: {
            id: true,
            customerId: true,
            startTime: true,
            endTime: true,
            status: true,
            wrap: {
                select: {
                    name: true,
                },
            },
            reservation: {
                select: {
                    expiresAt: true,
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const booking = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            await assertSlotHasCapacity(tx, {
                startTime,
                endTime,
                excludeBookingId: bookingId,
            })

            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { startTime, endTime },
            })

            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'UPDATE_BOOKING',
                    resourceType: 'Booking',
                    resourceId: updatedBooking.id,
                    details: JSON.stringify({
                        previousStartTime: existing.startTime.toISOString(),
                        previousEndTime: existing.endTime.toISOString(),
                        newStartTime: startTime.toISOString(),
                        newEndTime: endTime.toISOString(),
                    }),
                    timestamp: new Date(),
                },
            })

            return updatedBooking
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )

    revalidateSchedulingPages()

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        wrapName: existing.wrap.name,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status as BookingActionDTO['status'],
        totalPrice: booking.totalPrice,
        reservationExpiresAt: existing.reservation?.expiresAt
            ? existing.reservation.expiresAt.toISOString()
            : null,
        displayStatus: getBookingDisplayStatus(
            booking.status as BookingActionDTO['status'],
            existing.reservation?.expiresAt ?? null
        ),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
}

export async function confirmBooking(bookingId: string) {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const result = await prisma.$transaction(async (tx) => {
        const now = new Date()

        const booking = await tx.booking.findFirst({
            where: {
                id: bookingId,
                deletedAt: null,
            },
            select: {
                id: true,
                customerId: true,
                wrapId: true,
                wrap: {
                    select: {
                        name: true,
                    },
                },
                startTime: true,
                endTime: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                updatedAt: true,
                reservation: {
                    select: {
                        id: true,
                        expiresAt: true,
                    },
                },
            },
        })

        if (!booking) {
            throw new Error('Forbidden: resource not found')
        }

        requireCustomerOwnedResourceAccess(session.authz, booking.customerId)

        if (booking.status !== 'pending') {
            throw new Error('Only pending bookings can be confirmed')
        }

        if (!booking.reservation || booking.reservation.expiresAt <= now) {
            throw new Error('Reservation has expired; please reserve again')
        }

        const confirmed = await tx.booking.update({
            where: { id: booking.id },
            data: {
                status: 'confirmed',
                reservation: {
                    delete: true,
                },
            },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CONFIRM_BOOKING',
                resourceType: 'Booking',
                resourceId: confirmed.id,
                details: JSON.stringify({
                    previousStatus: booking.status,
                    confirmedAt: now.toISOString(),
                }),
                timestamp: now,
            },
        })

        return {
            id: confirmed.id,
            customerId: confirmed.customerId,
            wrapId: confirmed.wrapId,
            wrapName: booking.wrap.name,
            startTime: confirmed.startTime,
            endTime: confirmed.endTime,
            status: 'confirmed' as const,
            totalPrice: confirmed.totalPrice,
            reservationExpiresAt: null,
            displayStatus: 'confirmed' as const,
            createdAt: confirmed.createdAt,
            updatedAt: confirmed.updatedAt,
        }
    })

    revalidateSchedulingPages()

    return result
}

export async function cancelBooking(bookingId: string) {
    const session = await getSession()
    const userId = session.userId

    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const existing = await prisma.booking.findFirst({
        where: { id: bookingId, deletedAt: null },
        select: {
            id: true,
            customerId: true,
            status: true,
            wrap: {
                select: {
                    name: true,
                },
            },
        },
    })

    if (!existing) {
        throw new Error('Forbidden: resource not found')
    }

    requireCustomerOwnedResourceAccess(session.authz, existing.customerId)

    const booking = await prisma.$transaction(async (tx) => {
        await tx.bookingReservation.deleteMany({ where: { bookingId } })

        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: 'cancelled',
            },
        })

        await tx.auditLog.create({
            data: {
                userId,
                action: 'CANCEL_BOOKING',
                resourceType: 'Booking',
                resourceId: updated.id,
                details: JSON.stringify({ previousStatus: existing.status }),
                timestamp: new Date(),
            },
        })

        return updated
    })

    revalidateSchedulingPages()

    return {
        id: booking.id,
        customerId: booking.customerId,
        wrapId: booking.wrapId,
        wrapName: existing.wrap.name,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
        totalPrice: booking.totalPrice,
        reservationExpiresAt: null,
        displayStatus: 'cancelled',
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
    }
}

export interface CleanupExpiredReservationsInput {
    now?: Date
    limit?: number
}

export interface CleanupExpiredReservationsResult {
    processedReservationIds: string[]
    processedBookingIds: string[]
}

export async function cleanupExpiredReservations(
    input: CleanupExpiredReservationsInput = {}
): Promise<CleanupExpiredReservationsResult> {
    const now = input.now ?? new Date()
    const limit = input.limit ?? 100

    const expired = await prisma.bookingReservation.findMany({
        where: {
            expiresAt: { lte: now },
            booking: {
                deletedAt: null,
                status: 'pending',
            },
        },
        select: {
            id: true,
            bookingId: true,
            booking: {
                select: {
                    customerId: true,
                },
            },
        },
        take: limit,
        orderBy: { expiresAt: 'asc' },
    })

    if (expired.length === 0) {
        return { processedReservationIds: [], processedBookingIds: [] }
    }

    const bookingIds = expired.map((item) => item.bookingId)
    const reservationIds = expired.map((item) => item.id)

    await prisma.$transaction(async (tx) => {
        await tx.booking.updateMany({
            where: {
                id: { in: bookingIds },
                status: 'pending',
                deletedAt: null,
            },
            data: {
                status: 'cancelled',
                deletedAt: now,
            },
        })

        await tx.bookingReservation.deleteMany({
            where: {
                id: { in: reservationIds },
            },
        })

        await tx.auditLog.createMany({
            data: expired.map((record) => ({
                userId: record.booking.customerId,
                action: 'EXPIRE_BOOKING_RESERVATION',
                resourceType: 'Booking',
                resourceId: record.bookingId,
                details: JSON.stringify({ reservationId: record.id, expiredAt: now.toISOString() }),
                timestamp: now,
            })),
        })
    })

    revalidateSchedulingPages()

    return {
        processedReservationIds: reservationIds,
        processedBookingIds: bookingIds,
    }
}

```

## /lib/actions/settings.actions.ts


```ts
'use server'

import { requireAuthzCapability } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { websiteSettingsSchema } from '@/schemas/settings.schemas'
import { type WebsiteSettingsDTO, type WebsiteSettingsInput } from '@/types/settings.types'
import { createWebsiteSettingsDTO } from '@/lib/fetchers/settings.fetchers'

export async function updateUserWebsiteSettings(
    input: WebsiteSettingsInput
): Promise<WebsiteSettingsDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const userId = session.userId
    const parsed = websiteSettingsSchema.parse(input)
    const updated = await prisma.websiteSettings.upsert({
        where: { clerkUserId: userId },
        create: {
            clerkUserId: userId,
            preferredContact: parsed.preferredContact,
            appointmentReminders: parsed.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn,
            timezone: parsed.timezone,
        },
        update: {
            preferredContact: parsed.preferredContact,
            appointmentReminders: parsed.appointmentReminders,
            marketingOptIn: parsed.marketingOptIn,
            timezone: parsed.timezone,
        },
        select: {
            preferredContact: true,
            appointmentReminders: true,
            marketingOptIn: true,
            timezone: true,
            updatedAt: true,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'WEBSITE_SETTINGS_UPDATED',
            resourceType: 'WebsiteSettings',
            resourceId: userId,
            details: JSON.stringify(parsed),
            timestamp: new Date(),
        },
    })

    revalidatePath('/settings')

    return createWebsiteSettingsDTO(
        {
            preferredContact: updated.preferredContact as 'email' | 'sms',
            appointmentReminders: updated.appointmentReminders,
            marketingOptIn: updated.marketingOptIn,
            timezone: updated.timezone,
        },
        updated.updatedAt
    )
}

```

## /lib/actions/visualizer.actions.ts


```ts
'use server'

import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { buildVisualizerCacheKey } from '@/lib/cache/cache-keys'
import { prisma } from '@/lib/db/prisma'
import {
    createWrapPreviewGeneratorAdapter,
    HuggingFacePreviewUnavailableError,
    visualizerConfig,
} from '@/lib/integrations/huggingface'
import { getVisualizerWrapSelectionById } from '@/lib/fetchers/visualizer.fetchers'
import { toVisualizerPreviewDTO } from '@/lib/fetchers/visualizer.mappers'
import {
    buildPreviewConditioningBoard,
    buildWrapPreviewPrompt,
    generateDeterministicCompositePreview,
    normalizeVehicleUpload,
    normalizeVehicleBuffer,
    readImageBufferFromUrl,
    readPhotoBuffer,
} from '@/lib/uploads/image-processing'
import { storePreviewImage } from '@/lib/uploads/storage'
import {
    createVisualizerPreviewSchema,
    processVisualizerPreviewSchema,
    regenerateVisualizerPreviewSchema,
} from '@/schemas/visualizer.schemas'
import type { ProcessVisualizerPreviewInput, VisualizerPreviewDTO } from '@/types/visualizer.types'
import type { RegenerateVisualizerPreviewInput } from '@/types/visualizer.types'

function buildVisualizerPromptForWrap(
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
) {
    return buildWrapPreviewPrompt({
        name: wrap.name,
        description: wrap.description,
        aiPromptTemplate: wrap.aiPromptTemplate,
        aiNegativePrompt: wrap.aiNegativePrompt,
    })
}

async function resolveVisualizerGenerationAssets(
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
) {
    const [textureBuffer, prompt] = await Promise.all([
        readImageBufferFromUrl(wrap.visualizerTextureImage.url),
        Promise.resolve(buildVisualizerPromptForWrap(wrap)),
    ])

    return {
        textureBuffer,
        prompt,
    }
}

async function executeVisualizerPreviewGeneration(params: {
    previewId: string
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    wrap: NonNullable<Awaited<ReturnType<typeof getVisualizerWrapSelectionById>>>
    prompt: ReturnType<typeof buildWrapPreviewPrompt>
}): Promise<{
    processedImageUrl: string
    promptVersion: string
    generationFallbackReason: string | null
}> {
    try {
        const adapter = createWrapPreviewGeneratorAdapter()
        const boardBuffer = await buildPreviewConditioningBoard({
            vehicleBuffer: params.vehicleBuffer,
            textureBuffer: params.textureBuffer,
            wrapName: params.wrap.name,
            wrapDescription: params.wrap.description,
        })
        const generatedBuffer = await adapter.generate({
            boardBuffer,
            prompt: params.prompt.prompt,
            negativePrompt: params.prompt.negativePrompt,
        })

        return {
            processedImageUrl: await storePreviewImage({
                previewId: params.previewId,
                buffer: generatedBuffer,
                contentType: 'image/png',
            }),
            promptVersion: params.prompt.promptVersion,
            generationFallbackReason: null,
        }
    } catch (error) {
        const fallbackReason =
            error instanceof HuggingFacePreviewUnavailableError
                ? error.message
                : error instanceof Error
                  ? error.message
                  : 'Hugging Face preview generation failed.'

        return {
            processedImageUrl: await generateDeterministicCompositePreview({
                previewId: params.previewId,
                photoBuffer: params.vehicleBuffer,
                textureBuffer: params.textureBuffer,
            }),
            promptVersion: params.prompt.promptVersion,
            generationFallbackReason: fallbackReason,
        }
    }
}

export async function createVisualizerPreview(
    input: RegenerateVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = createVisualizerPreviewSchema.parse(input)
    const photo = await readPhotoBuffer(parsed.fileKey)
    const normalizedVehicle = await normalizeVehicleBuffer(photo.buffer, photo.contentType)
    const includeHidden = session.isOwner || session.isPlatformAdmin

    const wrap = await getVisualizerWrapSelectionById(parsed.wrapId, { includeHidden })
    if (!wrap) {
        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    const prompt = buildVisualizerPromptForWrap(wrap)

    const cacheKey = buildVisualizerCacheKey({
        wrapId: wrap.id,
        ownerUserId: userId,
        customerPhotoHash: normalizedVehicle.hash,
        sourceWrapImageId: wrap.visualizerTextureImage.id,
        sourceAssetVersion: wrap.visualizerTextureImage.version,
        generationMode: 'hf-primary-with-deterministic-fallback',
        generationModel: visualizerConfig.previewModel || 'deterministic-fallback',
        promptVersion: prompt.promptVersion,
        blendMode: visualizerConfig.blendMode,
        opacity: visualizerConfig.overlayOpacity,
    })

    const reusablePreview = await prisma.visualizerPreview.findFirst({
        where: {
            cacheKey,
            ownerClerkUserId: userId,
            deletedAt: null,
            status: 'complete',
            processedImageUrl: {
                not: null,
            },
            expiresAt: {
                gt: new Date(),
            },
        },
    })

    if (reusablePreview) {
        return toVisualizerPreviewDTO(reusablePreview)
    }

    const customerPhotoUrl = await storePreviewImage({
        previewId: `vehicle-${cacheKey}`,
        buffer: normalizedVehicle.buffer,
        contentType: normalizedVehicle.contentType,
    })

    const preview = await prisma.visualizerPreview.create({
        data: {
            wrapId: wrap.id,
            ownerClerkUserId: userId,
            customerPhotoUrl,
            processedImageUrl: null,
            status: 'pending',
            cacheKey,
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.created',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: wrap.id,
                cacheKey,
                promptVersion: prompt.promptVersion,
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            }),
            timestamp: new Date(),
        },
    })

    return toVisualizerPreviewDTO(preview)
}

export async function regenerateVisualizerPreview(
    input: RegenerateVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = regenerateVisualizerPreviewSchema.parse(input)
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: parsed.previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
    })

    if (!preview) {
        throw new Error('Preview not found.')
    }

    const wrap = await getVisualizerWrapSelectionById(preview.wrapId, {
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })
    if (!wrap) {
        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    const resetPreview = await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'pending',
            processedImageUrl: null,
            expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
        },
    })

    await prisma.auditLog.create({
        data: {
            userId,
            action: 'visualizerPreview.regenerated',
            resourceType: 'VisualizerPreview',
            resourceId: preview.id,
            details: JSON.stringify({
                wrapId: wrap.id,
                cacheKey: preview.cacheKey,
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            }),
            timestamp: new Date(),
        },
    })

    return toVisualizerPreviewDTO(resetPreview)
}

export async function processVisualizerPreview(
    input: ProcessVisualizerPreviewInput
): Promise<VisualizerPreviewDTO> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        throw new Error('Unauthorized: not authenticated')
    }
    requireCapability(session.authz, 'visualizer.use')

    const parsed = processVisualizerPreviewSchema.parse(input)
    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: parsed.previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
    })

    if (!preview) {
        throw new Error('Preview not found.')
    }

    if (preview.status === 'complete' && preview.processedImageUrl) {
        return toVisualizerPreviewDTO(preview)
    }

    const wrap = await getVisualizerWrapSelectionById(preview.wrapId, {
        includeHidden: session.isOwner || session.isPlatformAdmin,
    })
    if (!wrap) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
            },
        })

        throw new Error('Wrap not found or is not visualizer-ready.')
    }

    await prisma.visualizerPreview.update({
        where: { id: preview.id },
        data: {
            status: 'processing',
            processedImageUrl: null,
            sourceWrapImageId: wrap.visualizerTextureImage.id,
            sourceWrapImageVersion: wrap.visualizerTextureImage.version,
        },
    })

    try {
        const [{ buffer: vehicleBuffer }, { textureBuffer, prompt }] = await Promise.all([
            readPhotoBuffer(preview.customerPhotoUrl),
            resolveVisualizerGenerationAssets(wrap),
        ])

        const result = await executeVisualizerPreviewGeneration({
            previewId: preview.id,
            vehicleBuffer,
            textureBuffer,
            wrap,
            prompt,
        })

        const completedPreview = await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'complete',
                processedImageUrl: result.processedImageUrl,
                expiresAt: new Date(Date.now() + visualizerConfig.previewTtlMs),
                sourceWrapImageId: wrap.visualizerTextureImage.id,
                sourceWrapImageVersion: wrap.visualizerTextureImage.version,
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'visualizerPreview.processed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    promptVersion: result.promptVersion,
                    sourceWrapImageId: wrap.visualizerTextureImage.id,
                    sourceWrapImageVersion: wrap.visualizerTextureImage.version,
                    generationFallbackReason: result.generationFallbackReason,
                }),
                timestamp: new Date(),
            },
        })

        return toVisualizerPreviewDTO(completedPreview)
    } catch (error) {
        await prisma.visualizerPreview.update({
            where: { id: preview.id },
            data: {
                status: 'failed',
            },
        })

        await prisma.auditLog.create({
            data: {
                userId,
                action: 'visualizerPreview.processingFailed',
                resourceType: 'VisualizerPreview',
                resourceId: preview.id,
                details: JSON.stringify({
                    wrapId: wrap.id,
                    cacheKey: preview.cacheKey,
                    sourceWrapImageId: wrap.visualizerTextureImage.id,
                    sourceWrapImageVersion: wrap.visualizerTextureImage.version,
                    error: error instanceof Error ? error.message : 'Preview generation failed.',
                }),
                timestamp: new Date(),
            },
        })

        throw new Error(error instanceof Error ? error.message : 'Preview generation failed.')
    }
}

```

## /lib/auth/clerk.ts


```ts
import 'server-only'

export { verifyAndParseClerkWebhook } from '@/lib/integrations/clerk'

```

## /lib/auth/identity.ts


```ts
import 'server-only'
import { type GlobalRole } from '@/types/auth.types'
import { prisma } from '@/lib/db/prisma'

function readOptionalEnv(name: 'STORE_OWNER_CLERK_USER_ID' | 'PLATFORM_DEV_CLERK_USER_ID') {
    const value = process.env[name]?.trim()
    return value && value.length > 0 ? value : null
}

export function getStoreOwnerClerkUserId(): string | null {
    return readOptionalEnv('STORE_OWNER_CLERK_USER_ID')
}

export function getPlatformDevClerkUserId(): string | null {
    return readOptionalEnv('PLATFORM_DEV_CLERK_USER_ID')
}

function isGlobalRole(value: string | null | undefined): value is GlobalRole {
    return value === 'customer' || value === 'owner' || value === 'admin'
}

export function resolveGlobalRoleOverrideForClerkUserId(clerkUserId: string): GlobalRole | null {
    const platformDevClerkUserId = getPlatformDevClerkUserId()
    if (platformDevClerkUserId && clerkUserId === platformDevClerkUserId) {
        return 'admin'
    }

    const ownerClerkUserId = getStoreOwnerClerkUserId()
    if (ownerClerkUserId && clerkUserId === ownerClerkUserId) {
        return 'owner'
    }

    return null
}

/**
 * Hybrid role resolution:
 * 1) explicit env overrides (for bootstrap/dev safety),
 * 2) persisted DB role fallback,
 * 3) default customer.
 */
export async function resolveGlobalRoleForClerkUserId(clerkUserId: string): Promise<GlobalRole> {
    const overrideRole = resolveGlobalRoleOverrideForClerkUserId(clerkUserId)
    if (overrideRole) {
        return overrideRole
    }

    const user = await prisma.user.findFirst({
        where: {
            clerkUserId,
            deletedAt: null,
        },
        select: {
            globalRole: true,
        },
    })

    if (isGlobalRole(user?.globalRole)) {
        return user.globalRole
    }

    return 'customer'
}

```

## /lib/auth/redirect.ts


```ts
const DEFAULT_POST_AUTH_REDIRECT = '/catalog'

export function sanitizePostAuthRedirect(redirectUrl?: string | null): string {
    if (!redirectUrl) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
        return DEFAULT_POST_AUTH_REDIRECT
    }

    return redirectUrl
}

```

## /lib/auth/session.ts


```ts
import 'server-only'
import { resolveGlobalRoleForClerkUserId } from '@/lib/auth/identity'
import { type AuthzContext } from '@/types/auth.types'
import { type Session, type SessionContext, type SessionUser } from '@/types/auth.types'
import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'

/**
 * Resolves the current authenticated user and authorization role from Clerk.
 */
export const getSession = cache(async (): Promise<SessionContext> => {
    const { userId: clerkUserId } = await auth()
    const isAuthenticated = Boolean(clerkUserId)
    const resolvedClerkUserId = clerkUserId ?? null
    const role =
        resolvedClerkUserId && isAuthenticated
            ? await resolveGlobalRoleForClerkUserId(resolvedClerkUserId)
            : 'customer'

    const authz: AuthzContext = {
        userId: resolvedClerkUserId,
        role,
        isAuthenticated,
        isOwner: role === 'owner',
        isPlatformAdmin: role === 'admin',
    }

    return {
        userId: resolvedClerkUserId,
        isAuthenticated,
        authz,
        role: authz.role,
        isOwner: authz.isOwner,
        isPlatformAdmin: authz.isPlatformAdmin,
    }
})

/**
 * Requires the current user to be authenticated.
 * Throws an error if not authenticated.
 *
 * Use this in server actions and protected API routes to enforce authentication.
 *
 * @returns SessionContext guaranteed to have a non-null userId
 * @throws Error if not authenticated
 *
 * @example
 * ```typescript
 * export async function createWrap(input: CreateWrapInput) {
 *   const { userId } = await requireAuth();
 *   // ...
 * }
 * ```
 */
export async function requireAuth(): Promise<SessionContext & { userId: string }> {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    return session as SessionContext & { userId: string }
}

export type { Session, SessionContext, SessionUser }

```

## /lib/authz/capabilities.ts


```ts
import { type Capability, type GlobalRole } from '@/types/auth.types'

export const ROLE_CAPABILITIES: Record<GlobalRole, Set<Capability>> = {
    customer: new Set<Capability>([
        'catalog.read',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.write.own',
        'billing.read.own',
        'billing.write.own',
        'settings.manage.own',
    ]),
    owner: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
    ]),
    admin: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'visualizer.manage',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
        'dashboard.platform',
        'platform.webhook.ops',
        'platform.database.ops',
    ]),
}

```

## /lib/authz/guards.ts


```ts
import { getSession } from '@/lib/auth/session'
import {
    canAccessCustomerOwnedResource,
    hasCapability,
    requireCapability,
    requireCustomerOwnedResourceAccess,
    requireOwnerOrAdmin,
    requirePlatformAdmin,
} from './policy'
import { type Capability } from '@/types/auth.types'
import { type SessionContext } from '@/types/auth.types'

export interface BillingAccessContext {
    session: SessionContext & { userId: string }
    canReadAllInvoices: boolean
    canWriteAllInvoices: boolean
}

export async function requireAuthzCapability(capability: Capability) {
    const session = await getSession()
    requireCapability(session.authz, capability)
    return session
}

export async function requireOwnerOrPlatformAdmin() {
    const session = await getSession()
    requireOwnerOrAdmin(session.authz)
    return session
}

export async function requirePlatformDeveloperAdmin() {
    const session = await getSession()
    requirePlatformAdmin(session.authz)
    return session
}

export async function requireCustomerResourceAccess(customerId: string) {
    const session = await getSession()
    requireCustomerOwnedResourceAccess(session.authz, customerId)
    return session
}

export async function getBillingAccessContext(): Promise<BillingAccessContext> {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const canReadAllInvoices = hasCapability(session.authz, 'billing.read.all')
    const canReadOwnInvoices =
        canReadAllInvoices || hasCapability(session.authz, 'billing.read.own')
    const canWriteAllInvoices = hasCapability(session.authz, 'billing.write.all')
    const canWriteOwnInvoices =
        canWriteAllInvoices || hasCapability(session.authz, 'billing.write.own')

    if (!canReadOwnInvoices && !canWriteOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    return {
        session: session as SessionContext & { userId: string },
        canReadAllInvoices,
        canWriteAllInvoices,
    }
}

export function requireInvoiceWriteAccess(access: BillingAccessContext, customerId: string): void {
    const canWriteOwnInvoices =
        access.canWriteAllInvoices || hasCapability(access.session.authz, 'billing.write.own')

    if (!canWriteOwnInvoices) {
        throw new Error('Forbidden: insufficient billing permissions')
    }

    if (
        !canAccessCustomerOwnedResource(access.session.authz, customerId) &&
        !access.canWriteAllInvoices
    ) {
        throw new Error('Forbidden: user cannot pay this invoice')
    }
}

```

## /lib/authz/policy.ts


```ts
import { type AuthzContext, type Capability } from '@/types/auth.types'
import { ROLE_CAPABILITIES } from '@/lib/authz/capabilities'

export function hasCapability(context: AuthzContext, capability: Capability): boolean {
    if (!context.isAuthenticated) {
        return false
    }

    return ROLE_CAPABILITIES[context.role]?.has(capability) ?? false
}

export function requireCapability(context: AuthzContext, capability: Capability): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(context, capability)) {
        throw new Error('Forbidden: insufficient permissions')
    }
}

export function requireOwnerOrAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isOwner && !context.isPlatformAdmin) {
        throw new Error('Forbidden: owner or admin role required')
    }
}

export function requirePlatformAdmin(context: AuthzContext): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!context.isPlatformAdmin) {
        throw new Error('Forbidden: admin role required')
    }
}

export function canAccessCustomerOwnedResource(context: AuthzContext, customerId: string): boolean {
    if (!context.userId) {
        return false
    }

    if (context.isOwner || context.isPlatformAdmin) {
        return true
    }

    return context.userId === customerId
}

export function requireCustomerOwnedResourceAccess(
    context: AuthzContext,
    customerId: string
): void {
    if (!context.isAuthenticated || !context.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!canAccessCustomerOwnedResource(context, customerId)) {
        throw new Error('Forbidden: resource is not accessible')
    }
}

```

## /lib/cache/cache-keys.ts


```ts
import crypto from 'crypto'
import type { PreviewCacheKeyInput } from '@/types/visualizer.types'

export function buildVisualizerCacheKey(input: PreviewCacheKeyInput): string {
    const normalized = {
        wrapId: input.wrapId,
        ownerUserId: input.ownerUserId,
        customerPhotoHash: input.customerPhotoHash,
        sourceWrapImageId: input.sourceWrapImageId,
        sourceAssetVersion: input.sourceAssetVersion,
        generationMode: input.generationMode,
        generationModel: input.generationModel,
        promptVersion: input.promptVersion,
        blendMode: input.blendMode ?? 'multiply',
        opacity: Number((input.opacity ?? 0.6).toFixed(2)),
    }

    return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}

```

## /lib/cache/revalidate-tags.ts


```ts
import { revalidatePath } from 'next/cache'

const SCHEDULING_REVALIDATION_PATHS = ['/scheduling', '/scheduling/book', '/scheduling/bookings']

export function revalidateCatalogPaths(wrapId?: string): void {
    revalidatePath('/catalog')
    revalidatePath('/catalog/manage')

    if (wrapId) {
        revalidatePath(`/catalog/${wrapId}`)
    }
}

export function revalidateCatalogAndVisualizerPaths(wrapId?: string): void {
    revalidateCatalogPaths(wrapId)
    revalidatePath('/visualizer')
}

export function revalidateSchedulingPages(): void {
    for (const path of SCHEDULING_REVALIDATION_PATHS) {
        revalidatePath(path)
    }
}

export function revalidateBillingBookingRoute(invoiceId: string): void {
    revalidatePath(`/billing/${invoiceId}`)
}

```

## /lib/cache/unstable-cache.ts


```ts
export { unstable_cache } from 'next/cache'

```

## /lib/constants/app.ts


```ts
export const APP_NAME = 'CtrlPlus'

export const DEFAULT_POST_AUTH_REDIRECT = '/catalog'
export const DEFAULT_STORE_TIMEZONE = process.env.DEFAULT_STORE_TIMEZONE ?? 'America/Denver'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const WEBHOOK_STALE_THRESHOLD_MINUTES = 5
export const RECENT_WEBHOOK_FAILURE_LIMIT = 25

export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

export const APP_ROUTES = {
    home: '/',
    catalog: '/catalog',
    catalogManage: '/catalog/manage',
    visualizer: '/visualizer',
    scheduling: '/scheduling',
    schedulingBook: '/scheduling/book',
    schedulingBookings: '/scheduling/bookings',
    billing: '/billing',
    platform: '/platform',
    signIn: '/sign-in',
    signUp: '/sign-up',
} as const

export const SCHEDULING_REVALIDATION_PATHS = [
    APP_ROUTES.scheduling,
    APP_ROUTES.schedulingBook,
    APP_ROUTES.schedulingBookings,
] as const

```

## /lib/constants/permissions.ts


```ts
export const GLOBAL_ROLE_VALUES = ['customer', 'owner', 'admin'] as const

export const CAPABILITY_VALUES = [
    'catalog.read',
    'catalog.manage',
    'visualizer.use',
    'visualizer.manage',
    'scheduling.read.own',
    'scheduling.read.all',
    'scheduling.write.own',
    'scheduling.write.all',
    'billing.read.own',
    'billing.read.all',
    'billing.write.own',
    'billing.write.all',
    'settings.manage.own',
    'dashboard.owner',
    'dashboard.platform',
    'platform.webhook.ops',
    'platform.database.ops',
] as const

```

## /lib/constants/statuses.ts


```ts
export const WrapStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DRAFT: 'DRAFT',
} as const

export type WrapStatus = (typeof WrapStatus)[keyof typeof WrapStatus]

export const WrapCategory = {
    FULL_WRAP: 'FULL_WRAP',
    PARTIAL_WRAP: 'PARTIAL_WRAP',
    ACCENT: 'ACCENT',
    PAINT_PROTECTION_FILM: 'PAINT_PROTECTION_FILM',
} as const

export type WrapCategory = (typeof WrapCategory)[keyof typeof WrapCategory]

export const WrapImageKind = {
    HERO: 'hero',
    VISUALIZER_TEXTURE: 'visualizer_texture',
    VISUALIZER_MASK_HINT: 'visualizer_mask_hint',
    GALLERY: 'gallery',
} as const

export type WrapImageKind = (typeof WrapImageKind)[keyof typeof WrapImageKind]

export const wrapImageKindValues = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
    WrapImageKind.VISUALIZER_MASK_HINT,
    WrapImageKind.GALLERY,
] as const

export const PUBLISH_REQUIRED_WRAP_IMAGE_KINDS = [
    WrapImageKind.HERO,
    WrapImageKind.VISUALIZER_TEXTURE,
] as const

export type PublishRequiredWrapImageKind = (typeof PUBLISH_REQUIRED_WRAP_IMAGE_KINDS)[number]

export const PreviewStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
} as const

export type PreviewStatus = (typeof PreviewStatus)[keyof typeof PreviewStatus]

export const VisualizerGenerationMode = {
    HUGGING_FACE: 'huggingface',
    DETERMINISTIC_FALLBACK: 'deterministic_fallback',
} as const

export type VisualizerGenerationMode =
    (typeof VisualizerGenerationMode)[keyof typeof VisualizerGenerationMode]

export const BookingStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export type BookingStatusValue = (typeof BookingStatus)[keyof typeof BookingStatus]

export type SchedulingBookingDisplayStatus =
    | 'reserved'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'expired'

export function getBookingDisplayStatus(
    status: BookingStatusValue,
    reservationExpiresAt: Date | null,
    now: Date = new Date()
): SchedulingBookingDisplayStatus {
    if (status === BookingStatus.PENDING) {
        if (reservationExpiresAt && reservationExpiresAt > now) {
            return 'reserved'
        }

        return 'expired'
    }

    return status
}

export const InvoiceStatus = {
    DRAFT: 'draft',
    SENT: 'sent',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const PaymentStatus = {
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export const PAYABLE_INVOICE_STATUSES = new Set<InvoiceStatus>([
    InvoiceStatus.DRAFT,
    InvoiceStatus.SENT,
    InvoiceStatus.FAILED,
])

export function isInvoicePayable(status: InvoiceStatus): boolean {
    return PAYABLE_INVOICE_STATUSES.has(status)
}

```

## /lib/db/prisma.ts


```ts
/**
 * Prisma Client wrapper for CtrlPlus - moved to lib/db/prisma.ts
 *
 * This file is the canonical Prisma client location for the repo.
 */

import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'
import { assertNeonPooledRuntimeUrl } from '@/lib/utils/assertions'

if (typeof WebSocket === 'undefined') {
    neonConfig.webSocketConstructor = ws
}

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient
    prismaSignalHandlersAttached?: boolean
}

// moved assertNeonPooledRuntimeUrl into lib/utils/assertions to avoid duplication

export const prisma =
    globalForPrisma.prisma ||
    (() => {
        const connectionString = process.env.DATABASE_URL

        if (!connectionString) {
            throw new Error(
                'DATABASE_URL is not defined. Please set it in your .env.local file.\n' +
                    'Get connection string from: https://console.neon.tech/\n' +
                    'Use the POOLED connection (with -pooler suffix) for optimal performance.'
            )
        }

        assertNeonPooledRuntimeUrl(connectionString)

        const adapter = new PrismaNeon({ connectionString })

        return new PrismaClient({
            adapter,
            log:
                process.env.DEBUG_PRISMA_QUERIES === 'true'
                    ? ['query', 'warn', 'error']
                    : ['warn', 'error'],
        })
    })()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

function disconnectPrisma(): void {
    void prisma.$disconnect()
}

if (!globalForPrisma.prismaSignalHandlersAttached) {
    process.on('SIGTERM', disconnectPrisma)
    process.on('SIGINT', disconnectPrisma)
    globalForPrisma.prismaSignalHandlersAttached = true
}

```

## /lib/db/selects/admin.selects.ts


```ts
export const adminSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} as const

```

## /lib/db/selects/auth.selects.ts


```ts
export const userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    roles: true,
    createdAt: true,
    updatedAt: true,
} as const

```

## /lib/db/selects/billing.selects.ts


```ts
export const invoiceDTOFields = {
    id: true,
    bookingId: true,
    status: true,
    totalAmount: true,
    createdAt: true,
    updatedAt: true,
} as const

export const paymentDTOFields = {
    id: true,
    invoiceId: true,
    stripePaymentIntentId: true,
    status: true,
    amount: true,
    createdAt: true,
} as const

export const invoiceLineItemDTOFields = {
    id: true,
    description: true,
    quantity: true,
    unitPrice: true,
    totalPrice: true,
} as const

```

## /lib/db/selects/catalog.selects.ts


```ts
export const wrapDTOFields = {
    id: true,
    name: true,
    description: true,
    price: true,
    isHidden: true,
    installationMinutes: true,
    aiPromptTemplate: true,
    aiNegativePrompt: true,
    createdAt: true,
    updatedAt: true,
    images: {
        where: { deletedAt: null },
        select: {
            id: true,
            url: true,
            kind: true,
            isActive: true,
            version: true,
            contentHash: true,
            displayOrder: true,
        },
        orderBy: { displayOrder: 'asc' },
    },
    categoryMappings: {
        select: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    deletedAt: true,
                },
            },
        },
    },
} as const

```

## /lib/db/selects/platform.selects.ts


```ts
export const webhookFailureSelectFields = {
    id: true,
    type: true,
    status: true,
    processedAt: true,
    error: true,
    payload: true,
} as const

```

## /lib/db/selects/scheduling.selects.ts


```ts
export const availabilitySelectFields = {
    id: true,
    dayOfWeek: true,
    startTime: true,
    endTime: true,
    capacitySlots: true,
    createdAt: true,
    updatedAt: true,
} as const

export const bookingSelectFields = {
    id: true,
    customerId: true,
    wrapId: true,
    wrap: {
        select: {
            name: true,
        },
    },
    startTime: true,
    endTime: true,
    status: true,
    totalPrice: true,
    reservation: {
        select: {
            expiresAt: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const

```

## /lib/db/selects/settings.selects.ts


```ts
export const settingsSelect = {
    id: true,
    key: true,
    value: true,
    description: true,
    updatedAt: true,
} as const

```

## /lib/db/selects/visualizer.selects.ts


```ts
export const visualizerPreviewDTOFields = {
    id: true,
    wrapId: true,
    customerPhotoUrl: true,
    processedImageUrl: true,
    status: true,
    cacheKey: true,
    sourceWrapImageId: true,
    sourceWrapImageVersion: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
} as const

```

## /lib/db/transactions/admin.transactions.ts


```ts
import type { Prisma } from '@prisma/client'

/**
 * Admin transactional helpers (placeholder)
 * Keep DB model-specific logic here. Implement concrete transactional
 * operations as the domain needs them. This file intentionally avoids
 * referencing concrete models to remain a safe scaffold.
 */
export async function runAdminUnitOfWork(
    _tx: Prisma.TransactionClient,
    _work: () => Promise<void>
): Promise<void> {
    // Example usage:
    // await _tx.$transaction(async (tx) => {
    //   await tx.someModel.update(...)
    //   await tx.otherModel.create(...)
    // })

    // The scaffold does nothing by default - actions will implement real
    // transactional logic here when needed.
    await _work()
}

```

## /lib/db/transactions/auth.transactions.ts


```ts
import type { Prisma } from '@prisma/client'

/**
 * Reusable auth-related transactional helpers
 * Keep Prisma-specific logic here so actions can call these units inside tx blocks
 */
export async function createUserTx(
    tx: Prisma.TransactionClient,
    data: Prisma.UserCreateInput
) {
    return tx.user.create({ data })
}

export async function updateUserTx(
    tx: Prisma.TransactionClient,
    id: string,
    data: Prisma.UserUpdateInput
) {
    return tx.user.update({ where: { id }, data })
}

```

## /lib/db/transactions/billing.transactions.ts


```ts
import type { Prisma, PrismaClient } from '@prisma/client'

type BillingWriter = PrismaClient | Prisma.TransactionClient

export interface CreateAdminInvoiceParams {
    bookingId: string
    amountCents: number
}

export async function createAdminInvoice(
    db: BillingWriter,
    params: CreateAdminInvoiceParams
): Promise<{ invoiceId: string; status: string }> {
    const invoice = await db.invoice.create({
        data: {
            bookingId: params.bookingId,
            totalAmount: params.amountCents,
            status: 'draft',
        },
    })

    return {
        invoiceId: invoice.id,
        status: invoice.status,
    }
}

```

## /lib/db/transactions/catalog.transactions.ts


```ts
import type { Prisma } from '@prisma/client'

/**
 * Catalog transactional helpers - e.g., create wrap + images in a single tx
 */
export async function createWrapWithImagesTx(
    tx: Prisma.TransactionClient,
    wrapData: Prisma.WrapCreateInput
) {
    // Caller should pass the proper shape. This helper keeps multi-table
    // catalog writes in one transactional unit.
    return tx.wrap.create({ data: wrapData })
}

```

## /lib/db/transactions/platform.transactions.ts


```ts
import { prisma } from '@/lib/db/prisma'

export async function releaseStaleWebhookProcessingLocks(staleCutoff: Date) {
    const [releasedClerk, releasedStripe] = await prisma.$transaction([
        prisma.clerkWebhookEvent.updateMany({
            where: {
                status: 'processing',
                processedAt: {
                    lt: staleCutoff,
                },
            },
            data: {
                status: 'failed',
                processedAt: new Date(),
                error: 'Processing lock released by platform admin.',
            },
        }),
        prisma.stripeWebhookEvent.updateMany({
            where: {
                status: 'processing',
                processedAt: {
                    lt: staleCutoff,
                },
            },
            data: {
                status: 'failed',
                processedAt: new Date(),
                error: 'Processing lock released by platform admin.',
            },
        }),
    ])

    return {
        clerkAffectedCount: releasedClerk.count,
        stripeAffectedCount: releasedStripe.count,
        affectedCount: releasedClerk.count + releasedStripe.count,
    }
}

```

## /lib/db/transactions/scheduling.transactions.ts


```ts
import type { Prisma, PrismaClient } from '@prisma/client'

import { toHHmm } from '@/lib/utils/dates'

type SchedulingWriter = PrismaClient | Prisma.TransactionClient

export interface SlotRange {
    startTime: Date
    endTime: Date
}

export interface AssertSlotCapacityInput extends SlotRange {
    excludeBookingId?: string
    now?: Date
}

export interface ConfirmAdminAppointmentParams {
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
}

function getDayOfWeekUtc(date: Date): number {
    return date.getUTCDay()
}

async function getMaxCapacityForSlot(
    tx: Prisma.TransactionClient,
    range: SlotRange
): Promise<number> {
    const dayOfWeek = getDayOfWeekUtc(range.startTime)
    const slotStartHHmm = toHHmm(range.startTime)
    const slotEndHHmm = toHHmm(range.endTime)

    const rules = await tx.availabilityRule.findMany({
        where: { dayOfWeek, deletedAt: null },
        select: { startTime: true, endTime: true, capacitySlots: true },
    })

    if (rules.length === 0) {
        throw new Error('No availability configured for the requested day')
    }

    const matchingRules = rules.filter(
        (rule) => rule.startTime <= slotStartHHmm && rule.endTime >= slotEndHHmm
    )

    if (matchingRules.length === 0) {
        throw new Error('No availability configured for the requested time window')
    }

    return Math.max(...matchingRules.map((rule) => rule.capacitySlots))
}

async function countOverlappingActiveBookings(
    tx: Prisma.TransactionClient,
    input: AssertSlotCapacityInput
): Promise<number> {
    const effectiveNow = input.now ?? new Date()

    return tx.booking.count({
        where: {
            deletedAt: null,
            id: input.excludeBookingId ? { not: input.excludeBookingId } : undefined,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
            OR: [
                { status: 'confirmed' },
                { status: 'completed' },
                {
                    status: 'pending',
                    reservation: {
                        is: {
                            expiresAt: { gt: effectiveNow },
                        },
                    },
                },
            ],
        },
    })
}

export async function assertSlotHasCapacity(
    tx: Prisma.TransactionClient,
    input: AssertSlotCapacityInput
): Promise<void> {
    const maxCapacity = await getMaxCapacityForSlot(tx, input)
    const overlappingCount = await countOverlappingActiveBookings(tx, input)

    if (overlappingCount >= maxCapacity) {
        throw new Error('The requested time slot is fully booked - no remaining capacity')
    }
}

export async function confirmAdminAppointment(
    db: SchedulingWriter,
    params: ConfirmAdminAppointmentParams
): Promise<{ bookingId: string; updatedCount: number }> {
    const booking = await db.booking.updateMany({
        where: { id: params.bookingId, deletedAt: null },
        data: { status: params.status, updatedAt: new Date() },
    })

    return {
        bookingId: params.bookingId,
        updatedCount: booking.count,
    }
}

```

## /lib/db/transactions/settings.transactions.ts


```ts
import type { Prisma } from '@prisma/client'
import type { WebsiteSettingsInput } from '@/types/settings.types'

/**
 * Upsert website settings for a Clerk user inside a transaction.
 * This keeps settings write logic centralized in the DB transactions layer.
 */
export async function upsertWebsiteSettingsTx(
    tx: Prisma.TransactionClient,
    clerkUserId: string,
    data: WebsiteSettingsInput
) {
    return tx.websiteSettings.upsert({
        where: { clerkUserId },
        create: {
            clerkUserId,
            preferredContact: data.preferredContact,
            appointmentReminders: data.appointmentReminders,
            marketingOptIn: data.marketingOptIn,
            timezone: data.timezone,
        },
        update: {
            preferredContact: data.preferredContact,
            appointmentReminders: data.appointmentReminders,
            marketingOptIn: data.marketingOptIn,
            timezone: data.timezone,
            updatedAt: new Date(),
        },
    })
}

```

## /lib/db/transactions/visualizer.transactions.ts


```ts
import type { Prisma } from '@prisma/client'

/**
 * Visualizer transactional helpers (scaffold)
 * Keep visualizer-specific DB writes here. This scaffold intentionally
 * avoids assuming exact prisma model types so it remains safe across schema
 * variations.
 */
export async function createPreviewTx(
    _tx: Prisma.TransactionClient,
    _previewData: unknown
): Promise<unknown> {
    // Implement domain-specific preview persistence here when schema is known
    return Promise.resolve(null)
}

```

## /lib/fetchers/admin.fetchers.ts


```ts
import "server-only"
import { prisma } from '@/lib/db/prisma'
import { requireOwnerOrPlatformAdmin } from '@/lib/authz/guards'

export interface OwnerDashboardStatsDTO {
    wrapCount: number
    hiddenWrapCount: number
    bookingCount: number
    upcomingBookingCount: number
    openInvoiceCount: number
    totalRevenue: number
    customerCount: number
}

export async function getOwnerDashboardStats(): Promise<OwnerDashboardStatsDTO> {
    const now = new Date()

    const [
        wrapCount,
        hiddenWrapCount,
        bookingCount,
        upcomingBookingCount,
        openInvoiceCount,
        revenueAggregate,
        customers,
    ] = await Promise.all([
        prisma.wrap.count({ where: { deletedAt: null } }),
        prisma.wrap.count({ where: { deletedAt: null, isHidden: true } }),
        prisma.booking.count({ where: { deletedAt: null } }),
        prisma.booking.count({
            where: {
                deletedAt: null,
                status: { in: ['pending', 'confirmed'] },
                startTime: { gte: now },
            },
        }),
        prisma.invoice.count({ where: { deletedAt: null, status: { in: ['draft', 'sent'] } } }),
        prisma.invoice.aggregate({
            where: { status: 'paid', deletedAt: null },
            _sum: { totalAmount: true },
        }),
        prisma.booking.findMany({
            where: { deletedAt: null },
            select: { customerId: true },
            distinct: ['customerId'],
        }),
    ])

    return {
        wrapCount,
        hiddenWrapCount,
        bookingCount,
        upcomingBookingCount,
        openInvoiceCount,
        totalRevenue: revenueAggregate._sum.totalAmount ?? 0,
        customerCount: customers.length,
    }
}

export type ConfirmAppointmentExample = {
    tenantId: string
    bookingId: string
    status: 'confirmed'
}

export type CreateInvoiceExample = {
    tenantId: string
    bookingId: string
    customerId: string
    amountCents: number
    currency: 'usd'
    description: string
}

export type AdminManagementToolExamples = {
    confirmAppointmentExample: ConfirmAppointmentExample | null
    createInvoiceExample: CreateInvoiceExample | null
}

export async function getAdminManagementToolExamples(): Promise<AdminManagementToolExamples> {
    await requireOwnerOrPlatformAdmin()

    const SINGLE_STORE_TENANT_ID = 'single-store'

    const [bookingToConfirm, bookingToInvoice] = await Promise.all([
        prisma.booking.findFirst({
            where: { deletedAt: null, status: 'pending' },
            select: { id: true },
            orderBy: { startTime: 'asc' },
        }),
        prisma.booking.findFirst({
            where: { deletedAt: null, status: { in: ['confirmed', 'completed'] }, invoice: null },
            select: { id: true, customerId: true, totalPrice: true },
            orderBy: { startTime: 'asc' },
        }),
    ])

    return {
        confirmAppointmentExample: bookingToConfirm
            ? {
                  tenantId: SINGLE_STORE_TENANT_ID,
                  bookingId: bookingToConfirm.id,
                  status: 'confirmed',
              }
            : null,
        createInvoiceExample: bookingToInvoice
            ? {
                  tenantId: SINGLE_STORE_TENANT_ID,
                  bookingId: bookingToInvoice.id,
                  customerId: bookingToInvoice.customerId,
                  amountCents: bookingToInvoice.totalPrice,
                  currency: 'usd',
                  description: 'Admin dashboard example invoice',
              }
            : null,
    }
}

```

## /lib/fetchers/auth.fetchers.ts


```ts
import "server-only"
import { prisma } from '@/lib/db/prisma'

/**
 * Read-only helpers for the auth domain.
 * Keep these server-only and import them from server components or server actions.
 */

export async function getUserByClerkUserId(clerkUserId: string) {
    const user = await prisma.user.findFirst({
        where: { clerkUserId, deletedAt: null },
        select: { id: true, clerkUserId: true, globalRole: true, createdAt: true, updatedAt: true },
    })
    if (!user) return null
    return { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, clerkUserId: true, globalRole: true, createdAt: true, updatedAt: true },
    })
    if (!user) return null
    return { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() }
}

export async function getUserRoleByClerkId(clerkUserId: string) {
    const user = await prisma.user.findFirst({ where: { clerkUserId, deletedAt: null }, select: { globalRole: true } })
    return user?.globalRole ?? null
}

```

## /lib/fetchers/billing.fetchers.ts


```ts
import 'server-only'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import { invoiceListParamsSchema } from '@/schemas/billing.schemas'
import {
    invoiceDTOFields,
    invoiceLineItemDTOFields,
    paymentDTOFields,
} from '@/lib/db/selects/billing.selects'
import type {
    InvoiceDTO,
    InvoiceListParams,
    InvoiceListResult,
    InvoiceDetailDTO,
    InvoiceLineItemDTO,
    PaymentDTO,
} from '@/types/billing.types'
import { getBillingAccessContext } from '@/lib/authz/guards'

function buildInvoiceReadWhere(
    userId: string,
    canAccessAllInvoices: boolean
): Prisma.InvoiceWhereInput {
    if (canAccessAllInvoices) {
        return {}
    }

    return {
        booking: {
            customerId: userId,
        },
    }
}

function toInvoiceDTO(row: {
    id: string
    bookingId: string
    status: string
    totalAmount: number
    createdAt: Date
    updatedAt: Date
}): InvoiceDTO {
    return {
        id: row.id,
        bookingId: row.bookingId,
        status: row.status as InvoiceDTO['status'],
        totalAmount: row.totalAmount,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export async function getInvoices(
    params: InvoiceListParams = { page: 1, pageSize: 20 }
): Promise<InvoiceListResult> {
    const access = await getBillingAccessContext()
    // Validate params at the action boundary: invoiceListParamsSchema.parse(params)
    const { page, pageSize, status } = params
    const skip = (page - 1) * pageSize

    const where: Prisma.InvoiceWhereInput = {
        deletedAt: null,
        ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        ...(status ? { status } : {}),
    }

    const [rows, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: invoiceDTOFields,
            skip,
            take: pageSize,
        }),
        prisma.invoice.count({ where }),
    ])

    return {
        invoices: rows.map(toInvoiceDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function getInvoiceById(invoiceId: string): Promise<InvoiceDetailDTO | null> {
    const access = await getBillingAccessContext()
    const row = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        },
        select: {
            ...invoiceDTOFields,
            lineItems: {
                select: invoiceLineItemDTOFields,
                orderBy: { id: 'asc' },
            },
            payments: {
                where: { deletedAt: null },
                select: paymentDTOFields,
                orderBy: { createdAt: 'desc' },
            },
        },
    })

    if (!row) return null

    return {
        id: row.id,
        bookingId: row.bookingId,
        status: row.status as InvoiceDetailDTO['status'],
        totalAmount: row.totalAmount,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        lineItems: (
            row.lineItems as unknown as Array<{
                id: string
                description: string
                quantity: number
                unitPrice: number
                totalPrice: number
            }>
        ).map(
            (li): InvoiceLineItemDTO => ({
                id: li.id,
                description: li.description,
                quantity: li.quantity,
                unitPrice: li.unitPrice,
                totalPrice: li.totalPrice,
            })
        ),
        payments: (
            row.payments as Array<{
                id: string
                stripePaymentIntentId: string
                status: string
                amount: number
                createdAt: Date
            }>
        ).map(
            (p): PaymentDTO => ({
                id: p.id,
                stripePaymentIntentId: p.stripePaymentIntentId,
                status: p.status as PaymentDTO['status'],
                amount: p.amount,
                createdAt: p.createdAt.toISOString(),
                invoiceId,
            })
        ),
    }
}

export async function getPaymentStatusForInvoice(invoiceId: string): Promise<PaymentDTO[] | null> {
    const access = await getBillingAccessContext()

    const rows = await prisma.payment.findMany({
        where: {
            deletedAt: null,
            invoice: {
                id: invoiceId,
                deletedAt: null,
                ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
            },
        },
        select: paymentDTOFields,
        orderBy: { createdAt: 'asc' },
    })

    const payments = rows.map(
        (p: {
            id: string
            invoiceId: string
            stripePaymentIntentId: string
            status: string
            amount: number
            createdAt: Date
        }) => ({
            id: p.id,
            invoiceId: p.invoiceId,
            stripePaymentIntentId: p.stripePaymentIntentId,
            status: p.status as PaymentDTO['status'],
            amount: p.amount,
            createdAt: p.createdAt.toISOString(),
        })
    )

    if (payments.length > 0) {
        return payments
    }

    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            deletedAt: null,
            ...buildInvoiceReadWhere(access.session.userId, access.canReadAllInvoices),
        },
        select: { id: true },
    })

    return invoice ? [] : null
}

```

## /lib/fetchers/catalog.fetchers.ts


```ts
import 'server-only'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db/prisma'
import { wrapDTOFields } from '@/lib/db/selects/catalog.selects'
import {
    getCatalogAssetReadiness,
    resolveCatalogGalleryImages,
    resolveDisplayImages,
    resolveHeroAsset,
    resolvePrimaryDisplayAsset,
    resolveVisualizerMaskHintAsset,
    resolveVisualizerTextureAsset,
} from '@/lib/fetchers/catalog.mappers'
import type {
    CatalogBrowseCardDTO,
    CatalogBrowseResultDTO,
    CatalogDetailDTO,
    CatalogManagerItemDTO,
    CatalogManagerResultDTO,
    SearchWrapsInput,
    VisualizerWrapSelectionDTO,
    WrapCategoryDTO,
    WrapDTO,
    WrapImageDTO,
    WrapListDTO,
} from '@/types/catalog.types'
import type { searchWrapsSchema } from '@/schemas/catalog.schemas'
import { WrapImageKind } from '../constants/statuses'

export interface WrapVisibilityScope {
    includeHidden?: boolean
    requireVisualizerReady?: boolean
}

export type WrapRecord = Prisma.WrapGetPayload<{
    select: typeof wrapDTOFields
}>

const EXAMPLE_WRAP_ID = 'demo-lorem-ipsum-phoenix'
const EXAMPLE_WRAP_CATEGORY_ID = 'demo-showcase'
// Example fixture times are transport-safe ISO strings
const EXAMPLE_CREATED_AT = '2026-03-21T12:00:00.000Z'

const EXAMPLE_WRAP_CATEGORY: WrapCategoryDTO = {
    id: EXAMPLE_WRAP_CATEGORY_ID,
    name: 'Demo Showcase',
    slug: 'demo-showcase',
}

const EXAMPLE_WRAP_IMAGES: WrapImageDTO[] = [
    {
        id: 'demo-lorem-ipsum-hero',
        url: '/catalog-demo/lorem-ipsum-hero.png',
        kind: WrapImageKind.HERO,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-hero',
        displayOrder: 0,
    },
    {
        id: 'demo-lorem-ipsum-texture',
        url: '/catalog-demo/lorem-ipsum-alt.png',
        kind: WrapImageKind.VISUALIZER_TEXTURE,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-texture',
        displayOrder: 1,
    },
    {
        id: 'demo-lorem-ipsum-gallery-hero',
        url: '/catalog-demo/lorem-ipsum-hero.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-hero',
        displayOrder: 2,
    },
    {
        id: 'demo-lorem-ipsum-gallery-alt',
        url: '/catalog-demo/lorem-ipsum-alt.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-alt',
        displayOrder: 3,
    },
    {
        id: 'demo-lorem-ipsum-gallery-logo',
        url: '/catalog-demo/lorem-ipsum-logo.png',
        kind: WrapImageKind.GALLERY,
        isActive: true,
        version: 1,
        contentHash: 'demo-lorem-ipsum-gallery-logo',
        displayOrder: 4,
    },
]

const EXAMPLE_WRAP: WrapDTO = {
    id: EXAMPLE_WRAP_ID,
    name: 'Lorem Ipsum Phoenix',
    description:
        'Demo-ready showcase wrap with a clickable hero card, alternate vehicle angles, and logo artwork for product-gallery walkthroughs.',
    price: 265000,
    isHidden: false,
    installationMinutes: 300,
    aiPromptTemplate: null,
    aiNegativePrompt: null,
    images: EXAMPLE_WRAP_IMAGES,
    categories: [EXAMPLE_WRAP_CATEGORY],
    createdAt: EXAMPLE_CREATED_AT,
    updatedAt: EXAMPLE_CREATED_AT,
}

function getExampleCatalogWraps(): WrapDTO[] {
    return [EXAMPLE_WRAP]
}

function getExampleCatalogWrapById(wrapId: string): WrapDTO | null {
    return wrapId === EXAMPLE_WRAP_ID ? EXAMPLE_WRAP : null
}

function getExampleWrapCategories(): WrapCategoryDTO[] {
    return [EXAMPLE_WRAP_CATEGORY]
}

export function isExampleCatalogWrapId(wrapId: string): boolean {
    return wrapId === EXAMPLE_WRAP_ID
}

function normalizePriceInCents(value: number): number {
    return Number.isInteger(value) ? value : Math.round(value)
}

function getVisibilityFilter(scope: WrapVisibilityScope) {
    return scope.includeHidden ? {} : { isHidden: false }
}

function getWrapWhere(
    filters: SearchWrapsInput,
    scope: WrapVisibilityScope
): Prisma.WrapWhereInput {
    return {
        deletedAt: null,
        ...getVisibilityFilter(scope),
        ...(filters.query
            ? {
                  OR: [
                      { name: { contains: filters.query, mode: 'insensitive' } },
                      { description: { contains: filters.query, mode: 'insensitive' } },
                  ],
              }
            : {}),
        ...(filters.maxPrice !== undefined ? { price: { lte: filters.maxPrice } } : {}),
        ...(filters.categoryId
            ? {
                  categoryMappings: {
                      some: {
                          categoryId: filters.categoryId,
                          category: {
                              deletedAt: null,
                          },
                      },
                  },
              }
            : {}),
    }
}

function mapWrapImage(image: WrapRecord['images'][number], index: number): WrapImageDTO {
    return {
        ...image,
        kind:
            (image.kind as WrapImageKind) ??
            (index === 0 ? WrapImageKind.HERO : WrapImageKind.GALLERY),
    }
}

export function toWrapDTO(prismaWrap: WrapRecord): WrapDTO {
    return {
        id: prismaWrap.id,
        name: prismaWrap.name,
        description: prismaWrap.description,
        price: normalizePriceInCents(prismaWrap.price),
        isHidden: prismaWrap.isHidden,
        installationMinutes: prismaWrap.installationMinutes,
        aiPromptTemplate: prismaWrap.aiPromptTemplate,
        aiNegativePrompt: prismaWrap.aiNegativePrompt,
        images: prismaWrap.images.map(mapWrapImage),
        categories: prismaWrap.categoryMappings
            .map((mapping) => mapping.category)
            .filter((category) => category.deletedAt === null)
            .map(({ ...category }) => category),
        createdAt: prismaWrap.createdAt.toISOString(),
        updatedAt: prismaWrap.updatedAt.toISOString(),
    }
}

function getWrapReadiness(wrap: WrapDTO) {
    return getCatalogAssetReadiness({
        name: wrap.name,
        price: wrap.price,
        images: wrap.images,
    })
}

function toCatalogBrowseCard(wrap: WrapDTO): CatalogBrowseCardDTO {
    const readiness = getWrapReadiness(wrap)
    const heroImage = resolveHeroAsset(wrap.images)

    return {
        id: wrap.id,
        name: wrap.name,
        description: wrap.description,
        price: wrap.price,
        isHidden: wrap.isHidden,
        installationMinutes: wrap.installationMinutes,
        categories: wrap.categories,
        heroImage,
        displayImage: heroImage,
        previewHref: isExampleCatalogWrapId(wrap.id)
            ? `/catalog/${wrap.id}`
            : `/visualizer?wrapId=${wrap.id}`,
        readiness,
    }
}

function toCatalogDetail(wrap: WrapDTO): CatalogDetailDTO {
    const heroImage = resolveHeroAsset(wrap.images)
    const displayImage = resolvePrimaryDisplayAsset(wrap.images)
    const galleryImages = resolveCatalogGalleryImages(wrap.images)
    const displayImages = resolveDisplayImages(wrap.images)
    const visualizerTextureImage = resolveVisualizerTextureAsset(wrap.images)
    const visualizerMaskHintImage = resolveVisualizerMaskHintAsset(wrap.images)
    const readiness = getWrapReadiness(wrap)

    return {
        ...wrap,
        heroImage,
        displayImage,
        displayImages,
        galleryImages,
        visualizerTextureImage,
        visualizerMaskHintImage,
        readiness,
    }
}

function toCatalogManagerItem(wrap: WrapDTO): CatalogManagerItemDTO {
    const detail = toCatalogDetail(wrap)

    return {
        ...detail,
        imageCount: wrap.images.length,
        activeImageCount: wrap.images.filter((image) => image.isActive).length,
    }
}

function toVisualizerWrapSelection(wrap: WrapDTO): VisualizerWrapSelectionDTO | null {
    const detail = toCatalogDetail(wrap)

    if (
        !detail.heroImage ||
        !detail.visualizerTextureImage ||
        !detail.readiness.isVisualizerReady
    ) {
        return null
    }

    return {
        id: detail.id,
        name: detail.name,
        description: detail.description,
        price: detail.price,
        installationMinutes: detail.installationMinutes,
        categories: detail.categories,
        heroImage: detail.heroImage,
        visualizerTextureImage: detail.visualizerTextureImage,
        aiPromptTemplate: detail.aiPromptTemplate,
        aiNegativePrompt: detail.aiNegativePrompt,
        readiness: detail.readiness,
    }
}

function toWrapListResult<TItem>(
    wraps: WrapRecord[],
    total: number,
    filters: SearchWrapsInput,
    mapper: (wrap: WrapDTO) => TItem
) {
    return {
        wraps: wraps.map((wrap) => mapper(toWrapDTO(wrap))),
        total,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 20,
        totalPages: Math.max(1, Math.ceil(total / (filters.pageSize ?? 20))),
    }
}

async function searchWrapRecords(
    filters: SearchWrapsInput,
    scope: WrapVisibilityScope
): Promise<{
    wraps: WrapRecord[]
    total: number
}> {
    // Validate params at the action boundary: searchWrapsSchema.parse(filters)
    const parsedFilters = filters
    const skip = (parsedFilters.page - 1) * parsedFilters.pageSize
    const where = getWrapWhere(parsedFilters, scope)

    const [wraps, total] = await Promise.all([
        prisma.wrap.findMany({
            where,
            orderBy: { [parsedFilters.sortBy ?? 'createdAt']: parsedFilters.sortOrder ?? 'desc' },
            select: wrapDTOFields,
            skip,
            take: parsedFilters.pageSize,
        }),
        prisma.wrap.count({ where }),
    ])

    return { wraps, total }
}

export async function getWraps(scope: WrapVisibilityScope = {}): Promise<WrapDTO[]> {
    const wraps = await prisma.wrap.findMany({
        where: {
            deletedAt: null,
            ...getVisibilityFilter(scope),
        },
        orderBy: { createdAt: 'desc' },
        select: wrapDTOFields,
    })

    return [...wraps.map((wrap) => toWrapDTO(wrap)), ...getExampleCatalogWraps()]
}

export async function getCatalogManagerWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = { includeHidden: true }
): Promise<CatalogManagerResultDTO> {
    // Validate params at the action boundary: searchWrapsSchema.parse(filters)
    const parsedFilters = filters
    const { wraps, total } = await searchWrapRecords(parsedFilters, scope)

    return toWrapListResult(wraps, total, parsedFilters, toCatalogManagerItem)
}

export async function getWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<WrapDTO | null> {
    const exampleWrap = getExampleCatalogWrapById(wrapId)

    if (exampleWrap && (scope.includeHidden || !exampleWrap.isHidden)) {
        return exampleWrap
    }

    const wrap = await prisma.wrap.findFirst({
        where: {
            id: wrapId,
            deletedAt: null,
            ...getVisibilityFilter(scope),
        },
        select: wrapDTOFields,
    })

    return wrap ? toWrapDTO(wrap) : null
}

export async function getCatalogWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<CatalogDetailDTO | null> {
    const wrap = await getWrapById(wrapId, scope)
    if (!wrap) {
        return null
    }

    const detail = toCatalogDetail(wrap)
    if (scope.requireVisualizerReady && !detail.readiness.isVisualizerReady) {
        return null
    }

    return detail
}

export async function searchWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = {}
): Promise<WrapListDTO> {
    // Validate params at the action boundary: searchWrapsSchema.parse(filters)
    const parsedFilters = filters
    const { wraps, total } = await searchWrapRecords(parsedFilters, scope)

    return toWrapListResult(wraps, total, parsedFilters, (wrap) => wrap)
}

export async function searchCatalogWraps(
    filters: SearchWrapsInput = { page: 1, pageSize: 20 },
    scope: WrapVisibilityScope = {}
): Promise<CatalogBrowseResultDTO> {
    // Validate params at the action boundary: searchWrapsSchema.parse(filters)
    const parsedFilters = filters
    const effectiveScope = {
        ...scope,
        requireVisualizerReady: scope.requireVisualizerReady ?? true,
    }
    const wraps = await getWraps({
        includeHidden: effectiveScope.includeHidden,
    })
    const filteredCatalogWraps = wraps
        .filter((wrap) => {
            if (!effectiveScope.requireVisualizerReady) {
                return true
            }

            return getWrapReadiness(wrap).isVisualizerReady
        })
        .filter((wrap) => {
            if (parsedFilters.query) {
                const query = parsedFilters.query.toLowerCase()
                const haystacks = [
                    wrap.name,
                    wrap.description ?? '',
                    ...wrap.categories.map((category) => category.name),
                ]

                if (!haystacks.some((value) => value.toLowerCase().includes(query))) {
                    return false
                }
            }

            if (parsedFilters.maxPrice !== undefined && wrap.price > parsedFilters.maxPrice) {
                return false
            }

            if (
                parsedFilters.categoryId &&
                !wrap.categories.some((category) => category.id === parsedFilters.categoryId)
            ) {
                return false
            }

            return true
        })

    const sortedCatalogWraps = [...filteredCatalogWraps].sort((left, right) => {
        const sortBy = parsedFilters.sortBy ?? 'createdAt'
        const sortOrder = parsedFilters.sortOrder ?? 'desc'
        const direction = sortOrder === 'asc' ? 1 : -1

        if (sortBy === 'name') {
            return left.name.localeCompare(right.name) * direction
        }

        if (sortBy === 'price') {
            return (left.price - right.price) * direction
        }

        return (
            (new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()) * direction
        )
    })

    const total = sortedCatalogWraps.length
    const pageSize = parsedFilters.pageSize ?? 20
    const page = parsedFilters.page ?? 1
    const pageWraps = sortedCatalogWraps.slice((page - 1) * pageSize, page * pageSize)

    return {
        wraps: pageWraps.map((wrap) => toCatalogBrowseCard(wrap)),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
}

export async function getVisualizerSelectableWrapById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
): Promise<VisualizerWrapSelectionDTO | null> {
    if (isExampleCatalogWrapId(wrapId)) {
        return null
    }

    const wrap = await getWrapById(wrapId, scope)

    if (!wrap) {
        return null
    }

    return toVisualizerWrapSelection(wrap)
}

export async function listVisualizerSelectableWraps(
    scope: WrapVisibilityScope = {}
): Promise<VisualizerWrapSelectionDTO[]> {
    const wraps = await getWraps({
        includeHidden: scope.includeHidden,
    })

    return wraps
        .filter((wrap) => !isExampleCatalogWrapId(wrap.id))
        .map(toVisualizerWrapSelection)
        .filter((wrap): wrap is VisualizerWrapSelectionDTO => wrap !== null)
}

export async function getWrapCategories(): Promise<WrapCategoryDTO[]> {
    const categories = await prisma.wrapCategory.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true },
    })

    const mergedCategories = [...categories, ...getExampleWrapCategories()]

    return mergedCategories
        .filter(
            (category, index, items) => items.findIndex((item) => item.id === category.id) === index
        )
        .sort((left, right) => left.name.localeCompare(right.name))
}

```

## /lib/fetchers/catalog.mappers.ts


```ts
import { PUBLISH_REQUIRED_WRAP_IMAGE_KINDS, WrapImageKind } from '@/lib/constants/statuses'
import type { PublishRequiredWrapImageKind } from '@/lib/constants/statuses'
import type {
    CatalogAssetImageDTO,
    CatalogAssetReadinessDTO,
    WrapImageDTO,
} from '@/types/catalog.types'

const CLOUDINARY_HOST = 'res.cloudinary.com'

type CatalogDeliveryVariant = 'thumbnail' | 'card' | 'detail'

const TRANSFORMATION_BY_VARIANT: Record<CatalogDeliveryVariant, string> = {
    thumbnail: 'f_auto,q_auto,c_fill,g_auto,w_320,h_240',
    card: 'f_auto,q_auto,c_fill,g_auto,w_960,h_720',
    detail: 'f_auto,q_auto,c_limit,w_1600,h_1200',
}

function sortImages(images: WrapImageDTO[]): WrapImageDTO[] {
    return [...images].sort((left, right) => left.displayOrder - right.displayOrder)
}

function getActiveImagesByKind(images: WrapImageDTO[], kind: WrapImageKind): WrapImageDTO[] {
    return sortImages(images).filter((image) => image.isActive && image.kind === kind)
}

function isCloudinaryUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.hostname.includes(CLOUDINARY_HOST)
    } catch {
        return false
    }
}

function insertCloudinaryTransformation(url: string, transformation: string): string {
    if (!isCloudinaryUrl(url)) {
        return url
    }

    const marker = '/upload/'
    const index = url.indexOf(marker)
    if (index === -1) {
        return url
    }

    return `${url.slice(0, index + marker.length)}${transformation}/${url.slice(index + marker.length)}`
}

export function getCatalogAssetDeliveryUrl(url: string, variant: CatalogDeliveryVariant): string {
    return insertCloudinaryTransformation(url, TRANSFORMATION_BY_VARIANT[variant])
}

export function toCatalogAssetImage(image: WrapImageDTO): CatalogAssetImageDTO {
    return {
        ...image,
        thumbnailUrl: getCatalogAssetDeliveryUrl(image.url, 'thumbnail'),
        cardUrl: getCatalogAssetDeliveryUrl(image.url, 'card'),
        detailUrl: getCatalogAssetDeliveryUrl(image.url, 'detail'),
    }
}

export function resolvePrimaryDisplayAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const displayCandidates = orderedImages.filter(
        (image) =>
            image.isActive &&
            (image.kind === WrapImageKind.HERO || image.kind === WrapImageKind.GALLERY)
    )

    const heroImage =
        displayCandidates.find((image) => image.kind === WrapImageKind.HERO) ??
        displayCandidates.find((image) => image.kind === WrapImageKind.GALLERY) ??
        orderedImages.find((image) => image.kind === WrapImageKind.HERO) ??
        orderedImages.find((image) => image.kind === WrapImageKind.GALLERY)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveHeroAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const heroImage =
        orderedImages.find((image) => image.isActive && image.kind === WrapImageKind.HERO) ??
        orderedImages.find((image) => image.kind === WrapImageKind.HERO)

    return heroImage ? toCatalogAssetImage(heroImage) : null
}

export function resolveCatalogGalleryImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const orderedImages = sortImages(images)
    const activeDisplayImages = orderedImages.filter(
        (image) => image.isActive && image.kind === WrapImageKind.GALLERY
    )
    const fallbackDisplayImages = orderedImages.filter(
        (image) => image.kind === WrapImageKind.GALLERY
    )

    return (activeDisplayImages.length > 0 ? activeDisplayImages : fallbackDisplayImages).map(
        toCatalogAssetImage
    )
}

export function resolveDisplayImages(images: WrapImageDTO[]): CatalogAssetImageDTO[] {
    const heroImage = resolveHeroAsset(images)
    const galleryImages = resolveCatalogGalleryImages(images)

    return heroImage ? [heroImage, ...galleryImages] : galleryImages
}

export function resolveVisualizerTextureAsset(images: WrapImageDTO[]): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const textureImage =
        orderedImages.find(
            (image) => image.isActive && image.kind === WrapImageKind.VISUALIZER_TEXTURE
        ) ?? orderedImages.find((image) => image.kind === WrapImageKind.VISUALIZER_TEXTURE)

    return textureImage ? toCatalogAssetImage(textureImage) : null
}

export function resolveVisualizerMaskHintAsset(
    images: WrapImageDTO[]
): CatalogAssetImageDTO | null {
    const orderedImages = sortImages(images)
    const maskHintImage =
        orderedImages.find(
            (image) => image.isActive && image.kind === WrapImageKind.VISUALIZER_MASK_HINT
        ) ?? orderedImages.find((image) => image.kind === WrapImageKind.VISUALIZER_MASK_HINT)

    return maskHintImage ? toCatalogAssetImage(maskHintImage) : null
}

export function getCatalogAssetReadiness(
    input:
        | WrapImageDTO[]
        | {
              name?: string | null
              price?: number | null
              images: WrapImageDTO[]
          }
): CatalogAssetReadinessDTO {
    const name = Array.isArray(input) ? undefined : input.name
    const price = Array.isArray(input) ? undefined : input.price
    const images = Array.isArray(input) ? input : input.images
    const activeImages = sortImages(images).filter((image) => image.isActive)
    const activeAssetKinds = Array.from(new Set(activeImages.map((image) => image.kind)))
    const missingRequiredAssetRoles = getMissingRequiredAssetRolesForPublish(activeImages)
    const activeHeroCount = getActiveImagesByKind(images, WrapImageKind.HERO).length
    const activeGalleryCount = getActiveImagesByKind(images, WrapImageKind.GALLERY).length
    const activeVisualizerTextureCount = getActiveImagesByKind(
        images,
        WrapImageKind.VISUALIZER_TEXTURE
    ).length
    const activeVisualizerMaskHintCount = getActiveImagesByKind(
        images,
        WrapImageKind.VISUALIZER_MASK_HINT
    ).length
    const primaryDisplayAsset = resolvePrimaryDisplayAsset(images)
    const issues: CatalogAssetReadinessDTO['issues'] = []

    if (typeof name === 'string' && name.trim().length === 0) {
        issues.push({
            code: 'missing_name',
            message: 'Wrap name is required before publish.',
            blocking: true,
        })
    }

    if (typeof price === 'number' && (!Number.isFinite(price) || price <= 0)) {
        issues.push({
            code: 'invalid_price',
            message: 'Wrap price must be greater than zero before publish.',
            blocking: true,
        })
    }

    if (!primaryDisplayAsset) {
        issues.push({
            code: 'missing_display_asset',
            message: 'Add a hero or gallery asset so the wrap can render in the catalog.',
            blocking: true,
        })
    }

    if (missingRequiredAssetRoles.includes(WrapImageKind.HERO)) {
        issues.push({
            code: 'missing_hero',
            message: 'Add an active hero asset before publish.',
            blocking: true,
        })
    }

    if (missingRequiredAssetRoles.includes(WrapImageKind.VISUALIZER_TEXTURE)) {
        issues.push({
            code: 'missing_visualizer_texture',
            message: 'Add an active visualizer texture before publish.',
            blocking: true,
        })
    }

    if (activeHeroCount > 1) {
        issues.push({
            code: 'multiple_active_hero',
            message: 'Only one hero asset can stay active at a time.',
            blocking: true,
        })
    }

    if (activeVisualizerTextureCount > 1) {
        issues.push({
            code: 'multiple_active_visualizer_texture',
            message: 'Only one visualizer texture can stay active at a time.',
            blocking: true,
        })
    }

    const canPublish = issues.every((issue) => !issue.blocking)

    return {
        canPublish,
        isVisualizerReady:
            activeHeroCount === 1 &&
            activeVisualizerTextureCount === 1 &&
            primaryDisplayAsset !== null,
        missingRequiredAssetRoles,
        requiredAssetRoles: [...PUBLISH_REQUIRED_WRAP_IMAGE_KINDS],
        activeAssetKinds,
        hasDisplayAsset: primaryDisplayAsset !== null,
        activeHeroCount,
        activeGalleryCount,
        activeVisualizerTextureCount,
        activeVisualizerMaskHintCount,
        issues,
    }
}

// Catalog-specific asset publish helpers
export function getMissingRequiredAssetRolesForPublish(
    images: { kind: WrapImageKind; isActive: boolean }[]
): PublishRequiredWrapImageKind[] {
    const activeRoles = new Set<WrapImageKind>(
        images.filter((image) => image.isActive).map((image) => image.kind as WrapImageKind)
    )

    return PUBLISH_REQUIRED_WRAP_IMAGE_KINDS.filter(
        (kind) => !activeRoles.has(kind)
    ) as PublishRequiredWrapImageKind[]
}

export function assertWrapCanBePublished(images: { kind: string; isActive: boolean }[]): void {
    const missingKinds = getMissingRequiredAssetRolesForPublish(
        images as { kind: WrapImageKind; isActive: boolean }[]
    )

    if (missingKinds.length === 0) {
        return
    }

    throw new Error(`Cannot publish wrap. Missing active asset roles: ${missingKinds.join(', ')}`)
}

export function assertWrapIsPublishReady(readiness: CatalogAssetReadinessDTO): void {
    if (readiness.canPublish) {
        return
    }

    const blockingMessages = readiness.issues
        .filter((issue) => issue.blocking)
        .map((issue) => issue.message)

    throw new Error(
        `Cannot publish wrap. ${blockingMessages.length > 0 ? blockingMessages.join(' ') : 'Wrap is not publish-ready.'}`
    )
}

```

## /lib/fetchers/platform.fetchers.ts


```ts
import "server-only"
import { prisma } from '@/lib/db/prisma'
import { requirePlatformDeveloperAdmin } from '@/lib/authz/guards'
import type {
    WebhookFailureDTO,
    WebhookOperationsOverviewDTO,
    WebhookSource,
    PlatformStatusOverviewDTO,
} from '@/types/platform.types'

const STALE_THRESHOLD_MINUTES = 5
const RECENT_FAILURE_LIMIT = 25

function toFailureDTO(
    source: WebhookSource,
    record: {
        id: string
        type: string
        status: string
        processedAt: Date
        error: string | null
        payload: unknown
    }
): WebhookFailureDTO {
    const canReplay = source === 'stripe' && record.payload !== null

    return {
        id: record.id,
        source,
        type: record.type,
        status: record.status,
        processedAt: record.processedAt.toISOString(),
        error: record.error,
        canReplay,
        replayUnavailableReason: canReplay
            ? null
            : source === 'clerk'
              ? 'Clerk replay stays owned by auth/authz and is not available from platform.'
              : 'Stored payload unavailable for replay.',
    }
}

export async function getWebhookOperationsOverview(): Promise<WebhookOperationsOverviewDTO> {
    await requirePlatformDeveloperAdmin()

    const staleCutoff = new Date(Date.now() - STALE_THRESHOLD_MINUTES * 60_000)

    const [
        clerkProcessed,
        clerkFailed,
        clerkProcessing,
        clerkStaleProcessing,
        clerkRecentFailures,
        stripeProcessed,
        stripeFailed,
        stripeProcessing,
        stripeStaleProcessing,
        stripeRecentFailures,
    ] = await Promise.all([
        prisma.clerkWebhookEvent.count({ where: { status: 'processed' } }),
        prisma.clerkWebhookEvent.count({ where: { status: 'failed' } }),
        prisma.clerkWebhookEvent.count({ where: { status: 'processing' } }),
        prisma.clerkWebhookEvent.count({
            where: { status: 'processing', processedAt: { lt: staleCutoff } },
        }),
        prisma.clerkWebhookEvent.findMany({
            where: { status: 'failed' },
            select: {
                id: true,
                type: true,
                status: true,
                processedAt: true,
                error: true,
                payload: true,
            },
            orderBy: { processedAt: 'desc' },
            take: RECENT_FAILURE_LIMIT,
        }),
        prisma.stripeWebhookEvent.count({ where: { status: 'processed' } }),
        prisma.stripeWebhookEvent.count({ where: { status: 'failed' } }),
        prisma.stripeWebhookEvent.count({ where: { status: 'processing' } }),
        prisma.stripeWebhookEvent.count({
            where: { status: 'processing', processedAt: { lt: staleCutoff } },
        }),
        prisma.stripeWebhookEvent.findMany({
            where: { status: 'failed' },
            select: {
                id: true,
                type: true,
                status: true,
                processedAt: true,
                error: true,
                payload: true,
            },
            orderBy: { processedAt: 'desc' },
            take: RECENT_FAILURE_LIMIT,
        }),
    ])

    const clerkFailures = clerkRecentFailures.map((record) => toFailureDTO('clerk', record))
    const stripeFailures = stripeRecentFailures.map((record) => toFailureDTO('stripe', record))

    return {
        generatedAt: new Date().toISOString(),
        staleThresholdMinutes: STALE_THRESHOLD_MINUTES,
        clerk: {
            processed: clerkProcessed,
            failed: clerkFailed,
            processing: clerkProcessing,
            staleProcessing: clerkStaleProcessing,
            recentFailures: clerkFailures,
            replayableRecentFailures: 0,
            nonReplayableRecentFailures: clerkFailures.length,
        },
        stripe: {
            processed: stripeProcessed,
            failed: stripeFailed,
            processing: stripeProcessing,
            staleProcessing: stripeStaleProcessing,
            recentFailures: stripeFailures,
            replayableRecentFailures: stripeFailures.filter((failure) => failure.canReplay).length,
            nonReplayableRecentFailures: stripeFailures.filter((failure) => !failure.canReplay)
                .length,
        },
    }
}

export async function getPlatformStatusOverview(): Promise<PlatformStatusOverviewDTO> {
    await requirePlatformDeveloperAdmin()

    const [versionResult, activeUsers, activeBookings, activeInvoices, activeWraps] =
        await Promise.all([
            prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`,
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.booking.count({ where: { deletedAt: null } }),
            prisma.invoice.count({ where: { deletedAt: null } }),
            prisma.wrap.count({ where: { deletedAt: null } }),
        ])

    return {
        generatedAt: new Date().toISOString(),
        databaseVersion: versionResult[0]?.version ?? 'Unknown',
        activeUsers,
        activeBookings,
        activeInvoices,
        activeWraps,
    }
}

```

## /lib/fetchers/scheduling.fetchers.ts


```ts
import 'server-only'
import { prisma } from '@/lib/db/prisma'
import { availabilitySelectFields, bookingSelectFields } from '@/lib/db/selects/scheduling.selects'
import { availabilityListParamsSchema, bookingListParamsSchema } from '@/schemas/scheduling.schemas'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import type {
    AvailabilityListParams,
    AvailabilityListResult,
    AvailabilityRuleDTO,
    AvailabilityWindowDTO,
    BookingDTO,
    BookingListParams,
    BookingListResult,
} from '@/types/scheduling.types'

import { getBookingDisplayStatus, BookingStatusValue } from '@/lib/constants/statuses'
async function requireSchedulingReadSession() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    if (!hasCapability(session.authz, 'scheduling.read.own')) {
        throw new Error('Forbidden: insufficient permissions')
    }

    return session
}

function canViewAllSchedulingBookings(
    session: Awaited<ReturnType<typeof requireSchedulingReadSession>>
): boolean {
    return hasCapability(session.authz, 'scheduling.read.all')
}

const DEFAULT_AVAILABILITY_LIST_PARAMS: AvailabilityListParams = {
    page: 1,
    pageSize: 20,
}

function toAvailabilityRuleDTO(record: {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Date
    updatedAt: Date
}): AvailabilityRuleDTO {
    return {
        id: record.id,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        capacitySlots: record.capacitySlots,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}

export async function getAvailabilityRules(
    params: AvailabilityListParams = DEFAULT_AVAILABILITY_LIST_PARAMS
): Promise<AvailabilityListResult> {
    await requireSchedulingReadSession()

    // Validate params at the action boundary: availabilityListParamsSchema.parse(params)
    const { page, pageSize, dayOfWeek } = params
    const skip = (page - 1) * pageSize

    const where = {
        deletedAt: null,
        ...(dayOfWeek !== undefined && { dayOfWeek }),
    }

    const [records, total] = await Promise.all([
        prisma.availabilityRule.findMany({
            where,
            select: availabilitySelectFields,
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
            skip,
            take: pageSize,
        }),
        prisma.availabilityRule.count({ where }),
    ])

    return {
        items: records.map(toAvailabilityRuleDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export const getAvailabilityWindows = getAvailabilityRules

export async function getAvailabilityRuleById(
    windowId: string
): Promise<AvailabilityWindowDTO | null> {
    await requireSchedulingReadSession()

    const record = await prisma.availabilityRule.findFirst({
        where: {
            id: windowId,
            deletedAt: null,
        },
        select: availabilitySelectFields,
    })

    return record ? toAvailabilityRuleDTO(record) : null
}

export const getAvailabilityWindowById = getAvailabilityRuleById

export async function getAvailabilityRulesByDay(
    dayOfWeek: number
): Promise<AvailabilityWindowDTO[]> {
    await requireSchedulingReadSession()

    const records = await prisma.availabilityRule.findMany({
        where: {
            dayOfWeek,
            deletedAt: null,
        },
        select: availabilitySelectFields,
        orderBy: { startTime: 'asc' },
    })

    return records.map(toAvailabilityRuleDTO)
}

export const getAvailabilityWindowsByDay = getAvailabilityRulesByDay

// Bookings
const DEFAULT_BOOKING_LIST_PARAMS: BookingListParams = {
    page: 1,
    pageSize: 20,
}

function toBookingDTO(record: {
    id: string
    customerId: string
    wrapId: string
    wrap: {
        name: string
    }
    startTime: Date
    endTime: Date
    status: string
    totalPrice: number
    reservation: {
        expiresAt: Date
    } | null
    createdAt: Date
    updatedAt: Date
}): BookingDTO {
    const reservationExpiresAtDate: Date | null = record.reservation?.expiresAt ?? null
    const displayStatus = getBookingDisplayStatus(
        record.status as BookingStatusValue,
        reservationExpiresAtDate
    )
    const reservationExpiresAt = reservationExpiresAtDate
        ? reservationExpiresAtDate.toISOString()
        : null

    return {
        id: record.id,
        customerId: record.customerId,
        wrapId: record.wrapId,
        wrapName: record.wrap.name,
        startTime: record.startTime.toISOString(),
        endTime: record.endTime.toISOString(),
        status: record.status as BookingDTO['status'],
        totalPrice: record.totalPrice,
        reservationExpiresAt,
        displayStatus,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}

export async function getBookings(
    params: BookingListParams = DEFAULT_BOOKING_LIST_PARAMS,
    _scope?: {
        customerId?: string
    }
): Promise<BookingListResult> {
    void _scope

    const session = await requireSchedulingReadSession()
    // Validate params at the action boundary: bookingListParamsSchema.parse(params)
    const { page, pageSize, status, fromDate, toDate } = params
    const skip = (page - 1) * pageSize

    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

    const where = {
        deletedAt: null,
        ...(customerId ? { customerId } : {}),
        ...(status !== undefined && { status }),
        ...((fromDate !== undefined || toDate !== undefined) && {
            startTime: {
                ...(fromDate !== undefined && { gte: fromDate }),
                ...(toDate !== undefined && { lte: toDate }),
            },
        }),
    }

    const [records, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            select: bookingSelectFields,
            orderBy: { startTime: 'asc' },
            skip,
            take: pageSize,
        }),
        prisma.booking.count({ where }),
    ])

    return {
        items: records.map(toBookingDTO),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    }
}

export async function getBookingById(bookingId: string): Promise<BookingDTO | null> {
    const session = await requireSchedulingReadSession()
    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

    const record = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            ...(customerId ? { customerId } : {}),
            deletedAt: null,
        },
        select: bookingSelectFields,
    })

    return record ? toBookingDTO(record) : null
}

export async function getUpcomingBookingCount(from: Date = new Date()): Promise<number> {
    const session = await requireSchedulingReadSession()
    const customerId = canViewAllSchedulingBookings(session) ? undefined : session.userId

    return prisma.booking.count({
        where: {
            ...(customerId ? { customerId } : {}),
            deletedAt: null,
            status: { notIn: ['cancelled', 'completed'] },
            startTime: { gte: from },
        },
    })
}

```

## /lib/fetchers/settings.fetchers.ts


```ts
import 'server-only'
import { requireAuthzCapability } from '@/lib/authz/guards'
import { prisma } from '@/lib/db/prisma'
import { type WebsiteSettingsDTO, type WebsiteSettingsInput } from '@/types/settings.types'
import { DEFAULT_STORE_TIMEZONE } from '@/lib/constants/app'

export function createDefaultWebsiteSettingsInput(): WebsiteSettingsInput {
    return {
        preferredContact: 'email',
        appointmentReminders: true,
        marketingOptIn: false,
        timezone: DEFAULT_STORE_TIMEZONE,
    }
}

export function createWebsiteSettingsDTO(
    input: WebsiteSettingsInput,
    updatedAt: Date | string | null
): WebsiteSettingsDTO {
    return {
        preferredContact: input.preferredContact,
        appointmentReminders: input.appointmentReminders,
        marketingOptIn: input.marketingOptIn,
        timezone: input.timezone,
        updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    }
}

export async function getCurrentUserWebsiteSettings(): Promise<WebsiteSettingsDTO> {
    const session = await requireAuthzCapability('settings.manage.own')

    if (!session.userId) {
        throw new Error('Unauthorized: not authenticated')
    }

    const settings = await prisma.websiteSettings.findFirst({
        where: {
            clerkUserId: session.userId,
            deletedAt: null,
        },
        select: {
            preferredContact: true,
            appointmentReminders: true,
            marketingOptIn: true,
            timezone: true,
            updatedAt: true,
        },
    })

    if (!settings) {
        return createWebsiteSettingsDTO(createDefaultWebsiteSettingsInput(), null)
    }

    return createWebsiteSettingsDTO(
        {
            preferredContact: settings.preferredContact as 'email' | 'sms',
            appointmentReminders: settings.appointmentReminders,
            marketingOptIn: settings.marketingOptIn,
            timezone: settings.timezone,
        },
        settings.updatedAt
    )
}

```

## /lib/fetchers/visualizer.fetchers.ts


```ts
import "server-only"
import { getSession } from '@/lib/auth/session'
import { requireCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import {
    getVisualizerSelectableWrapById,
    listVisualizerSelectableWraps,
    type WrapVisibilityScope,
} from '@/lib/fetchers/catalog.fetchers'
import { toVisualizerPreviewDTO } from '@/lib/fetchers/visualizer.mappers'
import { visualizerPreviewDTOFields } from '@/lib/db/selects/visualizer.selects'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'

export { type WrapVisibilityScope } from '@/lib/fetchers/catalog.fetchers'

export async function getVisualizerWrapSelectionById(
    wrapId: string,
    scope: WrapVisibilityScope = {}
) {
    return getVisualizerSelectableWrapById(wrapId, scope)
}

export async function listVisualizerWrapSelections(scope: WrapVisibilityScope = {}) {
    return listVisualizerSelectableWraps(scope)
}

export async function getPreviewById(previewId: string): Promise<VisualizerPreviewDTO | null> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return null
    }

    requireCapability(session.authz, 'visualizer.use')

    const preview = await prisma.visualizerPreview.findFirst({
        where: {
            id: previewId,
            ownerClerkUserId: userId,
            deletedAt: null,
        },
        select: visualizerPreviewDTOFields,
    })

    return preview ? toVisualizerPreviewDTO(preview) : null
}

export async function getPreviewsByWrap(wrapId: string): Promise<VisualizerPreviewDTO[]> {
    const session = await getSession()
    const userId = session.userId
    if (!session.isAuthenticated || !userId) {
        return []
    }

    requireCapability(session.authz, 'visualizer.use')

    const previews = await prisma.visualizerPreview.findMany({
        where: {
            wrapId,
            ownerClerkUserId: userId,
            deletedAt: null,
            expiresAt: {
                gt: new Date(),
            },
        },
        orderBy: { createdAt: 'desc' },
        select: visualizerPreviewDTOFields,
    })

    return previews.map(toVisualizerPreviewDTO)
}

```

## /lib/fetchers/visualizer.mappers.ts


```ts
import type { PreviewStatus } from '@/lib/constants/statuses'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { visualizerPreviewDTOFields } from '@/lib/db/selects/visualizer.selects'

type VisualizerPreviewRecord = {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: string
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}

export function toVisualizerPreviewDTO(record: VisualizerPreviewRecord): VisualizerPreviewDTO {
    return {
        id: record.id,
        wrapId: record.wrapId,
        customerPhotoUrl: record.customerPhotoUrl,
        processedImageUrl: record.processedImageUrl,
        status: record.status as PreviewStatus,
        cacheKey: record.cacheKey,
        sourceWrapImageId: record.sourceWrapImageId,
        sourceWrapImageVersion: record.sourceWrapImageVersion,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }
}

```

## /lib/integrations/blob.ts


```ts
/**
 * Blob adapter: provider-agnostic surface for storage/blob operations.
 *
 * This module adapts the active provider implementation (Cloudinary today)
 * into a stable, provider-agnostic API consumed by the rest of the application
 * (for example, `lib/uploads/storage.ts`). Do not import Cloudinary directly
 * in application code; import from `lib/integrations/blob` instead so the
 * underlying provider can be replaced with minimal changes.
 */
import {
    cloudinary as _cloudinary,
    getCloudinaryCredentials,
    buildCloudinarySignature,
    extractCloudinaryPublicId,
} from '@/lib/integrations/cloudinary'

// Re-export cloudinary instance (kept name `cloudinary` for downstream compatibility)
export const cloudinary = _cloudinary

// Generic adapter-facing names
export const getBlobCredentials = getCloudinaryCredentials
export const buildBlobSignature = buildCloudinarySignature
export const extractBlobPublicId = extractCloudinaryPublicId

export type BlobCredentials = ReturnType<typeof getBlobCredentials>

// Note: This file intentionally adapts the existing Cloudinary integration into a
// generic "blob" integration surface. Future providers should implement the same
// exported helpers here so upload/storage callers don't depend on provider names.

```

## /lib/integrations/clerk.ts


```ts
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

```

## /lib/integrations/cloudinary.ts


```ts
/**
 * Provider-specific Cloudinary integration.
 *
 * This file contains direct Cloudinary SDK initialization and utility helpers.
 * It is considered provider-specific and should not be imported directly by
 * higher-level upload/storage code. Use `lib/integrations/blob.ts` as the
 * canonical, provider-agnostic adapter surface instead.
 *
 * NOTE: This module intentionally keeps a tiny surface of helpers that the
 * `blob` adapter re-exports. Keep behavior unchanged when editing.
 */
import { v2 as cloudinary } from 'cloudinary'
import { createHash } from 'crypto'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryCredentials {
    cloudName: string
    apiKey: string
    apiSecret: string
}

export function getCloudinaryCredentials(): CloudinaryCredentials | null {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? ''
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? ''
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? ''

    if (!cloudName || !apiKey || !apiSecret) {
        return null
    }

    return {
        cloudName,
        apiKey,
        apiSecret,
    }
}

export function buildCloudinarySignature(
    payload: Record<string, string>,
    apiSecret: string
): string {
    const signingString = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key]}`)
        .join('&')

    return createHash('sha1').update(`${signingString}${apiSecret}`).digest('hex')
}

export function extractCloudinaryPublicId(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (!parsed.hostname.includes('res.cloudinary.com')) {
            return null
        }

        const segments = parsed.pathname.split('/').filter(Boolean)
        const uploadIndex = segments.indexOf('upload')
        if (uploadIndex < 0 || uploadIndex + 1 >= segments.length) {
            return null
        }

        const publicIdSegments = segments.slice(uploadIndex + 1)
        if (publicIdSegments[0] && /^v\d+$/.test(publicIdSegments[0])) {
            publicIdSegments.shift()
        }

        if (publicIdSegments.length === 0) {
            return null
        }

        const lastSegment = publicIdSegments[publicIdSegments.length - 1] ?? ''
        publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(/\.[a-zA-Z0-9]+$/, '')

        return publicIdSegments.join('/')
    } catch {
        return null
    }
}

export { cloudinary }

```

## /lib/integrations/huggingface.ts


```ts
import { InferenceClient } from '@huggingface/inference'
import sharp from 'sharp'

function parseAllowedHosts(value: string | undefined): string[] {
    if (!value) {
        return []
    }

    return value
        .split(',')
        .map((host) => host.trim().toLowerCase())
        .filter((host) => host.length > 0)
}

function extractHostFromUrl(url: string | undefined): string | null {
    if (!url) {
        return null
    }

    try {
        return new URL(url).hostname.toLowerCase()
    } catch {
        return null
    }
}

export const visualizerConfig = {
    maxUploadSizeBytes: Number(process.env.VISUALIZER_MAX_UPLOAD_SIZE_BYTES ?? 10 * 1024 * 1024),
    supportedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    previewTtlMs: 24 * 60 * 60 * 1000,
    maskModel: process.env.HUGGINGFACE_VISUALIZER_MODEL ?? 'keras/segformer_b1_cityscapes_1024',
    huggingFaceModelRevision: process.env.HUGGINGFACE_VISUALIZER_REVISION ?? 'main',
    huggingFaceProvider: process.env.HUGGINGFACE_VISUALIZER_PROVIDER ?? 'self-hosted',
    previewModel: process.env.HUGGINGFACE_VISUALIZER_PREVIEW_MODEL ?? '',
    previewProvider: process.env.HUGGINGFACE_VISUALIZER_PREVIEW_PROVIDER ?? 'hf-inference',
    huggingFaceApiBase:
        process.env.HUGGINGFACE_INFERENCE_API_BASE ?? 'https://api-inference.huggingface.co/models',
    huggingFaceToken: process.env.HUGGINGFACE_API_TOKEN,
    huggingFaceTimeoutMs: Number(process.env.HUGGINGFACE_TIMEOUT_MS ?? 12000),
    huggingFaceRetries: Number(process.env.HUGGINGFACE_RETRIES ?? 2),
    blendMode:
        (process.env.VISUALIZER_BLEND_MODE as 'multiply' | 'overlay' | undefined) ?? 'multiply',
    overlayOpacity: Number(process.env.VISUALIZER_OVERLAY_OPACITY ?? 0.58),
    allowedRemotePhotoHosts: Array.from(
        new Set(
            [
                ...parseAllowedHosts(process.env.VISUALIZER_ALLOWED_IMAGE_HOSTS),
                extractHostFromUrl(process.env.NEXT_PUBLIC_APP_URL),
                extractHostFromUrl(process.env.BLOB_STORE_URL),
                process.env.BLOB_READ_WRITE_TOKEN ? 'blob.vercel-storage.com' : null,
            ].filter((value): value is string => Boolean(value))
        )
    ),
}

export function isAllowedRemotePhotoHost(hostname: string): boolean {
    const normalizedHostname = hostname.toLowerCase()

    return visualizerConfig.allowedRemotePhotoHosts.some(
        (allowedHost) =>
            normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`)
    )
}

interface HfSegmentationResult {
    label?: string
    score?: number
    mask?: string
}

const VEHICLE_LABELS = new Set(['car', 'truck', 'bus', 'vehicle'])

function buildHfInferenceUrl(): string {
    const encodedModel = encodeURIComponent(visualizerConfig.maskModel)
    const base = `${visualizerConfig.huggingFaceApiBase}/${encodedModel}`
    const revision = visualizerConfig.huggingFaceModelRevision?.trim()

    if (!revision || revision === 'main') {
        return base
    }

    return `${base}?revision=${encodeURIComponent(revision)}`
}

async function callHf(imageBuffer: Buffer): Promise<HfSegmentationResult[]> {
    if (!visualizerConfig.huggingFaceToken) {
        throw new Error('HUGGINGFACE_API_TOKEN is required for segmentation')
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), visualizerConfig.huggingFaceTimeoutMs)

    try {
        const response = await fetch(buildHfInferenceUrl(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${visualizerConfig.huggingFaceToken}`,
                'Content-Type': 'application/octet-stream',
            },
            body: new Uint8Array(imageBuffer),
            signal: controller.signal,
        })

        if (!response.ok) {
            throw new Error(`HF inference failed: ${response.status}`)
        }

        return (await response.json()) as HfSegmentationResult[]
    } finally {
        clearTimeout(timeout)
    }
}

export async function createVehicleMask(imageBuffer: Buffer): Promise<Buffer> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= visualizerConfig.huggingFaceRetries; attempt += 1) {
        try {
            const results = await callHf(imageBuffer)
            const candidate = results
                .filter(
                    (item) => item.mask && item.label && VEHICLE_LABELS.has(item.label.toLowerCase())
                )
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]

            if (!candidate?.mask) {
                throw new Error('No vehicle labels found in segmentation output')
            }

            return Buffer.from(candidate.mask, 'base64')
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown HF inference error')
            if (attempt === visualizerConfig.huggingFaceRetries) {
                break
            }

            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
        }
    }

    throw lastError ?? new Error('Failed to generate vehicle mask')
}

export async function fallbackCenterMask(imageBuffer: Buffer): Promise<Buffer> {
    const metadata = await sharp(imageBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid source image dimensions')
    }

    const svgMask = `
    <svg width="${metadata.width}" height="${metadata.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <ellipse cx="${metadata.width / 2}" cy="${metadata.height * 0.58}" rx="${metadata.width * 0.4}" ry="${metadata.height * 0.23}" fill="white"/>
    </svg>
  `

    return sharp(Buffer.from(svgMask)).png().toBuffer()
}

export class HuggingFacePreviewUnavailableError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'HuggingFacePreviewUnavailableError'
    }
}

export interface WrapPreviewGeneratorInput {
    boardBuffer: Buffer
    prompt: string
    negativePrompt?: string | null
}

export interface WrapPreviewGeneratorAdapter {
    generate(input: WrapPreviewGeneratorInput): Promise<Buffer>
}

class HuggingFaceWrapPreviewAdapter implements WrapPreviewGeneratorAdapter {
    private readonly client: InferenceClient

    constructor() {
        if (!visualizerConfig.huggingFaceToken) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview generation is not configured.'
            )
        }

        if (!visualizerConfig.previewModel) {
            throw new HuggingFacePreviewUnavailableError(
                'Hugging Face preview model is not configured.'
            )
        }

        this.client = new InferenceClient(visualizerConfig.huggingFaceToken)
    }

    async generate(input: WrapPreviewGeneratorInput): Promise<Buffer> {
        const prompt = input.negativePrompt
            ? `${input.prompt}\nNegative prompt: ${input.negativePrompt}`
            : input.prompt

        const generationPromise = this.client.imageToImage({
            model: visualizerConfig.previewModel,
            inputs: new Blob([new Uint8Array(input.boardBuffer)], { type: 'image/png' }),
            parameters: {
                prompt,
            },
        })

        const result = await Promise.race([
            generationPromise,
            new Promise<never>((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new HuggingFacePreviewUnavailableError(
                                'Hugging Face preview generation timed out.'
                            )
                        ),
                    visualizerConfig.huggingFaceTimeoutMs
                )
            ),
        ]).catch((error: unknown) => {
            if (error instanceof HuggingFacePreviewUnavailableError) {
                throw error
            }

            const message = error instanceof Error ? error.message : 'Hugging Face preview failed.'
            throw new HuggingFacePreviewUnavailableError(message)
        })

        return Buffer.from(await result.arrayBuffer())
    }
}

export function createWrapPreviewGeneratorAdapter(): WrapPreviewGeneratorAdapter {
    return new HuggingFaceWrapPreviewAdapter()
}

```

## /lib/integrations/stripe.ts


```ts
import Stripe from 'stripe'

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-02-25.clover'

let stripeClient: Stripe | null = null

function getRequiredEnv(name: 'STRIPE_SECRET_KEY' | 'STRIPE_WEBHOOK_SECRET'): string {
    const value = process.env[name]?.trim()
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

```

## /lib/uploads/file-validation.ts


```ts
export const ALLOWED_WRAP_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
export const MAX_WRAP_IMAGE_BYTES = 5 * 1024 * 1024

export function validateWrapImageFile(file: File): void {
    if (!ALLOWED_WRAP_IMAGE_MIME_TYPES.has(file.type)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP.')
    }

    if (file.size <= 0 || file.size > MAX_WRAP_IMAGE_BYTES) {
        throw new Error('Image exceeds size limit of 5MB.')
    }
}

```

## /lib/uploads/image-processing.ts


```ts
import crypto from 'crypto'
import { readFile } from 'fs/promises'
import path from 'path'

import sharp from 'sharp'

import {
    createVehicleMask,
    fallbackCenterMask,
    isAllowedRemotePhotoHost,
    visualizerConfig,
} from '@/lib/integrations/huggingface'
import { storePreviewImage } from '@/lib/uploads/storage'

const MIN_DIMENSION = 512
const MAX_DIMENSION = 4096
const NORMALIZED_MAX_DIMENSION = 2048

export interface NormalizedVehicleUpload {
    buffer: Buffer
    contentType: 'image/png'
    width: number
    height: number
    hash: string
}

export interface WrapPromptInput {
    name: string
    description: string | null
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
}

function parseDataUrl(customerPhotoUrl: string): { buffer: Buffer; contentType: string } {
    const match = customerPhotoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) {
        throw new Error('Invalid data URL')
    }

    const contentType = match[1].toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    return { buffer, contentType }
}

export function assertApprovedRemoteHost(url: URL): void {
    const host = url.hostname.toLowerCase()
    if (!isAllowedRemotePhotoHost(host)) {
        throw new Error('Image host is not allowed')
    }
}

async function readRemoteImage(url: URL): Promise<{ buffer: Buffer; contentType: string }> {
    if (url.protocol !== 'https:') {
        throw new Error('Only HTTPS image URLs are allowed')
    }

    assertApprovedRemoteHost(url)

    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error('Unable to fetch image')
    }

    const contentType = response.headers.get('content-type')?.split(';')[0].toLowerCase() ?? ''
    if (!visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    return { buffer, contentType }
}

async function readLocalWrapImage(
    urlPath: string
): Promise<{ buffer: Buffer; contentType: string }> {
    if (!urlPath.startsWith('/uploads/wraps/')) {
        throw new Error('Unsupported local texture path')
    }

    const normalized = path.normalize(urlPath).replaceAll('\\', '/')
    if (!normalized.startsWith('/uploads/wraps/')) {
        throw new Error('Invalid local texture path')
    }

    const absolute = path.join(process.cwd(), 'public', ...normalized.split('/').filter(Boolean))
    const extension = path.extname(absolute).toLowerCase()
    const contentType =
        extension === '.png'
            ? 'image/png'
            : extension === '.jpg' || extension === '.jpeg'
              ? 'image/jpeg'
              : extension === '.webp'
                ? 'image/webp'
                : ''

    if (!contentType || !visualizerConfig.supportedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported image type')
    }

    const buffer = await readFile(absolute)
    return { buffer, contentType }
}

export async function readPhotoBuffer(
    customerPhotoUrl: string
): Promise<{ buffer: Buffer; contentType: string }> {
    if (customerPhotoUrl.startsWith('data:')) {
        return parseDataUrl(customerPhotoUrl)
    }

    let parsed: URL
    try {
        parsed = new URL(customerPhotoUrl)
    } catch {
        throw new Error('Only data URLs or approved HTTPS image URLs are allowed')
    }

    return readRemoteImage(parsed)
}

export async function readImageBufferFromUrl(url: string): Promise<Buffer> {
    if (url.startsWith('data:')) {
        return parseDataUrl(url).buffer
    }

    if (url.startsWith('/')) {
        return readLocalWrapImage(url).then((result) => result.buffer)
    }

    return readRemoteImage(new URL(url)).then((result) => result.buffer)
}

export async function normalizeVehicleUpload(file: File): Promise<NormalizedVehicleUpload> {
    const mimeType = file.type.toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(mimeType)) {
        throw new Error('Unsupported image type')
    }

    if (file.size > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const normalizedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(NORMALIZED_MAX_DIMENSION, NORMALIZED_MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .png()
        .toBuffer()

    const metadata = await sharp(normalizedBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
        throw new Error('Image too small (min 512x512)')
    }

    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        throw new Error('Image too large (max 4096x4096)')
    }

    return {
        buffer: normalizedBuffer,
        contentType: 'image/png',
        width: metadata.width,
        height: metadata.height,
        hash: crypto.createHash('sha256').update(normalizedBuffer).digest('hex'),
    }
}

export async function normalizeVehicleBuffer(
    inputBuffer: Buffer,
    contentType: string
): Promise<NormalizedVehicleUpload> {
    const mimeType = contentType.toLowerCase()
    if (!visualizerConfig.supportedMimeTypes.includes(mimeType)) {
        throw new Error('Unsupported image type')
    }

    if (inputBuffer.length > visualizerConfig.maxUploadSizeBytes) {
        throw new Error('Uploaded image exceeds max size')
    }

    const normalizedBuffer = await sharp(inputBuffer)
        .rotate()
        .resize(NORMALIZED_MAX_DIMENSION, NORMALIZED_MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true,
        })
        .png()
        .toBuffer()

    const metadata = await sharp(normalizedBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
        throw new Error('Image too small (min 512x512)')
    }

    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        throw new Error('Image too large (max 4096x4096)')
    }

    return {
        buffer: normalizedBuffer,
        contentType: 'image/png',
        width: metadata.width,
        height: metadata.height,
        hash: crypto.createHash('sha256').update(normalizedBuffer).digest('hex'),
    }
}

function applyWrapPromptTemplate(template: string, input: WrapPromptInput): string {
    return template
        .replaceAll('{{wrap_name}}', input.name)
        .replaceAll('{{wrap_description}}', input.description ?? '')
}

export function buildWrapPreviewPrompt(input: WrapPromptInput): {
    prompt: string
    negativePrompt: string
    promptVersion: string
} {
    const prompt = input.aiPromptTemplate?.trim()
        ? applyWrapPromptTemplate(input.aiPromptTemplate, input)
        : [
              `Apply the wrap design "${input.name}" to the supplied vehicle image.`,
              'Keep the vehicle body shape, wheel position, reflections, windows, background, and camera angle unchanged.',
              'Use the provided wrap texture as the exterior material reference.',
              input.description ? `Design notes: ${input.description}` : null,
              'Produce a professional, realistic commercial vehicle wrap preview.',
          ]
              .filter(Boolean)
              .join(' ')

    const negativePrompt =
        input.aiNegativePrompt?.trim() ??
        'Do not change the vehicle model, body panels, mirrors, wheels, windows, lighting, or environment. Avoid distortions, extra vehicles, warped logos, unreadable text, and surreal edits.'

    const promptVersion = crypto
        .createHash('sha256')
        .update(`${prompt}\n---\n${negativePrompt}`)
        .digest('hex')

    return {
        prompt,
        negativePrompt,
        promptVersion,
    }
}

export async function buildPreviewConditioningBoard(params: {
    vehicleBuffer: Buffer
    textureBuffer: Buffer
    wrapName: string
    wrapDescription: string | null
}): Promise<Buffer> {
    const canvasWidth = 1536
    const canvasHeight = 1024
    const photoWidth = 1040
    const swatchWidth = 400
    const gutter = 48
    const rightPanelX = photoWidth + gutter

    const vehicleImage = await sharp(params.vehicleBuffer)
        .resize(photoWidth, canvasHeight - 96, { fit: 'contain', background: '#09090b' })
        .png()
        .toBuffer()

    const textureTile = await sharp(params.textureBuffer)
        .resize(swatchWidth, swatchWidth, { fit: 'cover' })
        .png()
        .toBuffer()

    const copySvg = Buffer.from(`
        <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#09090b"/>
          <text x="${rightPanelX}" y="110" fill="#f5f5f5" font-size="56" font-family="Arial, sans-serif" font-weight="700">
            ${params.wrapName.replaceAll('&', '&amp;')}
          </text>
          <text x="${rightPanelX}" y="164" fill="#a3a3a3" font-size="24" font-family="Arial, sans-serif">
            Wrap texture reference
          </text>
          <text x="${rightPanelX}" y="654" fill="#a3a3a3" font-size="26" font-family="Arial, sans-serif">
            ${(
                params.wrapDescription ??
                'Apply this wrap while preserving the original vehicle and background.'
            )
                .slice(0, 160)
                .replaceAll('&', '&amp;')}
          </text>
        </svg>
    `)

    return sharp({
        create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: '#09090b',
        },
    })
        .composite([
            { input: copySvg },
            { input: vehicleImage, left: 24, top: 48 },
            { input: textureTile, left: rightPanelX, top: 220 },
        ])
        .png()
        .toBuffer()
}

export async function compositeVehicleWrap(params: {
    photoBuffer: Buffer
    maskBuffer: Buffer
    textureBuffer: Buffer
    opacity: number
    blend: 'multiply' | 'overlay'
}): Promise<Buffer> {
    const baseMetadata = await sharp(params.photoBuffer).metadata()
    if (!baseMetadata.width || !baseMetadata.height) {
        throw new Error('Unable to read uploaded photo dimensions')
    }

    const width = baseMetadata.width
    const height = baseMetadata.height

    const resizedTexture = await sharp(params.textureBuffer)
        .resize(width, height, { fit: 'cover' })
        .ensureAlpha(params.opacity)
        .png()
        .toBuffer()

    const maskedTexture = await sharp(resizedTexture)
        .composite([{ input: params.maskBuffer, blend: 'dest-in' }])
        .png()
        .toBuffer()

    return sharp(params.photoBuffer)
        .composite([{ input: maskedTexture, blend: params.blend }])
        .png()
        .toBuffer()
}

export async function generateDeterministicCompositePreview(params: {
    previewId: string
    photoBuffer: Buffer
    textureBuffer: Buffer
}): Promise<string> {
    let maskBuffer: Buffer
    try {
        maskBuffer = await createVehicleMask(params.photoBuffer)
    } catch {
        maskBuffer = await fallbackCenterMask(params.photoBuffer)
    }

    const metadata = await sharp(params.photoBuffer).metadata()
    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid photo dimensions')
    }

    const normalizedMask = await sharp(maskBuffer)
        .resize(metadata.width, metadata.height)
        .png()
        .toBuffer()

    const normalizedTexture = await sharp(params.textureBuffer)
        .resize(metadata.width, metadata.height)
        .png()
        .toBuffer()

    const composited = await compositeVehicleWrap({
        photoBuffer: params.photoBuffer,
        maskBuffer: normalizedMask,
        textureBuffer: normalizedTexture,
        opacity: visualizerConfig.overlayOpacity,
        blend: visualizerConfig.blendMode,
    })

    return storePreviewImage({
        previewId: params.previewId,
        buffer: composited,
        contentType: 'image/png',
    })
}

```

## /lib/uploads/storage.ts


```ts
import { createHash, randomUUID } from 'crypto'
import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'

import {
    buildBlobSignature,
    cloudinary,
    extractBlobPublicId,
    getBlobCredentials,
} from '@/lib/integrations/blob'
import { validateWrapImageFile } from '@/lib/uploads/file-validation'

const IMAGE_EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

interface PersistedWrapImage {
    url: string
    contentHash: string
}

function computeContentHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex')
}

async function persistWrapImageLocally(params: {
    wrapId: string
    file: File
    buffer: Buffer
    contentHash: string
}): Promise<PersistedWrapImage> {
    const ext = IMAGE_EXT_BY_TYPE[params.file.type]
    const fileName = `${params.wrapId}-${randomUUID()}.${ext}`
    const relativeDir = path.join('uploads', 'wraps')
    const relativePath = path.join(relativeDir, fileName)
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await mkdir(absoluteDir, { recursive: true })
    await writeFile(absolutePath, params.buffer)

    return {
        url: `/${relativePath.replaceAll(path.sep, '/')}`,
        contentHash: params.contentHash,
    }
}

async function uploadWrapImageToCloudinary(params: {
    wrapId: string
    file: File
    buffer: Buffer
    contentHash: string
}): Promise<PersistedWrapImage> {
    const credentials = getBlobCredentials()
    if (!credentials) {
        return persistWrapImageLocally(params)
    }

    const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
    const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
    const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
    const ext = IMAGE_EXT_BY_TYPE[params.file.type] ?? 'png'
    const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`
    const formData = new FormData()

    formData.set(
        'file',
        new Blob([new Uint8Array(params.buffer)], { type: params.file.type }),
        `${publicId}.${ext}`
    )

    if (uploadPreset) {
        formData.set('upload_preset', uploadPreset)
        formData.set('public_id', publicId)
    } else {
        const timestamp = Math.floor(Date.now() / 1000).toString()
        const signature = buildBlobSignature(
            { public_id: publicId, timestamp },
            credentials.apiSecret
        )

        formData.set('public_id', publicId)
        formData.set('timestamp', timestamp)
        formData.set('api_key', credentials.apiKey)
        formData.set('signature', signature)
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Cloudinary upload failed')
    }

    const payload = (await response.json()) as { secure_url?: string }
    if (!payload.secure_url) {
        throw new Error('Cloudinary upload did not return a secure URL')
    }

    return {
        url: payload.secure_url,
        contentHash: params.contentHash,
    }
}

export async function persistWrapImage(params: {
    wrapId: string
    file: File
}): Promise<PersistedWrapImage> {
    validateWrapImageFile(params.file)

    const buffer = Buffer.from(await params.file.arrayBuffer())
    const contentHash = computeContentHash(buffer)

    if (getBlobCredentials()) {
        return uploadWrapImageToCloudinary({
            wrapId: params.wrapId,
            file: params.file,
            buffer,
            contentHash,
        })
    }

    return persistWrapImageLocally({
        wrapId: params.wrapId,
        file: params.file,
        buffer,
        contentHash,
    })
}

export async function persistWrapImageFromBuffer(params: {
    wrapId: string
    buffer: Buffer
    contentType: string
}): Promise<PersistedWrapImage> {
    const contentHash = computeContentHash(params.buffer)

    if (getBlobCredentials()) {
        // upload buffer to cloud provider via blob adapter
        const credentials = getBlobCredentials()!
        const uploadPreset = process.env.CLOUDINARY_WRAP_UPLOAD_PRESET?.trim() ?? null
        const folder = process.env.CLOUDINARY_WRAP_FOLDER?.trim() || 'ctrlplus/wraps'
        const publicId = `${folder}/${params.wrapId}-${randomUUID()}`
        const ext = IMAGE_EXT_BY_TYPE[params.contentType] ?? 'png'
        const endpoint = `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`
        const formData = new FormData()

        formData.set(
            'file',
            new Blob([new Uint8Array(params.buffer)], { type: params.contentType }),
            `${publicId}.${ext}`
        )

        if (uploadPreset) {
            formData.set('upload_preset', uploadPreset)
            formData.set('public_id', publicId)
        } else {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const signature = buildBlobSignature(
                { public_id: publicId, timestamp },
                credentials.apiSecret
            )

            formData.set('public_id', publicId)
            formData.set('timestamp', timestamp)
            formData.set('api_key', credentials.apiKey)
            formData.set('signature', signature)
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Cloudinary upload failed')
        }

        const payload = (await response.json()) as { secure_url?: string }
        if (!payload.secure_url) {
            throw new Error('Cloudinary upload did not return a secure URL')
        }

        return {
            url: payload.secure_url,
            contentHash,
        }
    }

    // fallback to local persistence
    const ext = IMAGE_EXT_BY_TYPE[params.contentType] ?? 'png'
    const fileName = `${params.wrapId}-${randomUUID()}.${ext}`
    const relativeDir = path.join('uploads', 'wraps')
    const relativePath = path.join(relativeDir, fileName)
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir)
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await mkdir(absoluteDir, { recursive: true })
    await writeFile(absolutePath, params.buffer)

    return {
        url: `/${relativePath.replaceAll(path.sep, '/')}`,
        contentHash,
    }
}

export async function deletePersistedWrapImage(url: string): Promise<void> {
    const credentials = getBlobCredentials()
    const publicId = extractBlobPublicId(url)

    if (credentials && publicId) {
        try {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const signature = buildBlobSignature(
                { public_id: publicId, timestamp },
                credentials.apiSecret
            )

            await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/destroy`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    public_id: publicId,
                    timestamp,
                    api_key: credentials.apiKey,
                    signature,
                }),
            })
            return
        } catch {
            // Fall through to the local cleanup path.
        }
    }

    if (!url.startsWith('/uploads/wraps/')) {
        return
    }

    const absolutePath = path.join(process.cwd(), 'public', ...url.split('/').filter(Boolean))

    try {
        await unlink(absolutePath)
    } catch {
        // DB soft-delete remains authoritative.
    }
}

export function storePreviewImage(params: {
    previewId: string
    buffer: Buffer
    contentType?: string
}): Promise<string> {
    void params.contentType

    return new Promise((resolve, reject) => {
        const publicId = `visualizer/previews/${params.previewId}-${randomUUID()}`
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                folder: 'visualizer/previews',
                resource_type: 'image',
                overwrite: true,
                format: 'png',
            },
            (error, result) => {
                if (error || !result?.secure_url) {
                    reject(error ?? new Error('Preview image storage failed.'))
                    return
                }

                resolve(result.secure_url)
            }
        )

        uploadStream.end(params.buffer)
    })
}

```

## /lib/utils/assertions.ts


```ts
export function assertNeonPooledRuntimeUrl(connectionString: string): void {
    let hostname: string

    try {
        hostname = new URL(connectionString).hostname.toLowerCase()
    } catch {
        throw new Error('DATABASE_URL must be a valid PostgreSQL connection string.')
    }

    const isNeonHost = hostname.includes('neon.tech')

    if (isNeonHost && !hostname.includes('-pooler')) {
        throw new Error(
            "DATABASE_URL must use Neon's pooled hostname (-pooler) for application traffic. " +
                'Use the direct connection only for Prisma CLI operations in prisma.config.ts.'
        )
    }
}

export function assertApprovedRemoteHost(url: URL, isAllowedHost: (hostname: string) => boolean): void {
    const host = url.hostname.toLowerCase()
    if (!isAllowedHost(host)) {
        throw new Error('Image host is not allowed')
    }
}

```

## /lib/utils/cn.ts


```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

```

## /lib/utils/currency.ts


```ts
export function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(priceInCents / 100)
}

```

## /lib/utils/dates.ts


```ts
export function formatInstallationTime(minutes: number | null): string | null {
    if (minutes === null) {
        return null
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
        return `${remainingMinutes} min`
    }

    if (remainingMinutes === 0) {
        return `${hours} hr`
    }

    return `${hours} hr ${remainingMinutes} min`
}

export function toHHmm(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
}

```

## /lib/utils/pagination.ts


```ts
export function getOffset(page: number, pageSize: number): number {
    return Math.max(0, (page - 1) * pageSize)
}

export function getTotalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize))
}

```

## /lib/utils/search-params.ts


```ts
import { APP_ROUTES } from '@/lib/constants/app'
import { searchWrapsSchema } from '@/schemas/catalog.schemas'
import { visualizerSearchParamsSchema } from '@/schemas/visualizer.schemas'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib/constants/app'
import type { CatalogSearchParamsResult, SearchWrapsInput } from '@/types/catalog.types'
import type { SearchParamRecord } from '@/types/common.types'
import type { VisualizerSearchParamsResult } from '@/types/visualizer.types'

function toNumber(value: string | null): number | undefined {
    if (!value) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value
}

export function createCatalogQueryString(filters: SearchWrapsInput): string {
    const params = new URLSearchParams()

    if (filters.query) {
        params.set('query', filters.query)
    }

    if (filters.maxPrice !== undefined) {
        params.set('maxPrice', String(filters.maxPrice))
    }

    if (filters.categoryId) {
        params.set('categoryId', filters.categoryId)
    }

    if (filters.sortBy && filters.sortBy !== 'createdAt') {
        params.set('sortBy', filters.sortBy)
    }

    if (filters.sortOrder && filters.sortOrder !== 'desc') {
        params.set('sortOrder', filters.sortOrder)
    }

    if (filters.pageSize !== undefined && filters.pageSize !== 20) {
        params.set('pageSize', String(filters.pageSize))
    }

    if (filters.page !== undefined && filters.page !== 1) {
        params.set('page', String(filters.page))
    }

    return params.toString()
}

export function createCatalogPageHref(filters: SearchWrapsInput, page: number): string {
    const query = createCatalogQueryString({
        ...filters,
        page,
    })

    return query ? `${APP_ROUTES.catalog}?${query}` : APP_ROUTES.catalog
}

export function parseCatalogSearchParams(
    searchParams: SearchParamRecord
): CatalogSearchParamsResult {
    const candidate = {
        query: first(searchParams.query),
        maxPrice: toNumber(first(searchParams.maxPrice) ?? null),
        sortBy: first(searchParams.sortBy),
        sortOrder: first(searchParams.sortOrder),
        page: toNumber(first(searchParams.page) ?? null),
        pageSize: toNumber(first(searchParams.pageSize) ?? null),
        categoryId: first(searchParams.categoryId),
    }

    const parsed = searchWrapsSchema.safeParse(candidate)
    const normalized = parsed.success
        ? parsed.data
        : searchWrapsSchema.parse({
              query: candidate.query,
              page: DEFAULT_PAGE,
              pageSize: DEFAULT_PAGE_SIZE,
          })

    const filters: SearchWrapsInput = {
        ...normalized,
        sortBy: normalized.sortBy ?? 'createdAt',
        sortOrder: normalized.sortOrder ?? 'desc',
    }

    return {
        filters,
        hasActiveFilters: Boolean(
            filters.query ||
            filters.maxPrice !== undefined ||
            filters.categoryId ||
            filters.sortBy !== 'createdAt' ||
            filters.sortOrder !== 'desc' ||
            filters.pageSize !== DEFAULT_PAGE_SIZE
        ),
    }
}

export function parseVisualizerSearchParams(
    searchParams: SearchParamRecord
): VisualizerSearchParamsResult {
    const parsed = visualizerSearchParamsSchema.safeParse({
        wrapId: first(searchParams.wrapId),
    })

    return {
        requestedWrapId: parsed.success ? (parsed.data.wrapId ?? null) : null,
    }
}

```

## /prisma/migrations/20260305170120_init/migration.sql


```sql
-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantUserMembership" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TenantUserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wrap" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "installationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wrap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrapCategory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WrapCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrapCategoryMapping" (
    "wrapId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "WrapCategoryMapping_pkey" PRIMARY KEY ("wrapId","categoryId")
);

-- CreateTable
CREATE TABLE "WrapImage" (
    "id" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WrapImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacitySlots" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingReservation" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerPreview" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "wrapId" TEXT NOT NULL,
    "customerPhotoUrl" TEXT NOT NULL,
    "processedImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "cacheKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VisualizerPreview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_slug_idx" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_deletedAt_idx" ON "Tenant"("deletedAt");

-- CreateIndex
CREATE INDEX "TenantUserMembership_tenantId_idx" ON "TenantUserMembership"("tenantId");

-- CreateIndex
CREATE INDEX "TenantUserMembership_userId_idx" ON "TenantUserMembership"("userId");

-- CreateIndex
CREATE INDEX "TenantUserMembership_deletedAt_idx" ON "TenantUserMembership"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUserMembership_tenantId_userId_key" ON "TenantUserMembership"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Wrap_tenantId_idx" ON "Wrap"("tenantId");

-- CreateIndex
CREATE INDEX "Wrap_deletedAt_idx" ON "Wrap"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wrap_tenantId_id_key" ON "Wrap"("tenantId", "id");

-- CreateIndex
CREATE INDEX "WrapCategory_tenantId_idx" ON "WrapCategory"("tenantId");

-- CreateIndex
CREATE INDEX "WrapCategory_deletedAt_idx" ON "WrapCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WrapCategory_tenantId_slug_key" ON "WrapCategory"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "WrapImage_wrapId_idx" ON "WrapImage"("wrapId");

-- CreateIndex
CREATE INDEX "WrapImage_deletedAt_idx" ON "WrapImage"("deletedAt");

-- CreateIndex
CREATE INDEX "AvailabilityRule_tenantId_idx" ON "AvailabilityRule"("tenantId");

-- CreateIndex
CREATE INDEX "AvailabilityRule_dayOfWeek_idx" ON "AvailabilityRule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "AvailabilityRule_deletedAt_idx" ON "AvailabilityRule"("deletedAt");

-- CreateIndex
CREATE INDEX "Booking_tenantId_idx" ON "Booking"("tenantId");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_idx" ON "Booking"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tenantId_id_key" ON "Booking"("tenantId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "BookingReservation_bookingId_key" ON "BookingReservation"("bookingId");

-- CreateIndex
CREATE INDEX "BookingReservation_expiresAt_idx" ON "BookingReservation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VisualizerPreview_cacheKey_key" ON "VisualizerPreview"("cacheKey");

-- CreateIndex
CREATE INDEX "VisualizerPreview_tenantId_idx" ON "VisualizerPreview"("tenantId");

-- CreateIndex
CREATE INDEX "VisualizerPreview_status_idx" ON "VisualizerPreview"("status");

-- CreateIndex
CREATE INDEX "VisualizerPreview_expiresAt_idx" ON "VisualizerPreview"("expiresAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_deletedAt_idx" ON "VisualizerPreview"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_bookingId_key" ON "Invoice"("bookingId");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_idx" ON "Invoice"("deletedAt");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_invoiceId_idx" ON "InvoiceLineItem"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_stripePaymentIntentId_idx" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_deletedAt_idx" ON "Payment"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_deletedAt_idx" ON "AuditLog"("deletedAt");

-- AddForeignKey
ALTER TABLE "TenantUserMembership" ADD CONSTRAINT "TenantUserMembership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wrap" ADD CONSTRAINT "Wrap_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapCategory" ADD CONSTRAINT "WrapCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapCategoryMapping" ADD CONSTRAINT "WrapCategoryMapping_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapCategoryMapping" ADD CONSTRAINT "WrapCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WrapCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrapImage" ADD CONSTRAINT "WrapImage_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingReservation" ADD CONSTRAINT "BookingReservation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizerPreview" ADD CONSTRAINT "VisualizerPreview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizerPreview" ADD CONSTRAINT "VisualizerPreview_wrapId_fkey" FOREIGN KEY ("wrapId") REFERENCES "Wrap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLineItem" ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

## /prisma/migrations/20260305235900_add_user_and_clerk_webhook_event/migration.sql


```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClerkWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_type_idx" ON "ClerkWebhookEvent"("type");

```

## /prisma/migrations/20260306004909_add_stripe_webhook_event/migration.sql


```sql
-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_status_idx" ON "StripeWebhookEvent"("status");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_processedAt_idx" ON "StripeWebhookEvent"("processedAt");

```

## /prisma/migrations/20260306152117_add_clerk_webhook_event_tables/migration.sql


```sql
-- CreateTable
CREATE TABLE "ClerkSession" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkEmail" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "toEmail" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSms" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "toPhone" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSubscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "clerkUserId" TEXT,
    "status" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkSubscriptionItem" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkSubscriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClerkPaymentAttempt" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "status" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "lastEventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClerkPaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClerkSession_clerkUserId_idx" ON "ClerkSession"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSession_status_idx" ON "ClerkSession"("status");

-- CreateIndex
CREATE INDEX "ClerkSession_deletedAt_idx" ON "ClerkSession"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkEmail_clerkUserId_idx" ON "ClerkEmail"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkEmail_status_idx" ON "ClerkEmail"("status");

-- CreateIndex
CREATE INDEX "ClerkEmail_deletedAt_idx" ON "ClerkEmail"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSms_clerkUserId_idx" ON "ClerkSms"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSms_status_idx" ON "ClerkSms"("status");

-- CreateIndex
CREATE INDEX "ClerkSms_deletedAt_idx" ON "ClerkSms"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSubscription_tenantId_idx" ON "ClerkSubscription"("tenantId");

-- CreateIndex
CREATE INDEX "ClerkSubscription_clerkUserId_idx" ON "ClerkSubscription"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkSubscription_status_idx" ON "ClerkSubscription"("status");

-- CreateIndex
CREATE INDEX "ClerkSubscription_deletedAt_idx" ON "ClerkSubscription"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_subscriptionId_idx" ON "ClerkSubscriptionItem"("subscriptionId");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_status_idx" ON "ClerkSubscriptionItem"("status");

-- CreateIndex
CREATE INDEX "ClerkSubscriptionItem_deletedAt_idx" ON "ClerkSubscriptionItem"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_clerkUserId_idx" ON "ClerkPaymentAttempt"("clerkUserId");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_status_idx" ON "ClerkPaymentAttempt"("status");

-- CreateIndex
CREATE INDEX "ClerkPaymentAttempt_deletedAt_idx" ON "ClerkPaymentAttempt"("deletedAt");

-- CreateIndex
CREATE INDEX "ClerkWebhookEvent_processedAt_idx" ON "ClerkWebhookEvent"("processedAt");

-- AddForeignKey
ALTER TABLE "ClerkSubscription" ADD CONSTRAINT "ClerkSubscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClerkSubscriptionItem" ADD CONSTRAINT "ClerkSubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "ClerkSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

## /prisma/migrations/20260306194258_add_user_relation_to_membership/migration.sql


```sql
-- AddForeignKey
ALTER TABLE "TenantUserMembership" ADD CONSTRAINT "TenantUserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

## /prisma/migrations/20260307150000_add_clerk_webhook_status/migration.sql


```sql
ALTER TABLE "ClerkWebhookEvent"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'processed';

CREATE INDEX "ClerkWebhookEvent_status_idx" ON "ClerkWebhookEvent"("status");

```

## /prisma/migrations/20260307193000_harden_neon_prisma_integration/migration.sql


```sql
-- Normalize minor-unit money columns away from floating point.
ALTER TABLE "Wrap"
ALTER COLUMN "price" TYPE INTEGER USING ROUND("price")::integer;

ALTER TABLE "Booking"
ALTER COLUMN "totalPrice" TYPE INTEGER USING ROUND("totalPrice")::integer;

ALTER TABLE "Invoice"
ALTER COLUMN "totalAmount" TYPE INTEGER USING ROUND("totalAmount")::integer;

ALTER TABLE "InvoiceLineItem"
ALTER COLUMN "unitPrice" TYPE INTEGER USING ROUND("unitPrice")::integer;

ALTER TABLE "InvoiceLineItem"
ALTER COLUMN "totalPrice" TYPE INTEGER USING ROUND("totalPrice")::integer;

ALTER TABLE "Payment"
ALTER COLUMN "amount" TYPE INTEGER USING ROUND("amount")::integer;

ALTER TABLE "ClerkPaymentAttempt"
ALTER COLUMN "amount" TYPE INTEGER USING CASE
  WHEN "amount" IS NULL THEN NULL
  ELSE ROUND("amount")::integer
END;

-- Remove redundant or low-value indexes before replacing them with query-shape indexes.
DROP INDEX IF EXISTS "Tenant_slug_idx";

DROP INDEX IF EXISTS "TenantUserMembership_tenantId_idx";
DROP INDEX IF EXISTS "TenantUserMembership_userId_idx";
DROP INDEX IF EXISTS "TenantUserMembership_deletedAt_idx";

DROP INDEX IF EXISTS "Wrap_tenantId_idx";
DROP INDEX IF EXISTS "Wrap_deletedAt_idx";
DROP INDEX IF EXISTS "Wrap_tenantId_id_key";

DROP INDEX IF EXISTS "WrapCategory_tenantId_idx";
DROP INDEX IF EXISTS "WrapCategory_deletedAt_idx";

DROP INDEX IF EXISTS "WrapImage_wrapId_idx";
DROP INDEX IF EXISTS "WrapImage_deletedAt_idx";

DROP INDEX IF EXISTS "AvailabilityRule_tenantId_idx";
DROP INDEX IF EXISTS "AvailabilityRule_dayOfWeek_idx";
DROP INDEX IF EXISTS "AvailabilityRule_deletedAt_idx";

DROP INDEX IF EXISTS "Booking_tenantId_idx";
DROP INDEX IF EXISTS "Booking_customerId_idx";
DROP INDEX IF EXISTS "Booking_status_idx";
DROP INDEX IF EXISTS "Booking_deletedAt_idx";
DROP INDEX IF EXISTS "Booking_tenantId_id_key";

DROP INDEX IF EXISTS "VisualizerPreview_tenantId_idx";
DROP INDEX IF EXISTS "VisualizerPreview_status_idx";
DROP INDEX IF EXISTS "VisualizerPreview_expiresAt_idx";
DROP INDEX IF EXISTS "VisualizerPreview_deletedAt_idx";

DROP INDEX IF EXISTS "Invoice_tenantId_idx";
DROP INDEX IF EXISTS "Invoice_status_idx";
DROP INDEX IF EXISTS "Invoice_deletedAt_idx";

DROP INDEX IF EXISTS "Payment_invoiceId_idx";
DROP INDEX IF EXISTS "Payment_stripePaymentIntentId_idx";
DROP INDEX IF EXISTS "Payment_deletedAt_idx";

DROP INDEX IF EXISTS "AuditLog_tenantId_idx";
DROP INDEX IF EXISTS "AuditLog_userId_idx";
DROP INDEX IF EXISTS "AuditLog_timestamp_idx";

DROP INDEX IF EXISTS "ClerkWebhookEvent_status_idx";
DROP INDEX IF EXISTS "ClerkWebhookEvent_processedAt_idx";

DROP INDEX IF EXISTS "StripeWebhookEvent_status_idx";
DROP INDEX IF EXISTS "StripeWebhookEvent_processedAt_idx";

-- Enforce core data integrity in the database instead of only at the app boundary.
ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_dayOfWeek_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_dayOfWeek_check"
CHECK ("dayOfWeek" BETWEEN 0 AND 6);

ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_capacitySlots_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_capacitySlots_check"
CHECK ("capacitySlots" > 0);

ALTER TABLE "AvailabilityRule"
DROP CONSTRAINT IF EXISTS "AvailabilityRule_time_window_check";
ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_time_window_check"
CHECK ("startTime"::time < "endTime"::time);

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_time_window_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_time_window_check"
CHECK ("startTime" < "endTime");

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_status_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_status_check"
CHECK ("status" IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE "Invoice"
DROP CONSTRAINT IF EXISTS "Invoice_status_check";
ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_status_check"
CHECK ("status" IN ('draft', 'sent', 'paid', 'failed', 'refunded'));

ALTER TABLE "Payment"
DROP CONSTRAINT IF EXISTS "Payment_status_check";
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_status_check"
CHECK ("status" IN ('pending', 'succeeded', 'failed'));

ALTER TABLE "VisualizerPreview"
DROP CONSTRAINT IF EXISTS "VisualizerPreview_status_check";
ALTER TABLE "VisualizerPreview"
ADD CONSTRAINT "VisualizerPreview_status_check"
CHECK ("status" IN ('pending', 'processing', 'complete', 'failed'));

ALTER TABLE "ClerkWebhookEvent"
DROP CONSTRAINT IF EXISTS "ClerkWebhookEvent_status_check";
ALTER TABLE "ClerkWebhookEvent"
ADD CONSTRAINT "ClerkWebhookEvent_status_check"
CHECK ("status" IN ('processing', 'processed', 'failed'));

ALTER TABLE "StripeWebhookEvent"
DROP CONSTRAINT IF EXISTS "StripeWebhookEvent_status_check";
ALTER TABLE "StripeWebhookEvent"
ADD CONSTRAINT "StripeWebhookEvent_status_check"
CHECK ("status" IN ('processing', 'processed', 'failed'));

ALTER TABLE "Wrap"
DROP CONSTRAINT IF EXISTS "Wrap_price_non_negative_check";
ALTER TABLE "Wrap"
ADD CONSTRAINT "Wrap_price_non_negative_check"
CHECK ("price" >= 0);

ALTER TABLE "Booking"
DROP CONSTRAINT IF EXISTS "Booking_totalPrice_non_negative_check";
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_totalPrice_non_negative_check"
CHECK ("totalPrice" >= 0);

ALTER TABLE "Invoice"
DROP CONSTRAINT IF EXISTS "Invoice_totalAmount_non_negative_check";
ALTER TABLE "Invoice"
ADD CONSTRAINT "Invoice_totalAmount_non_negative_check"
CHECK ("totalAmount" >= 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_quantity_positive_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_quantity_positive_check"
CHECK ("quantity" > 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_unitPrice_non_negative_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_unitPrice_non_negative_check"
CHECK ("unitPrice" >= 0);

ALTER TABLE "InvoiceLineItem"
DROP CONSTRAINT IF EXISTS "InvoiceLineItem_totalPrice_non_negative_check";
ALTER TABLE "InvoiceLineItem"
ADD CONSTRAINT "InvoiceLineItem_totalPrice_non_negative_check"
CHECK ("totalPrice" >= 0);

ALTER TABLE "Payment"
DROP CONSTRAINT IF EXISTS "Payment_amount_non_negative_check";
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_amount_non_negative_check"
CHECK ("amount" >= 0);

ALTER TABLE "ClerkPaymentAttempt"
DROP CONSTRAINT IF EXISTS "ClerkPaymentAttempt_amount_non_negative_check";
ALTER TABLE "ClerkPaymentAttempt"
ADD CONSTRAINT "ClerkPaymentAttempt_amount_non_negative_check"
CHECK ("amount" IS NULL OR "amount" >= 0);

-- Add composite indexes aligned with tenant-scoped hot paths.
CREATE INDEX "TenantUserMembership_tenantId_deletedAt_role_idx"
ON "TenantUserMembership"("tenantId", "deletedAt", "role");

CREATE INDEX "TenantUserMembership_userId_deletedAt_createdAt_idx"
ON "TenantUserMembership"("userId", "deletedAt", "createdAt");

CREATE INDEX "Wrap_tenantId_deletedAt_createdAt_idx"
ON "Wrap"("tenantId", "deletedAt", "createdAt");

CREATE INDEX "WrapCategory_tenantId_deletedAt_createdAt_idx"
ON "WrapCategory"("tenantId", "deletedAt", "createdAt");

CREATE INDEX "WrapImage_wrapId_deletedAt_displayOrder_idx"
ON "WrapImage"("wrapId", "deletedAt", "displayOrder");

CREATE INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_window_idx"
ON "AvailabilityRule"("tenantId", "dayOfWeek", "deletedAt", "startTime", "endTime");

CREATE INDEX "Booking_tenantId_deletedAt_status_startTime_idx"
ON "Booking"("tenantId", "deletedAt", "status", "startTime");

CREATE INDEX "Booking_tenantId_customerId_deletedAt_status_idx"
ON "Booking"("tenantId", "customerId", "deletedAt", "status");

CREATE INDEX "Booking_tenantId_deletedAt_time_window_idx"
ON "Booking"("tenantId", "deletedAt", "startTime", "endTime");

CREATE INDEX "VisualizerPreview_tenant_wrap_deleted_expiry_created_idx"
ON "VisualizerPreview"("tenantId", "wrapId", "deletedAt", "expiresAt", "createdAt");

CREATE INDEX "VisualizerPreview_status_expiresAt_idx"
ON "VisualizerPreview"("status", "expiresAt");

CREATE INDEX "Invoice_tenantId_deletedAt_status_createdAt_idx"
ON "Invoice"("tenantId", "deletedAt", "status", "createdAt");

CREATE INDEX "Invoice_tenantId_bookingId_deletedAt_idx"
ON "Invoice"("tenantId", "bookingId", "deletedAt");

CREATE INDEX "Payment_invoiceId_deletedAt_createdAt_idx"
ON "Payment"("invoiceId", "deletedAt", "createdAt");

CREATE INDEX "AuditLog_tenantId_timestamp_idx"
ON "AuditLog"("tenantId", "timestamp");

CREATE INDEX "AuditLog_userId_timestamp_idx"
ON "AuditLog"("userId", "timestamp");

CREATE INDEX "ClerkWebhookEvent_status_processedAt_idx"
ON "ClerkWebhookEvent"("status", "processedAt");

CREATE INDEX "StripeWebhookEvent_status_processedAt_idx"
ON "StripeWebhookEvent"("status", "processedAt");

```

## /prisma/migrations/20260308105459_add_clerkwebhookevent_status/migration.sql


```sql
-- RenameIndex
ALTER INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_window_idx" RENAME TO "AvailabilityRule_tenantId_dayOfWeek_deletedAt_startTime_end_idx";

-- RenameIndex
ALTER INDEX "Booking_tenantId_deletedAt_time_window_idx" RENAME TO "Booking_tenantId_deletedAt_startTime_endTime_idx";

-- RenameIndex
ALTER INDEX "VisualizerPreview_tenant_wrap_deleted_expiry_created_idx" RENAME TO "VisualizerPreview_tenantId_wrapId_deletedAt_expiresAt_creat_idx";

```

## /prisma/migrations/20260310190000_single_store_authz_rebuild/migration.sql


```sql
-- Rebuild RBAC for single-store operation.
-- 1) Add persisted global role on users.
-- 2) Normalize tenant roles to owner|user.
-- 3) Enforce single active owner per tenant and single active platform admin globally.

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "globalRole" TEXT NOT NULL DEFAULT 'user';

ALTER TABLE "TenantUserMembership"
ALTER COLUMN "role" SET DEFAULT 'user';

UPDATE "TenantUserMembership"
SET "role" = CASE
  WHEN lower("role") IN ('owner', 'admin', 'staff') THEN 'owner'
  ELSE 'user'
END;

WITH ranked_owners AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "tenantId"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS owner_rank
  FROM "TenantUserMembership"
  WHERE "deletedAt" IS NULL
    AND "role" = 'owner'
)
UPDATE "TenantUserMembership" m
SET "role" = 'user'
FROM ranked_owners r
WHERE m."id" = r."id"
  AND r.owner_rank > 1;


CREATE UNIQUE INDEX IF NOT EXISTS "User_single_platform_admin_active_key"
ON "User" ("globalRole")
WHERE "deletedAt" IS NULL
  AND "globalRole" = 'admin';

```

## /prisma/migrations/20260311034334_single_store_authorization/migration.sql


```sql
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "AvailabilityRule" DROP CONSTRAINT "AvailabilityRule_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "ClerkSubscription" DROP CONSTRAINT "ClerkSubscription_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUserMembership" DROP CONSTRAINT "TenantUserMembership_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUserMembership" DROP CONSTRAINT "TenantUserMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "VisualizerPreview" DROP CONSTRAINT "VisualizerPreview_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Wrap" DROP CONSTRAINT "Wrap_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "WrapCategory" DROP CONSTRAINT "WrapCategory_tenantId_fkey";

-- DropIndex
DROP INDEX "AuditLog_tenantId_timestamp_idx";

-- DropIndex
DROP INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_startTime_end_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_customerId_deletedAt_status_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_deletedAt_startTime_endTime_idx";

-- DropIndex
DROP INDEX "Booking_tenantId_deletedAt_status_startTime_idx";

-- DropIndex
DROP INDEX "ClerkSubscription_tenantId_idx";

-- DropIndex
DROP INDEX "Invoice_tenantId_bookingId_deletedAt_idx";

-- DropIndex
DROP INDEX "Invoice_tenantId_deletedAt_status_createdAt_idx";

-- DropIndex
DROP INDEX "VisualizerPreview_tenantId_wrapId_deletedAt_expiresAt_creat_idx";

-- DropIndex
DROP INDEX "Wrap_tenantId_deletedAt_createdAt_idx";

-- DropIndex
DROP INDEX "WrapCategory_tenantId_deletedAt_createdAt_idx";

-- DropIndex
DROP INDEX "WrapCategory_tenantId_slug_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "ClerkSubscription" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "globalRole" SET DEFAULT 'customer';

-- AlterTable
ALTER TABLE "VisualizerPreview" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Wrap" DROP COLUMN "tenantId",
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WrapCategory" DROP COLUMN "tenantId";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "TenantUserMembership";

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL DEFAULT 'email',
    "appointmentReminders" BOOLEAN NOT NULL DEFAULT true,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'America/Denver',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WebsiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSettings_clerkUserId_key" ON "WebsiteSettings"("clerkUserId");

-- CreateIndex
CREATE INDEX "WebsiteSettings_deletedAt_idx" ON "WebsiteSettings"("deletedAt");

-- CreateIndex
CREATE INDEX "WebsiteSettings_clerkUserId_deletedAt_idx" ON "WebsiteSettings"("clerkUserId", "deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AvailabilityRule_dayOfWeek_deletedAt_startTime_endTime_idx" ON "AvailabilityRule"("dayOfWeek", "deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_status_startTime_idx" ON "Booking"("deletedAt", "status", "startTime");

-- CreateIndex
CREATE INDEX "Booking_customerId_deletedAt_status_idx" ON "Booking"("customerId", "deletedAt", "status");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_startTime_endTime_idx" ON "Booking"("deletedAt", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_status_createdAt_idx" ON "Invoice"("deletedAt", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_bookingId_deletedAt_idx" ON "Invoice"("bookingId", "deletedAt");

-- CreateIndex
CREATE INDEX "VisualizerPreview_wrapId_deletedAt_expiresAt_createdAt_idx" ON "VisualizerPreview"("wrapId", "deletedAt", "expiresAt", "createdAt");

-- CreateIndex
CREATE INDEX "Wrap_deletedAt_createdAt_idx" ON "Wrap"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Wrap_isHidden_deletedAt_createdAt_idx" ON "Wrap"("isHidden", "deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WrapCategory_slug_key" ON "WrapCategory"("slug");

-- CreateIndex
CREATE INDEX "WrapCategory_deletedAt_createdAt_idx" ON "WrapCategory"("deletedAt", "createdAt");


```

## /prisma/migrations/20260311063716_new/migration.sql


```sql
-- DropIndex

-- DropIndex
DROP INDEX "User_single_platform_admin_active_key";

-- CreateIndex
CREATE INDEX "User_globalRole_deletedAt_idx" ON "User"("globalRole", "deletedAt");

```

## /prisma/migrations/20260313120000_catalog_visualizer_asset_security/migration.sql


```sql
-- Add role-aware wrap image metadata
ALTER TABLE "WrapImage"
  ADD COLUMN IF NOT EXISTS "kind" TEXT NOT NULL DEFAULT 'gallery',
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "contentHash" TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'WrapImage_kind_check'
  ) THEN
    ALTER TABLE "WrapImage"
      ADD CONSTRAINT "WrapImage_kind_check"
      CHECK ("kind" IN ('hero', 'visualizer_texture', 'visualizer_mask_hint', 'gallery')) NOT VALID;
  END IF;
END $$;

ALTER TABLE "WrapImage" VALIDATE CONSTRAINT "WrapImage_kind_check";

CREATE INDEX IF NOT EXISTS "WrapImage_wrapId_kind_isActive_deletedAt_idx"
  ON "WrapImage"("wrapId", "kind", "isActive", "deletedAt");

-- Add ownership and source-asset traceability to visualizer previews
ALTER TABLE "VisualizerPreview"
  ADD COLUMN IF NOT EXISTS "ownerClerkUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceWrapImageId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceWrapImageVersion" INTEGER;

UPDATE "VisualizerPreview"
SET "ownerClerkUserId" = COALESCE("ownerClerkUserId", 'legacy')
WHERE "ownerClerkUserId" IS NULL;

ALTER TABLE "VisualizerPreview"
  ALTER COLUMN "ownerClerkUserId" SET DEFAULT 'legacy';

ALTER TABLE "VisualizerPreview"
  ALTER COLUMN "ownerClerkUserId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "VisualizerPreview_ownerClerkUserId_deletedAt_expiresAt_idx"
  ON "VisualizerPreview"("ownerClerkUserId", "deletedAt", "expiresAt");

-- Allow reusing category slugs after soft-delete while preserving active uniqueness
DROP INDEX IF EXISTS "WrapCategory_slug_key";

CREATE UNIQUE INDEX IF NOT EXISTS "WrapCategory_slug_active_key"
  ON "WrapCategory"("slug")
  WHERE "deletedAt" IS NULL;


```

## /prisma/migrations/20260318113000_add_wrap_ai_prompt_fields/migration.sql


```sql
ALTER TABLE "Wrap"
ADD COLUMN "aiPromptTemplate" TEXT,
ADD COLUMN "aiNegativePrompt" TEXT;

```

## /prisma/migrations/20260323062347_new/migration.sql


```sql
-- AlterTable
ALTER TABLE "ClerkWebhookEvent" ADD COLUMN     "error" TEXT,
ADD COLUMN     "lastAttemptedAt" TIMESTAMP(3),
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StripeWebhookEvent" ADD COLUMN     "error" TEXT,
ADD COLUMN     "lastAttemptedAt" TIMESTAMP(3),
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "WrapCategory_slug_idx" ON "WrapCategory"("slug");

```

## /prisma/migrations/migration_lock.toml


```
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"

```

## /prisma/schema.prisma


```prisma
// This is your Prisma schema file for CtrlPlus
// Learn more at https://pris.ly/d/prisma-schema

// Prisma 7 Configuration for Neon Serverless Postgres
//
// Connection Strategy:
// - DATABASE_URL (pooled with -pooler suffix): Used by PrismaClient via Neon adapter in lib/db/prisma.ts
// - DATABASE_URL_UNPOOLED (direct): Used for migrations via prisma.config.ts
//
// Connection strings are passed to PrismaClient constructor, not in datasource block.
// See lib/db/prisma.ts for adapter configuration.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// ============================================================================
// USER MODEL
// ============================================================================

/// Synced from Clerk – source of truth is Clerk; this is a local cache
model User {
  id          String    @id @default(cuid())
  clerkUserId String    @unique
  email       String    @unique
  globalRole  String    @default("customer") // "customer" | "owner" | "admin"
  firstName   String?
  lastName    String?
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  @@index([deletedAt])
  @@index([globalRole, deletedAt])
}

/// Idempotency table – prevents duplicate processing of Clerk webhook events
model ClerkWebhookEvent {
  id              String    @id // Svix event ID
  type            String
  status          String    @default("processed") // "processing" | "processed" | "failed"
  processedAt     DateTime  @default(now()) // used for retention/cleanup
  error           String?
  payload         Json?
  retryCount      Int       @default(0)
  lastAttemptedAt DateTime?

  @@index([type])
  @@index([status, processedAt])
}

// ============================================================================
// CLERK BILLING & ENGAGEMENT EVENT CACHE MODELS
// ============================================================================

/// Clerk session lifecycle cache from webhooks
model ClerkSession {
  id            String    @id // Clerk session ID
  clerkUserId   String
  status        String // "created" | "pending" | "ended" | "removed" | "revoked"
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  endedAt       DateTime?
  removedAt     DateTime?
  revokedAt     DateTime?
  deletedAt     DateTime?

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
}

/// Clerk email event cache from webhooks
model ClerkEmail {
  id            String    @id // Clerk email ID
  clerkUserId   String?
  status        String?
  toEmail       String?
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
}

/// Clerk SMS event cache from webhooks
model ClerkSms {
  id            String    @id // Clerk SMS ID
  clerkUserId   String?
  status        String?
  toPhone       String?
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
}

/// Clerk subscription cache from webhooks
model ClerkSubscription {
  id            String    @id // Clerk subscription ID
  clerkUserId   String?
  status        String?
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  items ClerkSubscriptionItem[]

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
}

/// Clerk subscription item cache from webhooks
model ClerkSubscriptionItem {
  id             String    @id // Clerk subscription item ID
  subscriptionId String
  status         String?
  lastEventType  String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  subscription ClerkSubscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
  @@index([status])
  @@index([deletedAt])
}

/// Clerk payment attempt cache from webhooks
model ClerkPaymentAttempt {
  id            String    @id // Clerk payment attempt ID
  clerkUserId   String?
  status        String?
  amount        Int?
  currency      String?
  lastEventType String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([clerkUserId])
  @@index([status])
  @@index([deletedAt])
}

// ============================================================================
// CATALOG MODELS
// ============================================================================

/// Represents a wrap design
model Wrap {
  id                  String    @id @default(cuid())
  name                String
  description         String?
  price               Int // in cents
  installationMinutes Int?
  aiPromptTemplate    String?
  aiNegativePrompt    String?
  isHidden            Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  deletedAt           DateTime?

  images           WrapImage[]
  categoryMappings WrapCategoryMapping[]
  bookings         Booking[]
  previews         VisualizerPreview[]

  @@index([deletedAt, createdAt])
  @@index([isHidden, deletedAt, createdAt])
}

/// Categories for organizing wraps
model WrapCategory {
  id        String    @id @default(cuid())
  name      String
  slug      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  wraps WrapCategoryMapping[]

  @@index([deletedAt, createdAt])
  @@index([slug])
}

/// Junction table: many wraps to many categories
model WrapCategoryMapping {
  wrapId     String
  categoryId String

  wrap     Wrap         @relation(fields: [wrapId], references: [id], onDelete: Cascade)
  category WrapCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([wrapId, categoryId])
}

/// Images for wrap designs
model WrapImage {
  id           String    @id @default(cuid())
  wrapId       String
  url          String
  kind         String    @default("gallery")
  isActive     Boolean   @default(true)
  version      Int       @default(1)
  contentHash  String    @default("")
  displayOrder Int       @default(0)
  createdAt    DateTime  @default(now())
  deletedAt    DateTime?

  wrap Wrap @relation(fields: [wrapId], references: [id], onDelete: Cascade)

  @@index([wrapId, deletedAt, displayOrder])
  @@index([wrapId, kind, isActive, deletedAt])
}

// ============================================================================
// SCHEDULING MODELS
// ============================================================================

/// Availability rules for time slots
model AvailabilityRule {
  id            String    @id @default(cuid())
  dayOfWeek     Int // 0=Sunday, 6=Saturday
  startTime     String // HH:MM format
  endTime       String // HH:MM format
  capacitySlots Int // How many concurrent bookings
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([dayOfWeek, deletedAt, startTime, endTime])
}

/// Customer bookings
model Booking {
  id         String    @id @default(cuid())
  customerId String // Clerk user ID of customer
  wrapId     String
  startTime  DateTime
  endTime    DateTime
  status     String    @default("pending") // "pending" | "confirmed" | "completed" | "cancelled"
  totalPrice Int // in cents
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  deletedAt  DateTime?

  wrap        Wrap                @relation(fields: [wrapId], references: [id], onDelete: Cascade)
  reservation BookingReservation?
  invoice     Invoice?

  @@index([deletedAt, status, startTime])
  @@index([customerId, deletedAt, status])
  @@index([deletedAt, startTime, endTime])
}

/// 15-minute reservation hold on booking slots
model BookingReservation {
  id         String   @id @default(cuid())
  bookingId  String   @unique
  expiresAt  DateTime
  reservedAt DateTime @default(now())
  createdAt  DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([expiresAt])
}

// ============================================================================
// VISUALIZER MODELS
// ============================================================================

/// Preview generation results (cached for 24h)
model VisualizerPreview {
  id                     String    @id @default(cuid())
  wrapId                 String
  ownerClerkUserId       String    @default("legacy")
  customerPhotoUrl       String
  processedImageUrl      String? // Filled after processing
  status                 String    @default("pending") // "pending" | "processing" | "complete" | "failed"
  cacheKey               String    @unique // Deterministic hash for caching
  sourceWrapImageId      String?
  sourceWrapImageVersion Int?
  expiresAt              DateTime
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt
  deletedAt              DateTime?

  wrap Wrap @relation(fields: [wrapId], references: [id], onDelete: Cascade)

  @@index([wrapId, deletedAt, expiresAt, createdAt])
  @@index([status, expiresAt])
  @@index([ownerClerkUserId, deletedAt, expiresAt])
}

// ============================================================================
// BILLING MODELS
// ============================================================================

/// Invoices for bookings
model Invoice {
  id          String    @id @default(cuid())
  bookingId   String    @unique
  status      String    @default("draft") // "draft" | "sent" | "paid" | "failed" | "refunded"
  totalAmount Int // in cents
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  booking   Booking           @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  lineItems InvoiceLineItem[]
  payments  Payment[]

  @@index([deletedAt, status, createdAt])
  @@index([bookingId, deletedAt])
}

/// Line items for invoices
model InvoiceLineItem {
  id          String @id @default(cuid())
  invoiceId   String
  description String
  quantity    Int
  unitPrice   Int // in cents
  totalPrice  Int // in cents

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

/// Payment records (Stripe integration)
model Payment {
  id                    String    @id @default(cuid())
  invoiceId             String
  stripePaymentIntentId String    @unique
  status                String    @default("pending") // "pending" | "succeeded" | "failed"
  amount                Int // in cents
  createdAt             DateTime  @default(now())
  deletedAt             DateTime?

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId, deletedAt, createdAt])
}

// ============================================================================
// WEBHOOK EVENT TRACKING (Idempotency)
// ============================================================================

/// Tracks processed Stripe webhook events (idempotency guard)
model StripeWebhookEvent {
  id              String    @id // Stripe event ID (e.g. "evt_xxx")
  type            String // e.g. "checkout.session.completed"
  status          String    @default("processed") // "processing" | "processed" | "failed"
  processedAt     DateTime  @default(now())
  error           String?
  payload         Json?
  retryCount      Int       @default(0)
  lastAttemptedAt DateTime?

  @@index([type])
  @@index([status, processedAt])
}

// ============================================================================
// WEBSITE SETTINGS
// ============================================================================

model WebsiteSettings {
  id                   String    @id @default(cuid())
  clerkUserId          String    @unique
  preferredContact     String    @default("email") // "email" | "sms"
  appointmentReminders Boolean   @default(true)
  marketingOptIn       Boolean   @default(false)
  timezone             String    @default("America/Denver")
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  deletedAt            DateTime?

  @@index([deletedAt])
  @@index([clerkUserId, deletedAt])
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/// Audit trail for security and compliance
model AuditLog {
  id           String    @id @default(cuid())
  userId       String // Clerk user ID
  action       String // e.g., "CREATE_WRAP", "CANCEL_BOOKING"
  resourceType String // e.g., "Wrap", "Booking", "Invoice"
  resourceId   String
  details      String? // JSON details
  timestamp    DateTime  @default(now())
  deletedAt    DateTime?

  @@index([timestamp])
  @@index([userId, timestamp])
  @@index([action])
  @@index([deletedAt])
}

```

## /schemas/admin.schemas.ts


```ts
import { z } from 'zod'

export const createInvoiceSchema = z.object({
    tenantId: z.string().min(1),
    bookingId: z.string().min(1),
    customerId: z.string().optional(),
    amountCents: z.number().int().positive(),
    currency: z.string().optional(),
    description: z.string().optional(),
})

export const confirmAppointmentSchema = z.object({
    tenantId: z.string().min(1),
    bookingId: z.string().min(1),
    status: z.enum(['confirmed', 'cancelled', 'rescheduled']),
    note: z.string().optional(),
})

```

## /schemas/api.schemas.ts


```ts
import { z } from 'zod'

import { identifierSchema } from '@/schemas/common.schemas'

export const apiIdParamSchema = z.object({
    id: identifierSchema,
})

```

## /schemas/auth.schemas.ts


```ts
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(1, 'Enter your password.').max(128, 'Password is too long.'),
})

export const signupSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(128, 'Password is too long.'),
})

export const verificationCodeSchema = z
    .string()
    .trim()
    .min(4, 'Enter the verification code.')
    .max(12, 'Verification code is too long.')

export const verificationSchema = z.object({
    verificationCode: verificationCodeSchema,
})

```

## /schemas/billing.schemas.ts


```ts
import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const invoiceListParamsSchema = paginationParamsSchema.extend({
    status: z.enum(['draft', 'sent', 'paid', 'failed', 'refunded']).optional(),
})

export const ensureInvoiceForBookingSchema = z.object({
    bookingId: z.string().min(1),
})

export const createCheckoutSessionSchema = z.object({
    invoiceId: z.string().min(1),
})

```

## /schemas/catalog.schemas.ts


```ts
import { z } from 'zod'

import { wrapImageKindValues, WrapImageKind } from '@/lib/constants/statuses'
import type { CatalogAssetReadinessDTO } from '@/types/catalog.types'

export const createWrapCategorySchema = z.object({
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, or dashes'),
})

export const updateWrapCategorySchema = createWrapCategorySchema.partial()

export const setWrapCategoryMappingsSchema = z.object({
    wrapId: z.string().min(1),
    categoryIds: z.array(z.string().min(1)).max(50),
})

export const wrapImageUploadSchema = z.object({
    wrapId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).default(WrapImageKind.GALLERY),
    isActive: z.boolean().default(true),
    // Accept a server-side file key/reference (uploads handled by upload layer), not a browser File
    fileKey: z.string().min(1),
})

export const updateWrapImageMetadataSchema = z.object({
    wrapId: z.string().min(1),
    imageId: z.string().min(1),
    kind: z.enum(wrapImageKindValues).optional(),
    isActive: z.boolean().optional(),
})

export const priceInCentsSchema = z.coerce
    .number()
    .int('Price must be an integer number of cents')
    .positive('Price must be positive')
    .max(10_000_000_00, 'Price exceeds supported maximum')

export const searchWrapsSchema = z.object({
    query: z.string().max(200).optional(),
    maxPrice: priceInCentsSchema.optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.string().min(1).optional(),
})

export const wrapFilterFormSchema = z.object({
    query: z.string().trim().max(200, 'Search must be 200 characters or fewer.'),
    categoryId: z.string().trim().max(64).default(''),
    maxPrice: z
        .string()
        .trim()
        .refine((value) => value === '' || /^\d+$/.test(value), 'Use whole cents only.')
        .refine(
            (value) => value === '' || Number(value) <= 1_000_000_000,
            'Max price is too large.'
        ),
    sortBy: z.enum(['createdAt', 'name', 'price']),
    sortOrder: z.enum(['desc', 'asc']),
    pageSize: z.enum(['12', '20', '32']),
})

export const createWrapSchema = z.object({
    name: z.string().min(1, 'Name is required').max(120),
    description: z.string().max(500).optional(),
    price: priceInCentsSchema,
    installationMinutes: z.coerce
        .number()
        .int()
        .positive('Installation minutes must be a positive integer')
        .optional(),
    aiPromptTemplate: z.string().max(2_000).optional(),
    aiNegativePrompt: z.string().max(1_000).optional(),
})

export const updateWrapSchema = createWrapSchema.partial().extend({
    isHidden: z.boolean().optional(),
})

```

## /schemas/common.schemas.ts


```ts
import { z } from 'zod'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants/app'

export const identifierSchema = z.string().trim().min(1)

export const paginationParamsSchema = z.object({
    page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
    pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
})

```

## /schemas/platform.schemas.ts


```ts
import { z } from 'zod'

export const resetWebhookLocksSchema = z.object({
    source: z.enum(['clerk', 'stripe']),
    eventIds: z.array(z.string().min(1)).min(1).max(25),
})

```

## /schemas/scheduling.schemas.ts


```ts
import { z } from 'zod'

import { paginationParamsSchema } from '@/schemas/common.schemas'

export const bookingListParamsSchema = paginationParamsSchema.extend({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    // Coerce query params into dates for server-side parsing
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

export const availabilityListParamsSchema = paginationParamsSchema.extend({
    dayOfWeek: z.number().int().min(0).max(6).optional(),
})

export const reserveSlotSchema = z
    .object({
        wrapId: z.string().min(1, 'Wrap is required'),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

export const updateBookingSchema = z
    .object({
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: 'End time must be after start time',
        path: ['endTime'],
    })

export const bookingFormSchema = z
    .object({
        // coerce client-provided date strings to Date on the server-side
        date: z.coerce.date(),
        windowId: z.string().min(1, 'Select a time slot.'),
        wrapId: z.string().min(1, 'Select a wrap service.'),
    })
    .refine((values) => values.windowId.length > 0, {
        message: 'Select a time slot.',
        path: ['windowId'],
    })

```

## /schemas/settings.schemas.ts


```ts
import { z } from 'zod'

function isValidIanaTimezone(value: string): boolean {
    try {
        Intl.DateTimeFormat('en-US', { timeZone: value })
        return true
    } catch {
        return false
    }
}

export const websiteSettingsSchema = z.object({
    preferredContact: z.enum(['email', 'sms']).default('email'),
    appointmentReminders: z.boolean().default(true),
    marketingOptIn: z.boolean().default(false),
    timezone: z
        .string()
        .trim()
        .min(1, 'Timezone is required.')
        .max(100, 'Timezone must be 100 characters or fewer.')
        .refine(isValidIanaTimezone, 'Use a valid IANA timezone identifier.'),
})

```

## /schemas/visualizer.schemas.ts


```ts
import { z } from 'zod'

export const createVisualizerPreviewSchema = z.object({
    wrapId: z.string().min(1, 'Wrap ID is required'),
    // Accept a server-side file key/reference (uploads handled in upload pipeline), not a browser File
    fileKey: z.string().min(1, 'File key is required'),
})

export const regenerateVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const processVisualizerPreviewSchema = z.object({
    previewId: z.string().min(1, 'Preview ID is required'),
})

export const uploadPhotoSchema = createVisualizerPreviewSchema
export const generatePreviewSchema = processVisualizerPreviewSchema

export const visualizerSearchParamsSchema = z.object({
    wrapId: z.string().min(1).optional(),
})

```

## /types/admin.types.ts


```ts
export interface CreateInvoiceInput {
    tenantId: string
    bookingId: string
    customerId?: string
    amountCents: number
    currency?: string
    description?: string
}

export interface ConfirmAppointmentInput {
    tenantId: string
    bookingId: string
    status: 'confirmed' | 'cancelled' | 'rescheduled'
    note?: string
}

```

## /types/api.types.ts


```ts
export interface ApiSuccessResponse<TData> {
    ok: true
    data: TData
}

export interface ApiErrorResponse {
    ok: false
    error: string
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse

export interface ClerkWebhookEvent {
    data: unknown
    object: string
    type: string
}

```

## /types/auth.types.ts


```ts
import type { ComponentProps } from 'react'

import { CAPABILITY_VALUES, GLOBAL_ROLE_VALUES } from '@/lib/constants/permissions'

export type GlobalRole = (typeof GLOBAL_ROLE_VALUES)[number]

export type Capability = (typeof CAPABILITY_VALUES)[number]

export interface AuthzContext {
    userId: string | null
    role: GlobalRole
    isAuthenticated: boolean
    isOwner: boolean
    isPlatformAdmin: boolean
}

export interface SessionContext {
    userId: string | null
    isAuthenticated: boolean
    authz: AuthzContext
    role: AuthzContext['role']
    isOwner: boolean
    isPlatformAdmin: boolean
}

export interface SessionUser {
    id: string
    clerkUserId: string
    email: string
}

export interface Session {
    user: SessionUser | null
    isAuthenticated: boolean
    userId: string
}

export interface AuthRedirectSearchParams {
    redirect_url?: string
}

export interface LoginPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

export interface SignupPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

export interface LoginFormValues {
    email: string
    password: string
    verificationCode: string
}

export interface SignupFormValues {
    email: string
    password: string
    verificationCode: string
}

export interface LoginFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}

export interface SignupFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}

```

## /types/billing.types.ts


```ts
import type { InvoiceStatus, PaymentStatus } from '@/lib/constants/statuses'
import type { Timestamp } from './common.types'

export interface InvoiceLineItemDTO {
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

export interface InvoiceDTO {
    id: string
    bookingId: string
    status: InvoiceStatus
    totalAmount: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface InvoiceDetailDTO extends InvoiceDTO {
    lineItems: InvoiceLineItemDTO[]
    payments: PaymentDTO[]
}

export interface PaymentDTO {
    id: string
    invoiceId: string
    stripePaymentIntentId: string
    status: PaymentStatus
    amount: number
    createdAt: Timestamp
}

export interface InvoiceListParams {
    page: number
    pageSize: number
    status?: InvoiceStatus
}

export interface InvoiceListResult {
    invoices: InvoiceDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CheckoutSessionDTO {
    sessionId: string
    url: string
    invoiceId: string
}

export interface ConfirmPaymentResult {
    invoiceId: string
    paymentId: string
    status: 'pending' | 'succeeded' | 'failed'
}

export interface EnsureInvoiceForBookingInput {
    bookingId: string
}

export interface EnsureInvoiceResult {
    invoiceId: string
    created: boolean
}

export interface CreateCheckoutSessionInput {
    invoiceId: string
}

```

## /types/catalog.client.types.ts


```ts
// Client-only types for the catalog domain
// These types may reference DOM/browser primitives such as File and must live
// in a client-only types file per the canonical placement rules.

export interface WrapImageUploadInputClient {
    wrapId: string
    kind: string
    isActive: boolean
    file: File
}

export interface CatalogClientUploadResult {
    id: string
    url: string
}

```

## /types/catalog.types.ts


```ts
import type { PublishRequiredWrapImageKind, WrapImageKind } from '@/lib/constants/statuses'
import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import { WRAP_SORT_BY_VALUES } from '@/lib/constants/app'

export interface WrapImageDTO {
    id: string
    url: string
    kind: WrapImageKind
    isActive: boolean
    version: number
    contentHash: string
    displayOrder: number
}

export interface CatalogAssetImageDTO extends WrapImageDTO {
    thumbnailUrl: string
    cardUrl: string
    detailUrl: string
}

export interface WrapCategoryDTO {
    id: string
    name: string
    slug: string
}

export interface CatalogAssetReadinessIssue {
    code:
        | 'missing_name'
        | 'invalid_price'
        | 'missing_display_asset'
        | 'missing_hero'
        | 'missing_visualizer_texture'
        | 'multiple_active_hero'
        | 'multiple_active_visualizer_texture'
    message: string
    blocking: boolean
}

export interface CatalogAssetReadinessDTO {
    canPublish: boolean
    isVisualizerReady: boolean
    missingRequiredAssetRoles: PublishRequiredWrapImageKind[]
    requiredAssetRoles: PublishRequiredWrapImageKind[]
    activeAssetKinds: WrapImageKind[]
    hasDisplayAsset: boolean
    activeHeroCount: number
    activeGalleryCount: number
    activeVisualizerTextureCount: number
    activeVisualizerMaskHintCount: number
    issues: CatalogAssetReadinessIssue[]
}

export interface WrapDTO {
    id: string
    name: string
    description: string | null
    price: number
    isHidden: boolean
    installationMinutes: number | null
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
    images: WrapImageDTO[]
    categories: WrapCategoryDTO[]
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface WrapCatalogCardDTO {
    id: string
    name: string
    description: string | null
    price: number
    isHidden: boolean
    installationMinutes: number | null
    categories: WrapCategoryDTO[]
    heroImage: CatalogAssetImageDTO | null
    displayImage: CatalogAssetImageDTO | null
    previewHref: string
    readiness: CatalogAssetReadinessDTO
}

export interface WrapDetailViewDTO extends WrapDTO {
    heroImage: CatalogAssetImageDTO | null
    displayImage: CatalogAssetImageDTO | null
    displayImages: CatalogAssetImageDTO[]
    galleryImages: CatalogAssetImageDTO[]
    visualizerTextureImage: CatalogAssetImageDTO | null
    visualizerMaskHintImage: CatalogAssetImageDTO | null
    readiness: CatalogAssetReadinessDTO
}

export interface WrapManagerRowDTO extends WrapDetailViewDTO {
    imageCount: number
    activeImageCount: number
}

export interface VisualizerWrapSelectionDTO {
    id: string
    name: string
    description: string | null
    price: number
    installationMinutes: number | null
    categories: WrapCategoryDTO[]
    heroImage: CatalogAssetImageDTO | null
    visualizerTextureImage: CatalogAssetImageDTO
    aiPromptTemplate: string | null
    aiNegativePrompt: string | null
    readiness: CatalogAssetReadinessDTO
}

export type CatalogBrowseCardDTO = WrapCatalogCardDTO
export type CatalogDetailDTO = WrapDetailViewDTO
export type CatalogManagerItemDTO = WrapManagerRowDTO

export interface WrapListDTO {
    wraps: WrapDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CatalogBrowseResultDTO {
    wraps: WrapCatalogCardDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CatalogManagerResultDTO {
    wraps: WrapManagerRowDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface CreateWrapInput {
    name: string
    description?: string
    price: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
}

export interface UpdateWrapInput {
    name?: string
    description?: string
    price?: number
    installationMinutes?: number
    aiPromptTemplate?: string
    aiNegativePrompt?: string
    isHidden?: boolean
}

export interface CreateWrapCategoryInput {
    name: string
    slug: string
}

export interface UpdateWrapCategoryInput {
    name?: string
    slug?: string
}

export interface SetWrapCategoryMappingsInput {
    wrapId: string
    categoryIds: string[]
}

export interface WrapImageUploadInput {
    wrapId: string
    kind: WrapImageKind
    isActive: boolean
    // client may pass a File when calling server actions; keep optional to
    // preserve compatibility. Prefer using `types/catalog.client.types.ts` on
    // the client and converting uploads to FormData/streams for server-side
    // processing when possible.
    file?: File
}

export interface UpdateWrapImageMetadataInput {
    wrapId: string
    imageId: string
    kind?: WrapImageKind
    isActive?: boolean
}

export type WrapSortBy = (typeof WRAP_SORT_BY_VALUES)[keyof typeof WRAP_SORT_BY_VALUES]

export interface SearchWrapsInput {
    query?: string
    maxPrice?: number
    sortBy?: WrapSortBy
    sortOrder?: 'asc' | 'desc'
    page: number
    pageSize: number
    categoryId?: string
}

export interface WrapFilterFormValues {
    query: string
    categoryId: string
    maxPrice: string
    sortBy: 'createdAt' | 'name' | 'price'
    sortOrder: 'desc' | 'asc'
    pageSize: '12' | '20' | '32'
}

export interface CatalogSearchParamsResult {
    filters: SearchWrapsInput
    hasActiveFilters: boolean
}

export interface WrapFilterProps {
    categories?: Array<Pick<WrapCategoryDTO, 'id' | 'name'>>
}

export interface CatalogPageSearchParams {
    searchParams: Promise<SearchParamRecord>
}

export interface WrapDetailPageParams {
    params: Promise<{ id: string }>
}

export interface CatalogBrowsePageFeatureProps {
    filters: SearchWrapsInput
    canManageCatalog: boolean
}

export interface CatalogDetailPageFeatureProps {
    wrapId: string
    canManageCatalog: boolean
}

export interface CatalogManagerPageFeatureProps {
    filters: SearchWrapsInput
}

export interface CatalogManagerProps {
    wraps: CatalogManagerItemDTO[]
    categories: WrapCategoryDTO[]
}

```

## /types/common.types.ts


```ts
export type SearchParamValue = string | string[] | undefined

export type SearchParamRecord = Record<string, SearchParamValue>

export type Timestamp = string

export interface PaginatedParams {
    page: number
    pageSize: number
}

export interface PaginatedResult<TItem> extends PaginatedParams {
    items: TItem[]
    total: number
    totalPages: number
}

```

## /types/platform.types.ts


```ts
export interface WebhookStatusCountsDTO {
    processed: number
    failed: number
    processing: number
}

export type WebhookSource = 'clerk' | 'stripe'

import type { Timestamp } from './common.types'

export interface PlatformStatusOverviewDTO {
    generatedAt: Timestamp
    databaseVersion: string
    activeUsers: number
    activeBookings: number
    activeInvoices: number
    activeWraps: number
}

export interface WebhookFailureDTO {
    id: string
    source: WebhookSource
    type: string
    status: string
    processedAt: Timestamp
    error: string | null
    canReplay: boolean
    replayUnavailableReason: string | null
}

export interface WebhookProviderOverviewDTO extends WebhookStatusCountsDTO {
    staleProcessing: number
    recentFailures: WebhookFailureDTO[]
    replayableRecentFailures: number
    nonReplayableRecentFailures: number
}

export interface WebhookOperationsOverviewDTO {
    generatedAt: Timestamp
    staleThresholdMinutes: number
    clerk: WebhookProviderOverviewDTO
    stripe: WebhookProviderOverviewDTO
}

export interface WebhookMutationResultDTO {
    affectedCount: number
    clerkAffectedCount: number
    stripeAffectedCount: number
}

export interface WebhookReplayResultDTO {
    requestedCount: number
    replayedCount: number
    ignoredCount: number
    nonReplayableCount: number
    failedCount: number
}

export interface ResetWebhookLocksInput {
    source: WebhookSource
    eventIds: string[]
}

```

## /types/scheduling.client.types.ts


```ts
import type { SubmitEventHandler } from 'react'

export interface BookingFormAvailabilityWindow {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacity: number
}

export interface BookingFormWrapOption {
    id: string
    name: string
    price: number
}

export interface BookingFormErrors {
    date?: string
    windowId?: string
    wrapId?: string
    root?: string
}

export interface BookingFormProps {
    availabilityWindows: BookingFormAvailabilityWindow[]
    wraps: BookingFormWrapOption[]
    selectedDate: Date | null
    selectedWindowId: string
    selectedWrapId: string
    errors?: BookingFormErrors
    isPending?: boolean
    minDate?: Date
    onSubmit: SubmitEventHandler<HTMLFormElement>
    onDateSelect: (date: Date) => void
    onWindowSelect: (windowId: string) => void
    onWrapSelect: (wrapId: string) => void
}

export interface BookingFormValues {
    date: Date
    windowId: string
    wrapId: string
}

export interface SchedulingBookingFormClientProps {
    availabilityWindows: BookingFormAvailabilityWindow[]
    wraps: BookingFormWrapOption[]
    minDate?: Date
}

```

## /types/scheduling.types.ts


```ts
import type {
    BookingStatus,
    BookingStatusValue,
    SchedulingBookingDisplayStatus,
} from '@/lib/constants/statuses'
import type { Timestamp } from './common.types'

/**
 * Scheduling domain — API-facing DTOs
 * Per repository canonical rules: DTO timestamps are ISO strings (Timestamp)
 */
export interface BookingDTO {
    id: string
    customerId?: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatus
    totalPrice: number
    reservationExpiresAt: Timestamp | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface CreatedBookingDTO extends BookingDTO {
    invoiceId: string
}

export interface BookingListResult {
    items: BookingDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface BookingListParams {
    page: number
    pageSize: number
    status?: BookingStatusValue
    fromDate?: Timestamp
    toDate?: Timestamp
}

export interface AvailabilityRuleDTO {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    capacitySlots: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type AvailabilityWindowDTO = AvailabilityRuleDTO

export interface AvailabilityListResult {
    items: AvailabilityRuleDTO[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface AvailabilityListParams {
    page: number
    pageSize: number
    dayOfWeek?: number
}

export interface ReserveSlotInput {
    wrapId: string
    startTime: Timestamp
    endTime: Timestamp
}

export interface ReservedBookingDTO {
    id: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Timestamp
    displayStatus: 'reserved'
}

export interface UpdateBookingInput {
    startTime: Timestamp
    endTime: Timestamp
}

export interface BookingActionDTO {
    id: string
    customerId: string
    wrapId: string
    wrapName?: string
    startTime: Timestamp
    endTime: Timestamp
    status: BookingStatusValue
    totalPrice: number
    reservationExpiresAt: Timestamp | null
    displayStatus: SchedulingBookingDisplayStatus
    createdAt: Timestamp
    updatedAt: Timestamp
}

```

## /types/settings.types.ts


```ts
export interface WebsiteSettingsInput {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
}

import type { Timestamp } from './common.types'

export interface WebsiteSettingsDTO {
    preferredContact: 'email' | 'sms'
    appointmentReminders: boolean
    marketingOptIn: boolean
    timezone: string
    updatedAt: Timestamp | null
}

```

## /types/visualizer.client.types.ts


```ts
import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'

export interface CreateVisualizerPreviewClientInput {
    wrapId: string
    file: File
}

export interface VisualizerWorkspaceClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    initialWrapId: string | null
    canManageCatalog: boolean
}

```

## /types/visualizer.types.ts


```ts
import type { SearchParamRecord, Timestamp } from '@/types/common.types'
import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'
import type { PreviewStatus } from '@/lib/constants/statuses'

export interface VisualizerPreviewDTO {
    id: string
    wrapId: string
    customerPhotoUrl: string
    processedImageUrl: string | null
    status: PreviewStatus
    cacheKey: string
    sourceWrapImageId: string | null
    sourceWrapImageVersion: number | null
    expiresAt: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type RegenerateVisualizerPreviewInput = {
    previewId: string
}

export type ProcessVisualizerPreviewInput = {
    previewId: string
}

export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

export interface VisualizerPageProps {
    searchParams: SearchParamRecord
}

export interface VisualizerPageFeatureProps {
    requestedWrapId: string | null
    canManageCatalog: boolean
    includeHidden: boolean
}

export interface PreviewCacheKeyInput {
    wrapId: string
    ownerUserId: string
    customerPhotoHash: string
    sourceWrapImageId: string
    sourceAssetVersion: number
    generationMode: string
    generationModel: string
    promptVersion: string
    blendMode?: 'multiply' | 'overlay'
    opacity?: number
}

```
