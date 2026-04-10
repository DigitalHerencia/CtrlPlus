import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    prisma: {
        payment: {
            findMany: vi.fn(),
        },
        invoice: {
            findFirst: vi.fn(),
        },
    },
    getBillingAccessContext: vi.fn(),
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('server-only', () => ({}))

vi.mock('@/lib/authz/guards', () => ({
    getBillingAccessContext: mocks.getBillingAccessContext,
}))

import { getPaymentStatusForInvoice } from '@/lib/fetchers/billing.fetchers'

describe('getPaymentStatusForInvoice', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getBillingAccessContext.mockResolvedValue({
            session: {
                userId: 'user_123',
            },
            canReadAllInvoices: false,
        })
    })

    it('filters payment reads to the current customer when the user cannot read all invoices', async () => {
        mocks.prisma.payment.findMany.mockResolvedValue([
            {
                id: 'pay_123',
                invoiceId: 'inv_123',
                stripePaymentIntentId: 'pi_123',
                status: 'succeeded',
                amount: 120000,
                createdAt: new Date('2026-03-23T17:00:00.000Z'),
            },
        ])

        await expect(getPaymentStatusForInvoice('inv_123')).resolves.toEqual([
            expect.objectContaining({
                id: 'pay_123',
                invoiceId: 'inv_123',
                status: 'succeeded',
            }),
        ])

        expect(mocks.prisma.payment.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    invoice: expect.objectContaining({
                        id: 'inv_123',
                        booking: {
                            customerId: 'user_123',
                        },
                    }),
                }),
            })
        )
    })

    it('returns an empty list when the invoice is outside the caller scope and has no readable payments', async () => {
        mocks.prisma.payment.findMany.mockResolvedValue([])
        mocks.prisma.invoice.findFirst.mockResolvedValue(null)

        await expect(getPaymentStatusForInvoice('inv_hidden')).resolves.toEqual([])
    })
})
