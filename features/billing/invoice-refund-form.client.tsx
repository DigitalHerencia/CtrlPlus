'use client'

import { useState, useTransition } from 'react'

import { InvoiceAdjustmentFields } from '@/components/billing/invoice-form/invoice-adjustment-fields'
import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'

interface InvoiceRefundFormClientProps {
    invoiceId: string
    onRefund: (input: { invoiceId: string; amount: number; notes?: string }) => Promise<unknown>
}

export function InvoiceRefundFormClient({ invoiceId, onRefund }: InvoiceRefundFormClientProps) {
    const [amount, setAmount] = useState(100)
    const [notes, setNotes] = useState('')
    const [isPending, startTransition] = useTransition()

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        startTransition(async () => {
            await onRefund({ invoiceId, amount, notes: notes || undefined })
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <InvoiceFormShell title="Refund Invoice">
                <InvoiceAdjustmentFields
                    amount={amount}
                    notes={notes}
                    onAmountChange={setAmount}
                    onNotesChange={setNotes}
                />
                <InvoiceFormActions submitLabel="Issue Refund" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
