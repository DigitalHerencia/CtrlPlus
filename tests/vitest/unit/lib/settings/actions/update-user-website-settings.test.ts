import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

const mocks = vi.hoisted(() => ({
    requireAuthzCapability: vi.fn(),
    revalidatePath: vi.fn(),
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

vi.mock('next/cache', () => ({
    revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/prisma', () => ({
    prisma: mocks.prisma,
}))

import { updateUserWebsiteSettings } from '@/lib/settings/actions/update-user-website-settings'

describe('updateUserWebsiteSettings', () => {
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
        mocks.prisma.websiteSettings.upsert.mockResolvedValue({
            preferredContact: 'sms',
            appointmentReminders: false,
            marketingOptIn: true,
            timezone: 'America/New_York',
            updatedAt: new Date('2026-03-20T12:00:00Z'),
        })
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
    })

    it('fails closed before writing when capability checks fail', async () => {
        mocks.requireAuthzCapability.mockRejectedValue(
            new Error('Forbidden: insufficient permissions')
        )

        await expect(
            updateUserWebsiteSettings({
                preferredContact: 'email',
                appointmentReminders: true,
                marketingOptIn: false,
                timezone: 'America/Denver',
            })
        ).rejects.toThrow('Forbidden: insufficient permissions')

        expect(mocks.prisma.websiteSettings.upsert).not.toHaveBeenCalled()
    })

    it('rejects invalid timezone input before persisting', async () => {
        await expect(
            updateUserWebsiteSettings({
                preferredContact: 'email',
                appointmentReminders: true,
                marketingOptIn: false,
                timezone: 'not-a-timezone',
            })
        ).rejects.toBeInstanceOf(ZodError)

        expect(mocks.prisma.websiteSettings.upsert).not.toHaveBeenCalled()
        expect(mocks.prisma.auditLog.create).not.toHaveBeenCalled()
    })

    it('writes an audit log entry and revalidates the settings route after save', async () => {
        const result = await updateUserWebsiteSettings({
            preferredContact: 'sms',
            appointmentReminders: false,
            marketingOptIn: true,
            timezone: 'America/New_York',
        })

        expect(mocks.prisma.websiteSettings.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { clerkUserId: 'user-1' },
            })
        )
        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId: 'user-1',
                action: 'WEBSITE_SETTINGS_UPDATED',
                resourceType: 'WebsiteSettings',
                resourceId: 'user-1',
            }),
        })
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/settings')
        expect(result).toEqual({
            preferredContact: 'sms',
            appointmentReminders: false,
            marketingOptIn: true,
            timezone: 'America/New_York',
            updatedAt: '2026-03-20T12:00:00.000Z',
        })
    })
})
