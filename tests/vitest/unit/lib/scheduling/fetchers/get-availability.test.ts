import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    hasCapability: vi.fn(),
    prisma: {
        availabilityRule: {
            findMany: vi.fn(),
            count: vi.fn(),
            findFirst: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/session', () => ({
    getSession: mocks.getSession,
}))

vi.mock('@/lib/authz/policy', () => ({
    hasCapability: mocks.hasCapability,
}))

vi.mock('@/lib/db/prisma', () => ({
    prisma: mocks.prisma,
}))

import {
    getAvailabilityRuleById,
    getAvailabilityRules,
    getAvailabilityRulesByDay,
} from '@/lib/fetchers/scheduling.fetchers'

describe('scheduling availability fetchers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.hasCapability.mockReturnValue(true)
    })

    it('fails closed when the user is not authenticated', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: false,
            userId: null,
            authz: {},
        })

        await expect(getAvailabilityRules()).rejects.toThrow('Unauthorized: not authenticated')
        expect(mocks.prisma.availabilityRule.findMany).not.toHaveBeenCalled()
    })

    it('requires scheduling read access before returning availability', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            authz: { role: 'customer' },
        })

        mocks.prisma.availabilityRule.findMany.mockResolvedValue([])
        mocks.prisma.availabilityRule.count.mockResolvedValue(0)

        await getAvailabilityRules()

        expect(mocks.hasCapability).toHaveBeenCalledWith(
            expect.objectContaining({ role: 'customer' }),
            'scheduling.read.own'
        )
    })

    it('returns day-scoped availability when authorized', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            authz: { role: 'customer' },
        })

        mocks.prisma.availabilityRule.findMany.mockResolvedValue([
            {
                id: 'rule-1',
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '12:00',
                capacitySlots: 2,
                createdAt: new Date('2026-03-20T10:00:00.000Z'),
                updatedAt: new Date('2026-03-20T10:00:00.000Z'),
            },
        ])
        mocks.prisma.availabilityRule.count.mockResolvedValue(1)

        const result = await getAvailabilityRulesByDay(1)

        expect(result).toEqual([
            {
                id: 'rule-1',
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '12:00',
                capacitySlots: 2,
                createdAt: new Date('2026-03-20T10:00:00.000Z'),
                updatedAt: new Date('2026-03-20T10:00:00.000Z'),
            },
        ])
    })

    it('returns a single availability rule by id when authorized', async () => {
        mocks.getSession.mockResolvedValue({
            isAuthenticated: true,
            userId: 'user-1',
            authz: { role: 'customer' },
        })

        mocks.prisma.availabilityRule.findFirst.mockResolvedValue({
            id: 'rule-1',
            dayOfWeek: 2,
            startTime: '10:00',
            endTime: '14:00',
            capacitySlots: 3,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
        })

        await expect(getAvailabilityRuleById('rule-1')).resolves.toEqual({
            id: 'rule-1',
            dayOfWeek: 2,
            startTime: '10:00',
            endTime: '14:00',
            capacitySlots: 3,
            createdAt: new Date('2026-03-20T10:00:00.000Z'),
            updatedAt: new Date('2026-03-20T10:00:00.000Z'),
        })
    })
})
