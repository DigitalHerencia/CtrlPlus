/**
 * @introduction Components — TODO: short one-line summary of platform-webhook-panel.tsx
 *
 * @description TODO: longer description for platform-webhook-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { WebhookOperationsOverviewDTO } from '@/types/platform.types'

interface PlatformWebhookPanelProps {
    overview: WebhookOperationsOverviewDTO
}

/**
 * PlatformWebhookPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PlatformWebhookPanel({ overview }: PlatformWebhookPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Webhook monitor</CardTitle>
                <CardDescription className="text-neutral-400">
                    Provider failures, stale processing locks, and recovery-readiness snapshots.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="border border-neutral-800 bg-neutral-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        Stripe failed
                    </p>
                    <p className="mt-2 text-xl font-semibold text-neutral-100">
                        {overview.stripe.failed}
                    </p>
                </div>
                <div className="border border-neutral-800 bg-neutral-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        Clerk failed
                    </p>
                    <p className="mt-2 text-xl font-semibold text-neutral-100">
                        {overview.clerk.failed}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
