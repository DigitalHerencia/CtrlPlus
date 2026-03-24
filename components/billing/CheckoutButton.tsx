'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'

interface CheckoutSessionResult {
    url: string
}

interface CheckoutButtonProps {
    onCheckout: () => Promise<CheckoutSessionResult>
    disabled?: boolean
    actionLabel?: string
    pendingLabel?: string
}

export function CheckoutButton({
    onCheckout,
    disabled,
    actionLabel = 'Pay with Stripe',
    pendingLabel = 'Redirecting…',
}: CheckoutButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function handleCheckout() {
        setError(null)
        startTransition(async () => {
            try {
                const result = await onCheckout()
                window.location.href = result.url
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.')
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleCheckout}
                disabled={disabled || isPending}
                className="w-full sm:w-auto"
            >
                {isPending ? pendingLabel : actionLabel}
            </Button>
            {error && <p className="text-sm text-neutral-100">{error}</p>}
        </div>
    )
}
