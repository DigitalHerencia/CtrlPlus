'use client'


import { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InvoiceAdjustmentFields } from '@/components/billing/invoice-form/invoice-adjustment-fields'
import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { applyCredit } from '@/lib/actions/billing.actions'
import { applyCreditSchema } from '@/schemas/billing.schemas'
import type { z } from 'zod'

type ApplyCreditInput = z.infer<typeof applyCreditSchema>

interface InvoiceAdjustFormClientProps {
    invoiceId: string
}


export function InvoiceAdjustFormClient({ invoiceId }: InvoiceAdjustFormClientProps) {
    const [isPending, startTransition] = useTransition()
    const form = useForm<ApplyCreditInput>({
        mode: 'onSubmit',
        resolver: zodResolver(applyCreditSchema),
        defaultValues: {
            invoiceId,
            amount: 100,
            notes: '',
        },
    })
    const amount = useWatch({ control: form.control, name: 'amount' })
    const notes = useWatch({ control: form.control, name: 'notes' })

    function onSubmit(values: ApplyCreditInput) {
        form.clearErrors()
        startTransition(async () => {
            try {
                await applyCredit(values)
                form.reset()
            } catch (error) {
                form.setError('root', {
                    type: 'server',
                    message: error instanceof Error ? error.message : 'Unable to apply credit.',
                })
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <InvoiceFormShell title="Apply Credit / Adjustment">
                {form.formState.errors.root ? (
                    <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
                ) : null}
                <InvoiceAdjustmentFields
                    amount={amount}
                    notes={notes ?? ''}
                    onAmountChange={(value) =>
                        form.setValue('amount', value, { shouldValidate: true })
                    }
                    onNotesChange={(value) =>
                        form.setValue('notes', value, { shouldValidate: true })
                    }
                />
                <InvoiceFormActions submitLabel="Apply Credit" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
