import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    clearStuckWebhookProcessingEvents: vi.fn(),
    replayStripeWebhookFailures: vi.fn(),
    refresh: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        refresh: mocks.refresh,
    }),
}))

vi.mock('@/lib/actions/platform.actions', () => ({
    clearStuckWebhookProcessingEvents: mocks.clearStuckWebhookProcessingEvents,
    replayStripeWebhookFailures: mocks.replayStripeWebhookFailures,
}))

import { PlatformRecoveryActionsClient } from '@/features/platform/platform-recovery-actions-client'

describe('PlatformRecoveryActionsClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('runs stale-lock cleanup and shows the success summary', async () => {
        mocks.clearStuckWebhookProcessingEvents.mockResolvedValue({
            affectedCount: 3,
            clerkAffectedCount: 1,
            stripeAffectedCount: 2,
        })

        render(
            <PlatformRecoveryActionsClient
                clerkFailedCount={2}
                staleThresholdMinutes={5}
                staleProcessingCounts={{ clerk: 1, stripe: 2 }}
                stripeFailedCount={4}
                stripeNonReplayableCount={1}
                stripeReplayableIds={['evt_1']}
                stripeReplayableCount={1}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: 'Clear stale processing' }))

        await waitFor(() => expect(mocks.clearStuckWebhookProcessingEvents).toHaveBeenCalled())
        await expect(
            screen.findByText(
                /Released 3 stale processing locks across Clerk \(1\) and Stripe \(2\)\./
            )
        ).resolves.toBeVisible()
        expect(mocks.refresh).toHaveBeenCalled()
    })

    it('replays Stripe failures and forwards the selected ids', async () => {
        mocks.replayStripeWebhookFailures.mockResolvedValue({
            requestedCount: 2,
            replayedCount: 1,
            ignoredCount: 0,
            nonReplayableCount: 1,
            failedCount: 0,
        })

        render(
            <PlatformRecoveryActionsClient
                clerkFailedCount={0}
                staleThresholdMinutes={5}
                staleProcessingCounts={{ clerk: 0, stripe: 0 }}
                stripeFailedCount={2}
                stripeNonReplayableCount={1}
                stripeReplayableIds={['evt_1', 'evt_2']}
                stripeReplayableCount={2}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: 'Replay Stripe failures' }))

        await waitFor(() =>
            expect(mocks.replayStripeWebhookFailures).toHaveBeenCalledWith({
                eventIds: ['evt_1', 'evt_2'],
            })
        )
        await expect(
            screen.findByText(
                /Stripe replay finished: 1 replayed, 0 ignored, 1 non-replayable, 0 failed\./
            )
        ).resolves.toBeVisible()
    })

    it('disables replay when no Stripe failures are replayable', () => {
        render(
            <PlatformRecoveryActionsClient
                clerkFailedCount={1}
                staleThresholdMinutes={5}
                staleProcessingCounts={{ clerk: 0, stripe: 0 }}
                stripeFailedCount={1}
                stripeNonReplayableCount={1}
                stripeReplayableIds={[]}
                stripeReplayableCount={0}
            />
        )

        expect(screen.getByRole('button', { name: 'Replay Stripe failures' })).toBeDisabled()
        expect(screen.getByText(/Platform remains diagnostic-first for Clerk/)).toBeVisible()
    })
})
