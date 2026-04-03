import { PlatformFailureTable } from '@/components/platform/platform-failure-table'
import { PlatformPageHeader } from '@/components/platform/platform-page-header'
import { PlatformWebhookDiagnostics } from '@/components/platform/platform-webhook-diagnostics'
import { PlatformWebhookPanel } from '@/components/platform/platform-webhook-panel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getWebhookMonitorState } from '@/lib/fetchers/platform.fetchers'

import { PlatformActionsClient } from './platform-actions.client'

export async function PlatformWebhookMonitorFeature() {
    const overview = await getWebhookMonitorState()
    const recentFailures = [
        ...overview.stripe.recentFailures,
        ...overview.clerk.recentFailures,
    ].sort((left, right) => Date.parse(right.processedAt) - Date.parse(left.processedAt))

    return (
        <div className="space-y-6">
            <PlatformPageHeader
                title="Webhook monitor"
                description="Protect checkout, auth, and preview automations by quickly diagnosing webhook failures and restoring flow reliability."
            />

            <PlatformWebhookPanel overview={overview} />
            <PlatformWebhookDiagnostics overview={overview} />

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle>Recent webhook failures</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Diagnostic view for Stripe and Clerk failures.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlatformFailureTable failures={recentFailures} />
                </CardContent>
            </Card>

            <PlatformActionsClient overview={overview} />
        </div>
    )
}
