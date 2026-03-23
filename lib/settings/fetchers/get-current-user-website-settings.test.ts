import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    requireAuthzCapability: vi.fn(),
    prisma: {
        websiteSettings: {
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/authz/guards', () => ({
    requireAuthzCapability: mocks.requireAuthzCapability,
}))

vi.mock('server-only', () => ({}))

vi.mock('@/lib/prisma', () => ({
    prisma: mocks.prisma,
}))

import { getCurrentUserWebsiteSettings } from './get-current-user-website-settings'

describe('getCurrentUserWebsiteSettings', () => {
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
    })

    it('returns default settings when the user has no saved record', async () => {
        mocks.prisma.websiteSettings.findFirst.mockResolvedValue(null)

        const result = await getCurrentUserWebsiteSettings()

        expect(result).toMatchObject({
            preferredContact: 'email',
            appointmentReminders: true,
            marketingOptIn: false,
            timezone: process.env.DEFAULT_STORE_TIMEZONE ?? 'America/Denver',
            updatedAt: null,
        })
    })

    it('queries only the authenticated user and excludes soft-deleted records', async () => {
        mocks.prisma.websiteSettings.findFirst.mockResolvedValue({
            preferredContact: 'sms',
            appointmentReminders: false,
            marketingOptIn: true,
            timezone: 'America/New_York',
            updatedAt: new Date('2026-03-20T12:00:00Z'),
        })

        await getCurrentUserWebsiteSettings()

        expect(mocks.prisma.websiteSettings.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    clerkUserId: 'user-1',
                    deletedAt: null,
                },
            })
        )
    })

    it('fails closed when settings capability is not available', async () => {
        mocks.requireAuthzCapability.mockRejectedValue(
            new Error('Forbidden: insufficient permissions')
        )

        await expect(getCurrentUserWebsiteSettings()).rejects.toThrow(
            'Forbidden: insufficient permissions'
        )

        expect(mocks.prisma.websiteSettings.findFirst).not.toHaveBeenCalled()
    })
})
