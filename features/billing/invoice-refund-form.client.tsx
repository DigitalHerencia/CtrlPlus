'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { InvoiceAdjustmentFields } from '@/components/billing/invoice-form/invoice-adjustment-fields'
import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { refundInvoice } from '@/lib/actions/billing.actions'
import { refundInvoiceSchema } from '@/schemas/billing.schemas'
import type { z } from 'zod'

type RefundInvoiceInput = z.infer<typeof refundInvoiceSchema>

interface InvoiceRefundFormClientProps {
    invoiceId: string
}

/**
 * InvoiceRefundFormClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceRefundFormClient({ invoiceId }: InvoiceRefundFormClientProps) {
    const [isPending, startTransition] = useTransition()
    const form = useForm<RefundInvoiceInput>({
        mode: 'onSubmit',
        resolver: zodResolver(refundInvoiceSchema),
        defaultValues: {
            invoiceId,
            amount: 100,
            notes: '',
        },
    })
    const amount = useWatch({ control: form.control, name: 'amount' })
    const notes = useWatch({ control: form.control, name: 'notes' })

    function onSubmit(values: RefundInvoiceInput) {
        form.clearErrors()
        startTransition(async () => {
            try {
                await refundInvoice(values)
                form.reset()
            } catch (error) {
                form.setError('root', {
                    type: 'server',
                    message: error instanceof Error ? error.message : 'Unable to issue refund.',
                })
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <InvoiceFormShell title="Refund Invoice">
                {form.formState.errors.root ? (
                    <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
                ) : null}
                <InvoiceAdjustmentFields
                    amount={amount ?? 100}
                    notes={notes ?? ''}
                    onAmountChange={(value) =>
                        form.setValue('amount', value, { shouldValidate: true })
                    }
                    onNotesChange={(value) =>
                        form.setValue('notes', value, { shouldValidate: true })
                    }
                />
                <InvoiceFormActions submitLabel="Issue Refund" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
