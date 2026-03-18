'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'
import {
    clearStuckWebhookProcessingEvents,
    resetFailedWebhookLocks,
} from '@/lib/platform/actions/manage-webhook-events'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { type UseFormReturn, useForm } from 'react-hook-form'

type RecoveryTarget = 'clerk' | 'stripe'

interface ResetWebhookFormValues {
    source: RecoveryTarget
    eventIds: string[]
}

interface ClearWebhookFormValues {
    confirm: true
}

interface PlatformRecoveryActionsProps {
    clerkFailureIds: string[]
    stripeFailureIds: string[]
    clerkFailureCount: number
    stripeFailureCount: number
    staleProcessingCount: number
}

export function PlatformRecoveryActions({
    clerkFailureIds,
    stripeFailureIds,
    clerkFailureCount,
    stripeFailureCount,
    staleProcessingCount,
}: PlatformRecoveryActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const clearForm = useForm<ClearWebhookFormValues>({
        defaultValues: {
            confirm: true,
        },
    })
    const clerkResetForm = useForm<ResetWebhookFormValues>({
        defaultValues: {
            source: 'clerk',
            eventIds: clerkFailureIds,
        },
    })
    const stripeResetForm = useForm<ResetWebhookFormValues>({
        defaultValues: {
            source: 'stripe',
            eventIds: stripeFailureIds,
        },
    })

    function runMutation(task: () => Promise<string>) {
        setErrorMessage(null)
        setStatusMessage(null)

        startTransition(async () => {
            try {
                const message = await task()
                setStatusMessage(message)
                router.refresh()
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : 'Maintenance action failed.'
                )
            }
        })
    }

    const handleClearLocks = clearForm.handleSubmit(() => {
        runMutation(async () => {
            const result = await clearStuckWebhookProcessingEvents()
            return `Released ${result.affectedCount} stale processing lock${result.affectedCount === 1 ? '' : 's'}.`
        })
    })

    const handleResetLocks = (form: UseFormReturn<ResetWebhookFormValues>, label: string) =>
        form.handleSubmit((values) => {
            if (values.eventIds.length === 0) {
                form.setError('root.server', {
                    type: 'manual',
                    message: `No failed ${label.toLowerCase()} events are currently queued for reset.`,
                })
                return
            }

            form.clearErrors()
            runMutation(async () => {
                const result = await resetFailedWebhookLocks(values)
                return `Reset ${result.affectedCount} ${label.toLowerCase()} failure lock${result.affectedCount === 1 ? '' : 's'}.`
            })
        })

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Clear stale processing locks</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Marks hung webhook rows as failed so they can be replayed safely.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-neutral-400">
                            Currently tracking{' '}
                            <span className="text-neutral-100">{staleProcessingCount}</span> stale
                            processing lock{staleProcessingCount === 1 ? '' : 's'}.
                        </p>
                        <form onSubmit={handleClearLocks}>
                            <Button
                                type="submit"
                                disabled={isPending || staleProcessingCount === 0}
                            >
                                {isPending ? 'Running...' : 'Clear stale locks'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Reset Clerk failures</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Re-open failed Clerk webhook records for another controlled replay
                            cycle.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-neutral-400">
                            <span className="text-neutral-100">{clerkFailureCount}</span> failed
                            Clerk webhook event{clerkFailureCount === 1 ? '' : 's'} in the current
                            snapshot.
                        </p>
                        <form onSubmit={handleResetLocks(clerkResetForm, 'Clerk')}>
                            <Button
                                type="submit"
                                disabled={isPending || clerkFailureIds.length === 0}
                                className="mt-6"
                            >
                                {isPending ? 'Running...' : 'Reset Clerk failures'}
                            </Button>
                            <FieldError>
                                {clerkResetForm.formState.errors.root?.server?.message}
                            </FieldError>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Reset Stripe failures</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Re-open failed Stripe webhook records for another controlled replay
                            cycle.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-neutral-400">
                            <span className="text-neutral-100">{stripeFailureCount}</span> failed
                            Stripe webhook event{stripeFailureCount === 1 ? '' : 's'} in the current
                            snapshot.
                        </p>
                        <form onSubmit={handleResetLocks(stripeResetForm, 'Stripe')}>
                            <Button
                                type="submit"
                                disabled={isPending || stripeFailureIds.length === 0}
                            >
                                {isPending ? 'Running...' : 'Reset Stripe failures'}
                            </Button>
                            <FieldError>
                                {stripeResetForm.formState.errors.root?.server?.message}
                            </FieldError>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {statusMessage ? <p className="text-sm text-blue-400">{statusMessage}</p> : null}
            {errorMessage ? <p className="text-sm text-neutral-100">{errorMessage}</p> : null}
        </div>
    )
}
