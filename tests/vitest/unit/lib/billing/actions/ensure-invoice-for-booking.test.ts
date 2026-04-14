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

import { createInvoice, ensureInvoiceForBooking } from '@/lib/actions/billing.actions'

describe('billing invoice creation', () => {
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

    it('requires the invoice composer instead of auto-deriving pricing from a booking', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-1',
            customerEmail: 'customer@example.com',
            status: 'completed',
            invoice: null,
        })

        await expect(ensureInvoiceForBooking({ bookingId: 'booking-1' })).rejects.toThrow(
            'Use the invoice composer to issue billing for booking booking-1. Pricing is no longer derived automatically from the booking.'
        )
    })

    it('creates a manager-authored invoice for a completed wrap-backed booking', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-2',
            customerEmail: 'customer@example.com',
            status: 'completed',
            invoice: null,
        })

        const tx = {
            invoice: {
                create: vi.fn().mockResolvedValue({ id: 'inv-created' }),
            },
            auditLog: {
                create: vi.fn().mockResolvedValue({}),
            },
        }

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)
        )

        await expect(
            createInvoice({
                bookingId: 'booking-2',
                description: 'Midnight Matte install services',
                unitPrice: 125000,
                quantity: 1,
            })
        ).resolves.toEqual({
            invoiceId: 'inv-created',
            created: true,
        })

        expect(tx.invoice.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    bookingId: 'booking-2',
                    subtotalAmount: 125000,
                    totalAmount: 125000,
                    lineItems: {
                        create: [
                            {
                                description: 'Midnight Matte install services',
                                quantity: 1,
                                unitPrice: 125000,
                                totalPrice: 125000,
                            },
                        ],
                    },
                }),
            })
        )
        expect(mocks.sendNotificationEmail).toHaveBeenCalledTimes(2)
    })

    it('creates a manager-authored invoice for a completed standalone booking without wrap context', async () => {
        mocks.prisma.booking.findFirst.mockResolvedValue({
            id: 'booking-3',
            customerEmail: 'customer@example.com',
            status: 'completed',
            invoice: null,
        })

        const tx = {
            invoice: {
                create: vi.fn().mockResolvedValue({ id: 'inv-service' }),
            },
            auditLog: {
                create: vi.fn().mockResolvedValue({}),
            },
        }

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)
        )

        await expect(
            createInvoice({
                bookingId: 'booking-3',
                description: 'Consultation follow-up and install planning',
                unitPrice: 25000,
                quantity: 2,
            })
        ).resolves.toEqual({
            invoiceId: 'inv-service',
            created: true,
        })

        expect(tx.invoice.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    bookingId: 'booking-3',
                    subtotalAmount: 50000,
                    totalAmount: 50000,
                    lineItems: {
                        create: [
                            {
                                description: 'Consultation follow-up and install planning',
                                quantity: 2,
                                unitPrice: 25000,
                                totalPrice: 50000,
                            },
                        ],
                    },
                }),
            })
        )
    })
})
