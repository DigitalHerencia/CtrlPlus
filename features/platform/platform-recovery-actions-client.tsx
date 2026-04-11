'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { RefreshCcw, RotateCcw, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    clearStuckWebhookProcessingEvents,
    replayStripeWebhookFailures,
} from '@/lib/actions/platform.actions'

interface PlatformRecoveryActionsClientProps {
    clerkFailedCount: number
    staleThresholdMinutes: number
    staleProcessingCounts: {
        clerk: number
        stripe: number
    }
    stripeFailedCount: number
    stripeNonReplayableCount: number
    stripeReplayableIds: string[]
    stripeReplayableCount: number
}

/**
 * PlatformRecoveryActionsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function PlatformRecoveryActionsClient({
    clerkFailedCount,
    staleThresholdMinutes,
    staleProcessingCounts,
    stripeFailedCount,
    stripeNonReplayableCount,
    stripeReplayableIds,
    stripeReplayableCount,
}: PlatformRecoveryActionsClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const staleTotal = staleProcessingCounts.clerk + staleProcessingCounts.stripe

    function runMutation(task: () => Promise<string>) {
        setStatusMessage(null)
        setErrorMessage(null)

        startTransition(async () => {
            try {
                const message = await task()
                setStatusMessage(message)
                router.refresh()
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : 'Platform recovery action failed.'
                )
            }
        })
    }

    function handleClearStaleProcessing() {
        runMutation(async () => {
            const result = await clearStuckWebhookProcessingEvents()
            return `Released ${result.affectedCount} stale processing lock${result.affectedCount === 1 ? '' : 's'} across Clerk (${result.clerkAffectedCount}) and Stripe (${result.stripeAffectedCount}).`
        })
    }

    function handleReplayStripeFailures() {
        runMutation(async () => {
            const result = await replayStripeWebhookFailures({ eventIds: stripeReplayableIds })
            return `Stripe replay finished: ${result.replayedCount} replayed, ${result.ignoredCount} ignored, ${result.nonReplayableCount} non-replayable, ${result.failedCount} failed.`
        })
    }

    return (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))]">
            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle>Clear stale processing locks</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Mark processing rows older than {staleThresholdMinutes} minutes as failed so
                        recovery can resume on the next controlled attempt.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="border border-neutral-800 bg-neutral-900/60 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                Clerk stale
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-neutral-100">
                                {staleProcessingCounts.clerk}
                            </p>
                        </div>
                        <div className="border border-neutral-800 bg-neutral-900/60 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                                Stripe stale
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-neutral-100">
                                {staleProcessingCounts.stripe}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        disabled={isPending || staleTotal === 0}
                        onClick={handleClearStaleProcessing}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        {isPending ? 'Running…' : 'Clear stale processing'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle>Replay Stripe failures</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Replay only failures whose verified payload is stored. This runs the real
                        Stripe processing path and records an operator audit event.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-neutral-300">
                        <p>
                            Failed Stripe events in snapshot:{' '}
                            <span className="font-medium text-neutral-100">
                                {stripeFailedCount}
                            </span>
                        </p>
                        <p>
                            Replayable right now:{' '}
                            <span className="font-medium text-neutral-100">
                                {stripeReplayableCount}
                            </span>
                        </p>
                        <p>
                            Non-replayable right now:{' '}
                            <span className="font-medium text-neutral-100">
                                {stripeNonReplayableCount}
                            </span>
                        </p>
                    </div>
                    <Button
                        type="button"
                        disabled={isPending || stripeReplayableIds.length === 0}
                        onClick={handleReplayStripeFailures}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {isPending ? 'Running…' : 'Replay Stripe failures'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle>Clerk recovery boundary</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Platform remains diagnostic-first for Clerk. Replay stays with the
                        auth/authz domain in this pass.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-neutral-300">
                    <p>
                        Current Clerk failures in snapshot:{' '}
                        <span className="font-medium text-neutral-100">{clerkFailedCount}</span>
                    </p>
                    <div className="flex items-start gap-2 border border-neutral-800 bg-neutral-900/60 p-3">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        <p>
                            Use this dashboard to confirm scope and stale backlog. Do not interpret
                            visibility here as permission to replay Clerk identity sync events from
                            platform.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {statusMessage ? (
                <p className="text-sm text-emerald-300 xl:col-span-3">{statusMessage}</p>
            ) : null}
            {errorMessage ? (
                <p className="text-destructive text-sm xl:col-span-3">{errorMessage}</p>
            ) : null}
        </div>
    )
}
