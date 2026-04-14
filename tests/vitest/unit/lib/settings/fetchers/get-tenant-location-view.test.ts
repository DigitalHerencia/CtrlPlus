import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    prisma: {
        auditLog: {
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import { getTenantLocationView } from '@/lib/fetchers/settings.fetchers'

describe('getTenantLocationView', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns business name and address for authenticated users', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
        })
        mocks.prisma.auditLog.findFirst.mockResolvedValue({
            details: JSON.stringify({
                businessName: 'CtrlPlus Wrap Studio',
                address: '123 Main St, Denver, CO 80202',
            }),
        })

        await expect(getTenantLocationView()).resolves.toEqual({
            tenantId: 'default-tenant',
            businessName: 'CtrlPlus Wrap Studio',
            address: '123 Main St, Denver, CO 80202',
        })
    })

    it('rejects unauthenticated access', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: false,
            userId: null,
        })

        await expect(getTenantLocationView()).rejects.toThrow('Unauthorized: not authenticated')
    })
})
