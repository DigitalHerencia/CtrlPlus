import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

const mocks = vi.hoisted(() => ({
    requireAuthzCapability: vi.fn(),
    getUserSettingsView: vi.fn(),
    revalidateSettingsPaths: vi.fn(),
    prisma: {
        websiteSettings: {
            upsert: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
    },
}))

vi.mock('@/lib/authz/guards', () => ({
    requireAuthzCapability: mocks.requireAuthzCapability,
}))

vi.mock('@/lib/fetchers/settings.fetchers', () => ({
    getUserSettingsView: mocks.getUserSettingsView,
}))

vi.mock('@/lib/cache/revalidate-tags', () => ({
    revalidateSettingsPaths: mocks.revalidateSettingsPaths,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import { updateUserPreferences } from '@/lib/actions/settings.actions'

describe('updateUserPreferences', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mocks.requireAuthzCapability.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            authz: {},
            role: 'customer',
            isOwner: false,
            isPlatformAdmin: false,
        })

        mocks.getUserSettingsView.mockResolvedValue({
            userId: 'user-1',
            theme: 'system',
            language: 'en-US',
            timezone: 'America/Denver',
            notifications: { email: true, sms: false, push: false },
            preferredContact: 'email',
            appointmentReminders: true,
            marketingOptIn: false,
            fullName: 'Taylor Driver',
            email: 'taylor@example.com',
            phone: '5551234567',
            billingAddressLine1: '123 Main St',
            billingAddressLine2: 'Suite 100',
            billingCity: 'Denver',
            billingState: 'CO',
            billingPostalCode: '80202',
            billingCountry: 'US',
            vehicleMake: 'Toyota',
            vehicleModel: 'Camry',
            vehicleYear: '2022',
            vehicleTrim: 'XLE',
            stripeCustomerId: null,
            stripeDefaultPaymentMethodBrand: null,
            stripeDefaultPaymentMethodLast4: null,
            updatedAt: null,
        })

        mocks.prisma.websiteSettings.upsert.mockResolvedValue({
            preferredContact: 'email',
            appointmentReminders: true,
            marketingOptIn: false,
            timezone: 'America/Denver',
            fullName: null,
            email: null,
            phone: null,
            billingAddressLine1: null,
            billingAddressLine2: null,
            billingCity: null,
            billingState: null,
            billingPostalCode: null,
            billingCountry: 'US',
            vehicleMake: null,
            vehicleModel: null,
            vehicleYear: null,
            vehicleTrim: null,
            stripeCustomerId: null,
            stripeDefaultPaymentMethodBrand: null,
            stripeDefaultPaymentMethodLast4: null,
            updatedAt: new Date('2026-04-15T12:00:00Z'),
        })

        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('stores explicit null personal fields when user opts out of identifiable profile data', async () => {
        const result = await updateUserPreferences({
            theme: 'system',
            language: 'en-US',
            timezone: 'America/Denver',
            notifications: { email: true, sms: false, push: false },
            preferredContact: 'email',
            appointmentReminders: true,
            marketingOptIn: false,
            fullName: null,
            email: null,
            phone: null,
            billingAddressLine1: null,
            billingAddressLine2: null,
            billingCity: null,
            billingState: null,
            billingPostalCode: null,
            billingCountry: 'US',
            vehicleMake: null,
            vehicleModel: null,
            vehicleYear: null,
            vehicleTrim: null,
        })

        expect(mocks.prisma.websiteSettings.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { clerkUserId: 'user-1' },
                create: expect.objectContaining({
                    fullName: null,
                    email: null,
                    phone: null,
                    billingAddressLine1: null,
                    billingAddressLine2: null,
                    billingCity: null,
                    billingState: null,
                    billingPostalCode: null,
                    billingCountry: 'US',
                    vehicleMake: null,
                    vehicleModel: null,
                    vehicleYear: null,
                    vehicleTrim: null,
                }),
                update: expect.objectContaining({
                    fullName: null,
                    email: null,
                    phone: null,
                    billingAddressLine1: null,
                    billingAddressLine2: null,
                    billingCity: null,
                    billingState: null,
                    billingPostalCode: null,
                    billingCountry: 'US',
                    vehicleMake: null,
                    vehicleModel: null,
                    vehicleYear: null,
                    vehicleTrim: null,
                }),
            })
        )

        expect(result.fullName).toBeNull()
        expect(result.email).toBeNull()
    })

    it('rejects invalid email before persisting', async () => {
        await expect(
            updateUserPreferences({
                theme: 'system',
                language: 'en-US',
                timezone: 'America/Denver',
                notifications: { email: true, sms: false, push: false },
                preferredContact: 'email',
                appointmentReminders: true,
                marketingOptIn: false,
                fullName: null,
                email: 'not-an-email',
                phone: null,
                billingAddressLine1: null,
                billingAddressLine2: null,
                billingCity: null,
                billingState: null,
                billingPostalCode: null,
                billingCountry: 'US',
                vehicleMake: null,
                vehicleModel: null,
                vehicleYear: null,
                vehicleTrim: null,
            })
        ).rejects.toBeInstanceOf(ZodError)

        expect(mocks.prisma.websiteSettings.upsert).not.toHaveBeenCalled()
    })
})
