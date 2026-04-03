import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

import {
    getBillingAccessContext,
    requireAuthzCapability,
    requireCustomerResourceAccess,
    requireInvoiceWriteAccess,
    requireOwnerOrPlatformAdmin,
    requirePlatformDeveloperAdmin,
} from '@/lib/authz/guards'

function makeSession(overrides: Record<string, unknown> = {}) {
    return {
        isAuthenticated: true,
        userId: 'customer-1',
        role: 'customer',
        isOwner: false,
        isPlatformAdmin: false,
        authz: {
            userId: 'customer-1',
            role: 'customer',
            isAuthenticated: true,
            isOwner: false,
            isPlatformAdmin: false,
        },
        ...overrides,
    }
}

describe('authz guards', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('requires explicit capability checks using the current session', async () => {
        mocks.getSession.mockResolvedValue(makeSession())

        await expect(requireAuthzCapability('catalog.read')).resolves.toEqual(
            expect.objectContaining({ userId: 'customer-1' })
        )
        await expect(requireAuthzCapability('billing.write.all')).rejects.toThrow(
            'Forbidden: insufficient permissions'
        )
    })

    it('enforces owner/platform-admin guard checks', async () => {
        mocks.getSession.mockResolvedValueOnce(makeSession())
        await expect(requireOwnerOrPlatformAdmin()).rejects.toThrow(
            'Forbidden: owner or admin role required'
        )

        mocks.getSession.mockResolvedValueOnce(
            makeSession({
                role: 'owner',
                isOwner: true,
                authz: {
                    userId: 'owner-1',
                    role: 'owner',
                    isAuthenticated: true,
                    isOwner: true,
                    isPlatformAdmin: false,
                },
            })
        )
        await expect(requireOwnerOrPlatformAdmin()).resolves.toEqual(
            expect.objectContaining({ isOwner: true })
        )
    })

    it('enforces platform-admin-only operations', async () => {
        mocks.getSession.mockResolvedValueOnce(makeSession())
        await expect(requirePlatformDeveloperAdmin()).rejects.toThrow(
            'Forbidden: admin role required'
        )

        mocks.getSession.mockResolvedValueOnce(
            makeSession({
                role: 'admin',
                isPlatformAdmin: true,
                authz: {
                    userId: 'admin-1',
                    role: 'admin',
                    isAuthenticated: true,
                    isOwner: false,
                    isPlatformAdmin: true,
                },
            })
        )
        await expect(requirePlatformDeveloperAdmin()).resolves.toEqual(
            expect.objectContaining({ isPlatformAdmin: true })
        )
    })

    it('enforces customer-owned resource access from session context', async () => {
        mocks.getSession.mockResolvedValue(
                makeSession({
                    userId: 'customer-9',
                    authz: {
                        userId: 'customer-9',
                        role: 'customer',
                        isAuthenticated: true,
                        isOwner: false,
                        isPlatformAdmin: false,
                    },
                })
        )

        await expect(requireCustomerResourceAccess('customer-1')).rejects.toThrow(
            'Forbidden: resource is not accessible'
        )
        await expect(requireCustomerResourceAccess('customer-9')).resolves.toEqual(
            expect.objectContaining({ userId: 'customer-9' })
        )
    })

    it('rejects unauthenticated billing access context', async () => {
        mocks.getSession.mockResolvedValue(makeSession({ isAuthenticated: false, userId: null }))

        await expect(getBillingAccessContext()).rejects.toThrow('Unauthorized: not authenticated')
    })

    it('builds billing access context from capabilities', async () => {
        mocks.getSession.mockResolvedValue(
            makeSession({
                role: 'owner',
                isOwner: true,
                authz: {
                    userId: 'owner-1',
                    role: 'owner',
                    isAuthenticated: true,
                    isOwner: true,
                    isPlatformAdmin: false,
                },
            })
        )

        await expect(getBillingAccessContext()).resolves.toEqual(
            expect.objectContaining({
                canReadAllInvoices: true,
                canWriteAllInvoices: true,
            })
        )
    })

    it('blocks users without billing capabilities', async () => {
        mocks.getSession.mockResolvedValue(
            makeSession({
                role: 'customer',
                authz: {
                    userId: 'customer-1',
                    role: 'customer',
                    isAuthenticated: true,
                    isOwner: false,
                    isPlatformAdmin: false,
                },
            })
        )

        const access = await getBillingAccessContext()
        access.session.authz.role = 'customer'

        expect(() => requireInvoiceWriteAccess(access, 'another-customer')).toThrow(
            'Forbidden: user cannot pay this invoice'
        )
    })
})
