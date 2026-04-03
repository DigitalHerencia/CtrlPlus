import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    prisma: {
        invoice: {
            findMany: vi.fn(),
            count: vi.fn(),
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

import { getInvoices } from '@/lib/fetchers/billing.fetchers'

describe('getInvoices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getBillingAccessContext.mockResolvedValue({
            session: {
                userId: 'user_123',
            },
            canReadAllInvoices: false,
        })
        mocks.prisma.invoice.findMany.mockResolvedValue([])
        mocks.prisma.invoice.count.mockResolvedValue(0)
    })

    it('applies the URL query filter to invoice reads', async () => {
        await getInvoices({
            page: 1,
            pageSize: 20,
            query: 'inv_123',
        })

        expect(mocks.prisma.invoice.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    OR: [
                        { id: { contains: 'inv_123', mode: 'insensitive' } },
                        { bookingId: { contains: 'inv_123', mode: 'insensitive' } },
                    ],
                    booking: {
                        customerId: 'user_123',
                    },
                }),
            })
        )
    })
})
