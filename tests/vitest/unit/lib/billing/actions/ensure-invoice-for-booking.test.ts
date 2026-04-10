import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    requireOwnerOrPlatformAdmin: vi.fn(),
    prisma: {
        booking: {
            findFirst: vi.fn(),
        },
        invoice: {
            findUnique: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
    getTenantNotificationEmail: vi.fn(),
    sendNotificationEmail: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/authz/guards', () => ({
    getBillingAccessContext: vi.fn(),
    requireInvoiceWriteAccess: vi.fn(),
    requireOwnerOrPlatformAdmin: mocks.requireOwnerOrPlatformAdmin,
}))

vi.mock('@/lib/integrations/notifications', () => ({
    getTenantNotificationEmail: mocks.getTenantNotificationEmail,
    sendNotificationEmail: mocks.sendNotificationEmail,
}))

vi.mock('@/lib/actions/settings.actions', () => ({
    syncStripePaymentSettingsSummary: vi.fn(),
}))

import { ensureInvoiceForBooking } from '@/lib/actions/billing.actions'

describe('ensureInvoiceForBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.requireOwnerOrPlatformAdmin.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            isOwner: true,
            isPlatformAdmin: false,
            authz: { role: 'owner' },
        })
        mocks.getTenantNotificationEmail.mockResolvedValue('owner@example.com')
        mocks.sendNotificationEmail.mockResolvedValue({ delivered: true })
    })

    it('returns existing invoice without creating a new record', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerId: 'customer-1',
            customerEmail: 'customer@example.com',
            customerName: 'Taylor Driver',
            status: 'completed',
            wrapId: 'wrap-1',
            totalPrice: 1200,
            wrapNameSnapshot: 'Stealth',
            wrap: { name: 'Stealth' },
            invoice: { id: 'inv-existing' },
        })

        await expect(ensureInvoiceForBooking({ bookingId: 'booking-1' })).resolves.toEqual({
            invoiceId: 'inv-existing',
            created: false,
        })
        expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
    })

    it('creates a new invoice when one does not exist', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-2',
            customerId: 'customer-1',
            customerEmail: 'customer@example.com',
            customerName: 'Taylor Driver',
            status: 'completed',
            wrapId: 'wrap-1',
            totalPrice: 1599.4,
            wrapNameSnapshot: 'Stealth',
            wrap: { name: 'Stealth' },
            invoice: null,
        })

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (tx: unknown) => Promise<unknown>) => {
                const tx = {
                    invoice: {
                        create: vi.fn().mockResolvedValue({ id: 'inv-created' }),
                    },
                    auditLog: {
                        create: vi.fn().mockResolvedValue({}),
                    },
                }
                return callback(tx)
            }
        )

        await expect(ensureInvoiceForBooking({ bookingId: 'booking-2' })).resolves.toEqual({
            invoiceId: 'inv-created',
            created: true,
        })
        expect(mocks.sendNotificationEmail).toHaveBeenCalledTimes(2)
    })

    it('returns winner invoice when create hits unique race', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-race',
            customerId: 'customer-1',
            customerEmail: 'customer@example.com',
            customerName: 'Taylor Driver',
            status: 'completed',
            wrapId: 'wrap-1',
            totalPrice: 500,
            wrapNameSnapshot: 'Stealth',
            wrap: { name: 'Stealth' },
            invoice: null,
        })

        mocks.prisma.$transaction.mockRejectedValue({ code: 'P2002' })
        mocks.prisma.invoice.findUnique.mockResolvedValue({ id: 'inv-winner' })

        await expect(ensureInvoiceForBooking({ bookingId: 'booking-race' })).resolves.toEqual({
            invoiceId: 'inv-winner',
            created: false,
        })
    })

    it('throws when race is detected but winner invoice cannot be loaded', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-race-missing',
            customerId: 'customer-1',
            customerEmail: 'customer@example.com',
            customerName: 'Taylor Driver',
            status: 'completed',
            wrapId: 'wrap-1',
            totalPrice: 500,
            wrapNameSnapshot: 'Stealth',
            wrap: { name: 'Stealth' },
            invoice: null,
        })

        mocks.prisma.$transaction.mockRejectedValue({ code: 'P2002' })
        mocks.prisma.invoice.findUnique.mockResolvedValue(null)

        await expect(
            ensureInvoiceForBooking({ bookingId: 'booking-race-missing' })
        ).rejects.toThrow('Invoice creation race detected but invoice could not be found')
    })
})
