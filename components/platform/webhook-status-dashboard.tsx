import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getWebhookOperationsOverview } from '@/lib/platform/fetchers/get-webhook-operations-overview'
import { getStripeWebhookStatus } from '@/lib/platform/fetchers/get-webhook-status'
import { WebhookFailureDTO } from '@/lib/platform/types'
import { PlatformMaintenanceActions } from './platform-maintenance-actions'
import { PlatformRecoveryActions } from './platform-recovery-actions'

export async function WebhookStatusDashboard() {
    // Fetch status and failures (SSR)
    const [stripeStatus, webhookOverview] = await Promise.all([
        getStripeWebhookStatus(),
        getWebhookOperationsOverview(),
    ])

    // Example: show Stripe failures, queue, last success/failure, and recovery tools
    return (
        <div className="max-w-6xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Webhook System Status</CardTitle>
                    <CardDescription>
                        Stripe and Clerk webhook event processing health, failures, and retry queue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <div className="font-semibold">Stripe Failures</div>
                            <Badge
                                variant={stripeStatus.failureCount > 0 ? 'destructive' : 'default'}
                            >
                                {stripeStatus.failureCount}
                            </Badge>
                        </div>
                        <div>
                            <div className="font-semibold">Stripe Retry Queue</div>
                            <Badge>{stripeStatus.queueLength}</Badge>
                        </div>
                        <div>
                            <div className="font-semibold">Last Stripe Failure</div>
                            <span>
                                {stripeStatus.lastFailure?.processedAt
                                    ? new Date(
                                          stripeStatus.lastFailure.processedAt
                                      ).toLocaleString()
                                    : '—'}
                            </span>
                        </div>
                        <div>
                            <div className="font-semibold">Last Stripe Success</div>
                            <span>
                                {stripeStatus.lastSuccess?.processedAt
                                    ? new Date(
                                          stripeStatus.lastSuccess.processedAt
                                      ).toLocaleString()
                                    : '—'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Recent Webhook Failures</CardTitle>
                    <CardDescription>
                        Failed events are eligible for manual retry or dismissal. Use recovery tools
                        below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Table of recent failures (Stripe + Clerk) */}
                    {/* ...implementation would map webhookOverview.stripeRecentFailures, clerkRecentFailures... */}
                </CardContent>
            </Card>

            <Separator />

            {/* Recovery and maintenance actions */}
            <PlatformRecoveryActions
                clerkFailureIds={webhookOverview.clerk.recentFailures.map(
                    (f: WebhookFailureDTO) => f.id
                )}
                stripeFailureIds={webhookOverview.stripe.recentFailures.map(
                    (f: WebhookFailureDTO) => f.id
                )}
                clerkFailureCount={webhookOverview.clerk.failed}
                stripeFailureCount={webhookOverview.stripe.failed}
                staleProcessingCount={
                    webhookOverview.clerk.staleProcessing + webhookOverview.stripe.staleProcessing
                }
            />
            <PlatformMaintenanceActions
                clerkFailureIds={webhookOverview.clerk.recentFailures.map(
                    (f: WebhookFailureDTO) => f.id
                )}
                stripeFailureIds={webhookOverview.stripe.recentFailures.map(
                    (f: WebhookFailureDTO) => f.id
                )}
            />
        </div>
    )
}
