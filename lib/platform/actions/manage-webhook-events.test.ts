import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    requirePlatformDeveloperAdmin: vi.fn(),
    processStripeWebhookEvent: vi.fn(),
    revalidatePath: vi.fn(),
    prisma: {
        clerkWebhookEvent: {
            updateMany: vi.fn(),
        },
        stripeWebhookEvent: {
            updateMany: vi.fn(),
            findMany: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

vi.mock('@/lib/authz/guards', () => ({
    requirePlatformDeveloperAdmin: mocks.requirePlatformDeveloperAdmin,
}))

vi.mock('@/lib/billing/actions/process-stripe-webhook-event', () => ({
    processStripeWebhookEvent: mocks.processStripeWebhookEvent,
}))

vi.mock('next/cache', () => ({
    revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/prisma', () => ({
    prisma: mocks.prisma,
}))

import {
    clearStuckWebhookProcessingEvents,
    replayStripeWebhookFailures,
} from './manage-webhook-events'

describe('manage-webhook-events', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.requirePlatformDeveloperAdmin.mockResolvedValue({ userId: 'user_123' })
        mocks.prisma.$transaction.mockImplementation(async (operations: unknown[]) => Promise.all(operations as Promise<unknown>[]))
        mocks.prisma.auditLog.create.mockResolvedValue({})
    })

    it('clears stale processing locks and records an audit entry', async () => {
        mocks.prisma.clerkWebhookEvent.updateMany.mockResolvedValue({ count: 2 })
        mocks.prisma.stripeWebhookEvent.updateMany.mockResolvedValue({ count: 3 })

        const result = await clearStuckWebhookProcessingEvents()

        expect(result).toEqual({
            affectedCount: 5,
            clerkAffectedCount: 2,
            stripeAffectedCount: 3,
        })
        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    userId: 'user_123',
                    action: 'PLATFORM_WEBHOOK_STALE_LOCKS_CLEARED',
                }),
            })
        )
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/platform')
    })

    it('replays replayable Stripe failures and reports non-replayable rows', async () => {
        mocks.prisma.stripeWebhookEvent.findMany.mockResolvedValue([
            {
                id: 'evt_replay',
                type: 'checkout.session.completed',
                payload: {
                    id: 'evt_replay',
                    type: 'checkout.session.completed',
                    data: { object: {} },
                },
            },
            {
                id: 'evt_legacy',
                type: 'checkout.session.completed',
                payload: null,
            },
        ])
        mocks.processStripeWebhookEvent.mockResolvedValue({
            kind: 'processed',
            result: {
                invoiceId: 'inv_123',
                paymentId: 'pay_123',
                status: 'succeeded',
            },
        })

        const result = await replayStripeWebhookFailures({
            eventIds: ['evt_replay', 'evt_legacy', 'evt_missing'],
        })

        expect(result).toEqual({
            requestedCount: 3,
            replayedCount: 1,
            ignoredCount: 0,
            nonReplayableCount: 1,
            failedCount: 1,
        })
        expect(mocks.processStripeWebhookEvent).toHaveBeenCalledTimes(1)
        expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    userId: 'user_123',
                    action: 'PLATFORM_STRIPE_WEBHOOK_REPLAY_REQUESTED',
                }),
            })
        )
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/platform')
    })
})
