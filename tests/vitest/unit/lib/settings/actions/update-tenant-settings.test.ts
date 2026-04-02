import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    requireAuthzCapability: vi.fn(),
    requireOwnerOrAdmin: vi.fn(),
    revalidatePath: vi.fn(),
    prisma: {
        auditLog: {
            create: vi.fn(),
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/authz/guards', () => ({
    requireAuthzCapability: mocks.requireAuthzCapability,
}))

vi.mock('@/lib/authz/policy', () => ({
    requireOwnerOrAdmin: mocks.requireOwnerOrAdmin,
}))

vi.mock('next/cache', () => ({
    revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: {
        auditLog: {
            create: mocks.prisma.auditLog.create,
            findFirst: mocks.prisma.auditLog.findFirst,
        },
    },
}))

import { updateTenantSettings } from '@/lib/actions/settings.actions'

describe('updateTenantSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.requireAuthzCapability.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            authz: { role: 'owner' },
        })
        mocks.requireOwnerOrAdmin.mockReturnValue(undefined)
        mocks.prisma.auditLog.create.mockResolvedValue(undefined)
        mocks.prisma.auditLog.findFirst.mockResolvedValue({
            details: JSON.stringify({ businessName: 'CtrlPlus HQ' }),
            timestamp: new Date('2026-04-02T10:00:00.000Z'),
        })
    })

    it('writes tenant settings update audit event and revalidates settings account route', async () => {
        const result = await updateTenantSettings('default-tenant', {
            businessName: 'CtrlPlus HQ',
            notificationEmail: 'ops@ctrlplus.test',
        })

        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId: 'owner-1',
                action: 'TENANT_SETTINGS_UPDATED',
                resourceType: 'TenantSettings',
                resourceId: 'default-tenant',
            }),
        })
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/settings')
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/settings/account')
        expect(result.tenantId).toBe('default-tenant')
    })
})
