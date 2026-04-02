'use client'

import { useState, useTransition } from 'react'

import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'

interface InvoicePayFormClientProps {
    invoiceId: string
    processPaymentAction: (input: { invoiceId: string }) => Promise<{ url: string }>
}

export function InvoicePayFormClient({
    invoiceId,
    processPaymentAction,
}: InvoicePayFormClientProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        startTransition(async () => {
            try {
                const result = await processPaymentAction({ invoiceId })
                window.location.href = result.url
            } catch (submitError) {
                setError(
                    submitError instanceof Error
                        ? submitError.message
                        : 'Unable to start payment session.'
                )
            }
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <InvoiceFormShell
                title="Pay Invoice"
                description="You will be redirected to Stripe Checkout."
            >
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
                <InvoiceFormActions submitLabel="Continue to Stripe" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
