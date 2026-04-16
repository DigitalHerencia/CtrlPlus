import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    prisma: {
        auditLog: { create: vi.fn() },
        $transaction: vi.fn(),
    },
    assertSlotHasCapacity: vi.fn(),
    revalidateSchedulingPages: vi.fn(),
    revalidatePath: vi.fn(),
    getTenantNotificationEmail: vi.fn(),
    sendNotificationEmail: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

vi.mock('@/lib/db/transactions/scheduling.transactions', () => ({
    assertSlotHasCapacity: mocks.assertSlotHasCapacity,
}))

vi.mock('@/lib/cache/revalidate-tags', () => ({
    revalidateSchedulingPages: mocks.revalidateSchedulingPages,
}))

vi.mock('next/cache', () => ({
    revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/integrations/notifications', () => ({
    getTenantNotificationEmail: mocks.getTenantNotificationEmail,
    sendNotificationEmail: mocks.sendNotificationEmail,
}))

import { createBooking } from '@/lib/actions/scheduling.actions'

describe('createBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getTenantNotificationEmail.mockResolvedValue('owner@example.com')
        mocks.sendNotificationEmail.mockResolvedValue({ delivered: true })
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('creates a requested booking with a selected wrap and persists customer defaults', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })

        const tx = {
            wrap: { findFirst: vi.fn() },
            booking: { findFirst: vi.fn(), create: vi.fn() },
            websiteSettings: { upsert: vi.fn() },
            auditLog: { create: vi.fn() },
        }

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)
        )

        tx.wrap.findFirst.mockResolvedValue({
            id: 'wrap-1',
            name: 'Midnight Matte',
            price: 100000,
        })
        tx.booking.findFirst.mockResolvedValue(null)
        tx.booking.create.mockResolvedValue({
            id: 'booking-1',
            customerId: 'user-1',
            wrapId: 'wrap-1',
            wrap: { id: 'wrap-1', name: 'Midnight Matte' },
            wrapNameSnapshot: 'Midnight Matte',
            wrapPriceSnapshot: 100000,
            startTime: new Date('2026-03-23T16:00:00.000Z'),
            endTime: new Date('2026-03-23T18:00:00.000Z'),
            status: 'requested',
            totalPrice: 100000,
            customerName: 'Taylor Driver',
            customerEmail: 'taylor@example.com',
            customerPhone: '5551234567',
            preferredContact: 'email',
            billingAddressLine1: '123 Main St',
            billingAddressLine2: null,
            billingCity: 'Denver',
            billingState: 'CO',
            billingPostalCode: '80202',
            billingCountry: 'US',
            vehicleMake: 'Ford',
            vehicleModel: 'Mustang',
            vehicleYear: '2022',
            vehicleTrim: 'GT',
            previewImageUrl: 'https://image.test/preview.png',
            previewPromptUsed: 'prompt used',
            notes: 'Please call on arrival.',
            reservation: null,
            createdAt: new Date('2026-03-01T00:00:00.000Z'),
            updatedAt: new Date('2026-03-01T00:00:00.000Z'),
        })
        tx.websiteSettings.upsert.mockResolvedValue(undefined)
        tx.auditLog.create.mockResolvedValue(undefined)

        const result = await createBooking({
            wrapId: 'wrap-1',
            startTime: new Date('2026-03-23T16:00:00.000Z').toISOString(),
            endTime: new Date('2026-03-23T18:00:00.000Z').toISOString(),
            customerName: 'Taylor Driver',
            customerEmail: 'taylor@example.com',
            customerPhone: '5551234567',
            preferredContact: 'email',
            billingAddressLine1: '123 Main St',
            billingAddressLine2: null,
            billingCity: 'Denver',
            billingState: 'CO',
            billingPostalCode: '80202',
            billingCountry: 'US',
            vehicleMake: 'Ford',
            vehicleModel: 'Mustang',
            vehicleYear: '2022',
            vehicleTrim: 'GT',
            previewImageUrl: 'https://image.test/preview.png',
            previewPromptUsed: 'prompt used',
            notes: 'Please call on arrival.',
        })

        expect(result).toEqual(
            expect.objectContaining({
                id: 'booking-1',
                status: 'requested',
                wrapName: 'Midnight Matte',
                customerName: 'Taylor Driver',
                customerEmail: 'taylor@example.com',
                vehicleMake: 'Ford',
                previewImageUrl: 'https://image.test/preview.png',
                notes: 'Please call on arrival.',
            })
        )

        expect(tx.websiteSettings.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { clerkUserId: 'user-1' },
                update: expect.objectContaining({
                    fullName: 'Taylor Driver',
                    email: 'taylor@example.com',
                    vehicleMake: 'Ford',
                    vehicleModel: 'Mustang',
                    vehicleYear: '2022',
                }),
            })
        )
        expect(mocks.sendNotificationEmail).toHaveBeenCalledTimes(2)
        expect(mocks.revalidateSchedulingPages).toHaveBeenCalledTimes(1)
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/scheduling/book')
    })

    it('creates a standalone consultation booking when no wrap is provided', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })

        const tx = {
            booking: { findFirst: vi.fn(), create: vi.fn() },
            websiteSettings: { upsert: vi.fn() },
            auditLog: { create: vi.fn() },
        }

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)
        )

        tx.booking.findFirst.mockResolvedValue(null)
        tx.booking.create.mockResolvedValue({
            id: 'booking-2',
            customerId: 'user-1',
            wrapId: null,
            wrap: null,
            wrapNameSnapshot: null,
            wrapPriceSnapshot: null,
            startTime: new Date('2026-03-24T16:00:00.000Z'),
            endTime: new Date('2026-03-24T18:00:00.000Z'),
            status: 'requested',
            totalPrice: null,
            customerName: 'Taylor Driver',
            customerEmail: 'taylor@example.com',
            customerPhone: '5551234567',
            preferredContact: 'email',
            billingAddressLine1: '123 Main St',
            billingAddressLine2: null,
            billingCity: 'Denver',
            billingState: 'CO',
            billingPostalCode: '80202',
            billingCountry: 'US',
            vehicleMake: 'Ford',
            vehicleModel: 'Mustang',
            vehicleYear: '2022',
            vehicleTrim: 'GT',
            previewImageUrl: null,
            previewPromptUsed: null,
            notes: null,
            reservation: null,
            createdAt: new Date('2026-03-01T00:00:00.000Z'),
            updatedAt: new Date('2026-03-01T00:00:00.000Z'),
        })
        tx.websiteSettings.upsert.mockResolvedValue(undefined)
        tx.auditLog.create.mockResolvedValue(undefined)

        const result = await createBooking({
            startTime: new Date('2026-03-24T16:00:00.000Z').toISOString(),
            endTime: new Date('2026-03-24T18:00:00.000Z').toISOString(),
            customerName: 'Taylor Driver',
            customerEmail: 'taylor@example.com',
            customerPhone: '5551234567',
            preferredContact: 'email',
            billingAddressLine1: '123 Main St',
            billingAddressLine2: null,
            billingCity: 'Denver',
            billingState: 'CO',
            billingPostalCode: '80202',
            billingCountry: 'US',
            vehicleMake: 'Ford',
            vehicleModel: 'Mustang',
            vehicleYear: '2022',
            vehicleTrim: 'GT',
            notes: null,
        })

        expect(result).toEqual(
            expect.objectContaining({
                id: 'booking-2',
                wrapId: null,
                wrapName: undefined,
                totalPrice: null,
            })
        )
        expect(tx.booking.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    wrapId: undefined,
                    totalPrice: undefined,
                    wrapNameSnapshot: undefined,
                    wrapPriceSnapshot: undefined,
                }),
                select: expect.any(Object),
            })
        )
    })

    it('retries standalone booking with fallback wrap when legacy null-constraint is raised', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            isOwner: false,
            isPlatformAdmin: false,
            authz: { role: 'customer' },
        })

        const tx = {
            wrap: { findFirst: vi.fn(), create: vi.fn() },
            booking: { findFirst: vi.fn(), create: vi.fn() },
            websiteSettings: { upsert: vi.fn() },
            auditLog: { create: vi.fn() },
        }

        mocks.prisma.$transaction.mockImplementation(
            async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)
        )

        tx.booking.findFirst.mockResolvedValue(null)
        tx.wrap.findFirst.mockResolvedValue(null)
        tx.wrap.create.mockResolvedValue({
            id: 'wrap-fallback',
            name: 'General Appointment',
            price: 0,
        })




        tx.websiteSettings.upsert.mockResolvedValue(undefined)
        tx.auditLog.create.mockResolvedValue(undefined)

        const result = await createBooking({
            startTime: new Date('2026-03-24T16:00:00.000Z').toISOString(),
            endTime: new Date('2026-03-24T18:00:00.000Z').toISOString(),
            customerName: 'Taylor Driver',
            customerEmail: 'taylor@example.com',
            customerPhone: '',
            preferredContact: 'email',
            billingAddressLine1: '',
            billingAddressLine2: '',
            billingCity: '',
            billingState: '',
            billingPostalCode: '',
            billingCountry: '',
            vehicleMake: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleTrim: '',
            notes: '',
        })

        expect(tx.wrap.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    name: 'General Appointment',
                    price: 0,
                    isHidden: true,
                }),
            })
        )
        expect(tx.booking.create).toHaveBeenCalledTimes(2)
        expect(result).toEqual(
            expect.objectContaining({
                id: 'booking-legacy',
                wrapId: 'wrap-fallback',
                wrapName: 'General Appointment',
                totalPrice: 0,
            })
        )
    })
})
