import { describe, it, expect, vi } from 'vitest'
import type { ReactNode } from 'react'
import type { SessionContext } from '@/types/auth.types'

vi.mock('@/lib/auth/session', () => ({
    getSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

// Avoid importing real client TenantSidebar during the test
vi.mock('@/components/shared/tenant-sidebar', () => ({
    TenantSidebar: ({ children }: { children?: ReactNode }) => children,
}))

import TenantLayout from '@/app/(tenant)/layout'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

describe('TenantLayout', () => {
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

        // Call the layout function directly; it should call redirect
        try {
            // call and ignore returned React nodes
            // call as a plain async function
            await TenantLayout({ children: 'child' } as unknown as { children: ReactNode })
        } catch {
            // Some implementations of redirect may throw; ignore
        }

        expect(mockedRedirect).toHaveBeenCalledWith('/sign-in')
    })
})
