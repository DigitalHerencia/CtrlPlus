import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    prisma: {
        invoice: {
            findFirst: vi.fn(),
            update: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
    getBillingAccessContext: vi.fn(),
    requireInvoiceWriteAccess: vi.fn(),
    stripe: {
        checkout: {
            sessions: {
                create: vi.fn(),
            },
        },
    },
    getAppBaseUrl: vi.fn(),
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('@/lib/authz/guards', () => ({
    getBillingAccessContext: mocks.getBillingAccessContext,
    requireInvoiceWriteAccess: mocks.requireInvoiceWriteAccess,
    requireOwnerOrPlatformAdmin: vi.fn(),
}))

vi.mock('@/lib/integrations/stripe', () => ({
    getStripeClient: () => mocks.stripe,
    getAppBaseUrl: mocks.getAppBaseUrl,
}))

vi.mock('@/lib/integrations/notifications', () => ({
    getTenantNotificationEmail: vi.fn(),
    sendNotificationEmail: vi.fn(),
}))

vi.mock('@/lib/actions/settings.actions', () => ({
    syncStripePaymentSettingsSummary: vi.fn(),
}))

import { createCheckoutSession } from '@/lib/actions/billing.actions'

describe('createCheckoutSession', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getBillingAccessContext.mockResolvedValue({
            session: {
                userId: 'user_123',
                isAuthenticated: true,
                authz: {
                    userId: 'user_123',
                    role: 'customer',
                    isAuthenticated: true,
                    isOwner: false,
                    isPlatformAdmin: false,
                },
                role: 'customer',
                isOwner: false,
                isPlatformAdmin: false,
            },
            canReadAllInvoices: false,
            canWriteAllInvoices: false,
        })
        mocks.getAppBaseUrl.mockReturnValue('https://ctrlplus.test')
        mocks.prisma.auditLog.create.mockResolvedValue({})
        mocks.prisma.invoice.update.mockResolvedValue({})
        mocks.prisma.$transaction.mockImplementation(async (operations: unknown[]) =>
            Promise.all(operations as Promise<unknown>[])
        )
        mocks.requireInvoiceWriteAccess.mockImplementation(() => {})
    })

    it('creates a checkout session with a deterministic idempotency key per invoice revision', async () => {
        const updatedAt = new Date('2026-03-23T16:30:00.000Z')
        mocks.prisma.invoice.findFirst.mockResolvedValue({
            id: 'inv_123',
            totalAmount: 120000,
            status: 'issued',
            updatedAt,
            stripeCustomerId: 'cus_123',
            booking: {
                customerId: 'user_123',
                customerName: 'Taylor Driver',
                customerEmail: 'taylor@example.com',
            },
            lineItems: [
                {
                    description: 'Full wrap',
                    quantity: 1,
                    unitPrice: 120000,
                },
            ],
        })
        mocks.stripe.checkout.sessions.create.mockResolvedValue({
            id: 'cs_123',
            url: 'https://checkout.stripe.test/cs_123',
        })

        await expect(createCheckoutSession({ invoiceId: 'inv_123' })).resolves.toEqual({
            sessionId: 'cs_123',
            url: 'https://checkout.stripe.test/cs_123',
            invoiceId: 'inv_123',
        })

        expect(mocks.requireInvoiceWriteAccess).toHaveBeenCalledWith(
            expect.objectContaining({
                session: expect.objectContaining({ userId: 'user_123' }),
            }),
            'user_123'
        )
        expect(mocks.stripe.checkout.sessions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                client_reference_id: 'inv_123',
                customer: 'cus_123',
                metadata: expect.objectContaining({
                    invoiceId: 'inv_123',
                    invoiceUpdatedAt: updatedAt.toISOString(),
                }),
            }),
            {
                idempotencyKey: `billing:checkout:inv_123:${updatedAt.getTime()}`,
            }
        )
        expect(mocks.prisma.invoice.update).toHaveBeenCalledWith({
            where: { id: 'inv_123' },
            data: {
                stripeCheckoutSessionId: 'cs_123',
                stripeCustomerId: 'cus_123',
            },
        })
    })

    it('rejects non-payable invoice states before calling Stripe', async () => {
        mocks.prisma.invoice.findFirst.mockResolvedValue({
            id: 'inv_refunded',
            totalAmount: 120000,
            status: 'refunded',
            updatedAt: new Date('2026-03-23T16:30:00.000Z'),
            stripeCustomerId: 'cus_123',
            booking: {
                customerId: 'user_123',
                customerName: 'Taylor Driver',
                customerEmail: 'taylor@example.com',
            },
            lineItems: [],
        })

        await expect(createCheckoutSession({ invoiceId: 'inv_refunded' })).rejects.toThrow(
            'Forbidden: invoice is not payable from status refunded'
        )

        expect(mocks.stripe.checkout.sessions.create).not.toHaveBeenCalled()
        expect(mocks.prisma.auditLog.create).not.toHaveBeenCalled()
    })
})
