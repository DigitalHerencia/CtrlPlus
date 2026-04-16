import { describe, it, expect, vi } from 'vitest'
import type { ReactNode } from 'react'
import type { SessionContext } from '@/types/auth.types'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    redirect: vi.fn(),
    prisma: {
        websiteSettings: {
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('next/navigation', () => ({
    redirect: mocks.redirect,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

// Avoid importing real client TenantSidebar during the test
vi.mock('@/components/shared/tenant-sidebar', () => ({
    TenantSidebar: ({ children }: { children?: ReactNode }) => children,
}))

import TenantLayout from '@/app/(tenant)/layout'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

describe('TenantLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('redirects unauthenticated users to sign-in', async () => {
        const mockedSession = vi.mocked(getSession)
        mockedSession.mockResolvedValueOnce({
            isAuthenticated: false,
            userId: null,
            authz: {
                userId: null,
                role: 'customer',
                isAuthenticated: false,
                isOwner: false,
                isPlatformAdmin: false,
            },
            role: 'customer',
            isOwner: false,
            isPlatformAdmin: false,
        } as SessionContext)

        const mockedRedirect = vi.mocked(redirect)

        try {
            await TenantLayout({ children: 'child' } as unknown as { children: ReactNode })
        } catch {
            // Some implementations of redirect may throw; ignore
        }

        expect(mockedRedirect).toHaveBeenCalledWith('/sign-in')
    })

    it('passes onboarding state when the user has no saved website settings', async () => {
        const mockedSession = vi.mocked(getSession)
        mockedSession.mockResolvedValueOnce({
            isAuthenticated: true,
            userId: 'user-1',
            authz: {
                userId: 'user-1',
                role: 'customer',
                isAuthenticated: true,
                isOwner: false,
                isPlatformAdmin: false,
            },
            role: 'customer',
            isOwner: false,
            isPlatformAdmin: false,
        } as SessionContext)

        const mockedFindFirst = vi.mocked(mocks.prisma.websiteSettings.findFirst)
        mockedFindFirst.mockResolvedValueOnce(null)

        await TenantLayout({ children: 'child' } as unknown as { children: ReactNode })

        expect(mocks.prisma.websiteSettings.findFirst).toHaveBeenCalledWith({
            where: {
                clerkUserId: 'user-1',
                deletedAt: null,
            },
            select: {
                id: true,
            },
        })
        expect(vi.mocked(redirect)).not.toHaveBeenCalled()
    })
})
