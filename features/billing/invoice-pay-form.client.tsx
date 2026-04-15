'use client'


import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { processPayment } from '@/lib/actions/billing.actions'
import { processPaymentSchema } from '@/schemas/billing.schemas'
import type { z } from 'zod'

type ProcessPaymentInput = z.infer<typeof processPaymentSchema>

interface InvoicePayFormClientProps {
    invoiceId: string
}


export function InvoicePayFormClient({ invoiceId }: InvoicePayFormClientProps) {
    const [isPending, startTransition] = useTransition()
    const form = useForm<ProcessPaymentInput>({
        mode: 'onSubmit',
        resolver: zodResolver(processPaymentSchema),
        defaultValues: {
            invoiceId,
        },
    })

    function onSubmit(values: ProcessPaymentInput) {
        form.clearErrors()
        startTransition(async () => {
            try {
                const result = await processPayment(values)
                window.location.href = result.url
            } catch (error) {
                form.setError('root', {
                    type: 'server',
                    message:
                        error instanceof Error ? error.message : 'Unable to start payment session.',
                })
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <InvoiceFormShell
                title="Pay Invoice"
                description="You will be redirected to Stripe Checkout."
            >
                {form.formState.errors.root ? (
                    <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
                ) : null}
                <InvoiceFormActions submitLabel="Continue to Stripe" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
