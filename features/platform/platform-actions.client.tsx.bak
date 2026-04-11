'use client'

import { PlatformRecoveryActionsClient } from '@/features/platform/platform-recovery-actions-client'
import type { WebhookOperationsOverviewDTO } from '@/types/platform.types'

interface PlatformActionsClientProps {
    overview: WebhookOperationsOverviewDTO
}

export function PlatformActionsClient({ overview }: PlatformActionsClientProps) {
    const stripeReplayableIds = overview.stripe.recentFailures
        .filter((failure) => failure.canReplay)
        .map((failure) => failure.id)

    return (
        <PlatformRecoveryActionsClient
            clerkFailedCount={overview.clerk.failed}
            staleThresholdMinutes={overview.staleThresholdMinutes}
            staleProcessingCounts={{
                clerk: overview.clerk.staleProcessing,
                stripe: overview.stripe.staleProcessing,
            }}
            stripeFailedCount={overview.stripe.failed}
            stripeNonReplayableCount={overview.stripe.nonReplayableRecentFailures}
            stripeReplayableIds={stripeReplayableIds}
            stripeReplayableCount={overview.stripe.replayableRecentFailures}
        />
    )
}
