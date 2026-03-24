import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlatformFailureTable } from '@/components/platform/platform-failure-table'
import { PlatformHealthOverview } from '@/components/platform/platform-health-overview'
import { PlatformWebhookDiagnostics } from '@/components/platform/platform-webhook-diagnostics'
import { getPlatformStatusOverview } from '@/lib/platform/fetchers/get-platform-status-overview'
import { getWebhookOperationsOverview } from '@/lib/platform/fetchers/get-webhook-operations-overview'

import { PlatformRecoveryActionsClient } from './platform-recovery-actions-client'

export async function PlatformPageFeature() {
    const [overview, platformStatus] = await Promise.all([
        getWebhookOperationsOverview(),
        getPlatformStatusOverview(),
    ])

    const recentFailures = [...overview.stripe.recentFailures, ...overview.clerk.recentFailures].sort(
        (left, right) => Date.parse(right.processedAt) - Date.parse(left.processedAt)
    )

    const stripeReplayableIds = overview.stripe.recentFailures
        .filter((failure) => failure.canReplay)
        .map((failure) => failure.id)

    return (
        <div className="space-y-8" aria-label="Platform dashboard">
            <WorkspacePageIntro
                label="Platform"
                title="Admin Console"
                description="Monitor platform health, inspect webhook failures, and run auditable recovery actions from a single operational surface."
                detail={
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                            Recent failures in snapshot
                        </p>
                        <p className="text-3xl font-black text-neutral-100">{recentFailures.length}</p>
                    </div>
                }
            />

            <PlatformHealthOverview status={platformStatus} />
            <PlatformWebhookDiagnostics overview={overview} />

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle>Recent webhook failures</CardTitle>
                    <CardDescription className="text-neutral-400">
                        The table below is diagnostic-first. Replay is available only for Stripe failures with stored verified payloads.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlatformFailureTable failures={recentFailures} />
                </CardContent>
            </Card>

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
        </div>
    )
}
