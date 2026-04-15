
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { WebhookOperationsOverviewDTO } from '@/types/platform.types'

interface PlatformWebhookDiagnosticsProps {
    overview: WebhookOperationsOverviewDTO
}


export function PlatformWebhookDiagnostics({ overview }: PlatformWebhookDiagnosticsProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {[
                {
                    title: 'Stripe webhook operations',
                    description:
                        'Platform-owned replay is available only when the verified payload was stored.',
                    metrics: [
                        {
                            label: 'Processed',
                            value: overview.stripe.processed,
                            tone: 'default' as const,
                        },
                        {
                            label: 'Failed',
                            value: overview.stripe.failed,
                            tone:
                                overview.stripe.failed > 0
                                    ? ('destructive' as const)
                                    : ('default' as const),
                        },
                        {
                            label: 'Processing',
                            value: overview.stripe.processing,
                            tone: 'default' as const,
                        },
                        {
                            label: 'Stale',
                            value: overview.stripe.staleProcessing,
                            tone:
                                overview.stripe.staleProcessing > 0
                                    ? ('destructive' as const)
                                    : ('secondary' as const),
                        },
                        {
                            label: 'Replayable in current snapshot',
                            value: overview.stripe.replayableRecentFailures,
                            tone: 'secondary' as const,
                        },
                        {
                            label: 'Non-replayable in current snapshot',
                            value: overview.stripe.nonReplayableRecentFailures,
                            tone: 'secondary' as const,
                        },
                    ],
                },
                {
                    title: 'Clerk webhook diagnostics',
                    description:
                        'Failures remain visible here, but replay stays owned by auth/authz in this pass.',
                    metrics: [
                        {
                            label: 'Processed',
                            value: overview.clerk.processed,
                            tone: 'default' as const,
                        },
                        {
                            label: 'Failed',
                            value: overview.clerk.failed,
                            tone:
                                overview.clerk.failed > 0
                                    ? ('destructive' as const)
                                    : ('default' as const),
                        },
                        {
                            label: 'Processing',
                            value: overview.clerk.processing,
                            tone: 'default' as const,
                        },
                        {
                            label: 'Stale',
                            value: overview.clerk.staleProcessing,
                            tone:
                                overview.clerk.staleProcessing > 0
                                    ? ('destructive' as const)
                                    : ('secondary' as const),
                        },
                    ],
                },
            ].map((section) => (
                <Card
                    key={section.title}
                    className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
                >
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription className="text-neutral-400">
                            {section.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {section.metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="border border-neutral-800 bg-neutral-900/60 p-3"
                            >
                                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                    {metric.label}
                                </p>
                                <div className="mt-2">
                                    <Badge variant={metric.tone}>{metric.value}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
