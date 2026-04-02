import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    requireAuthzCapability: vi.fn(),
    requireOwnerOrAdmin: vi.fn(),
    revalidatePath: vi.fn(),
    prisma: {
        auditLog: {
            create: vi.fn(),
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
        },
    },
}))

import { exportData } from '@/lib/actions/settings.actions'

describe('exportData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.requireAuthzCapability.mockResolvedValue({
            isAuthenticated: true,
            userId: 'owner-1',
            authz: { role: 'owner' },
        })
        mocks.requireOwnerOrAdmin.mockReturnValue(undefined)
        mocks.prisma.auditLog.create.mockResolvedValue({
            id: 'audit_1',
            resourceId: 'default-tenant',
            timestamp: new Date('2026-04-02T11:00:00.000Z'),
        })
    })

    it('creates an export request audit event and returns queued response', async () => {
        const result = await exportData({ tenantId: 'default-tenant', format: 'csv' })

        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId: 'owner-1',
                action: 'SETTINGS_DATA_EXPORT_REQUESTED',
                resourceType: 'TenantSettings',
                resourceId: 'default-tenant',
            }),
            select: {
                id: true,
                resourceId: true,
                timestamp: true,
            },
        })
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/settings/data')
        expect(result).toEqual({
            requestId: 'audit_1',
            tenantId: 'default-tenant',
            format: 'csv',
            createdAt: '2026-04-02T11:00:00.000Z',
            status: 'queued',
        })
    })
})
