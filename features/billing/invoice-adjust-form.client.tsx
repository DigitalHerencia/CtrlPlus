'use client'

import { useState, useTransition } from 'react'

import { InvoiceDiscountFields } from '@/components/billing/invoice-form/invoice-discount-fields'
import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'
import { InvoiceNotificationFields } from '@/components/billing/invoice-form/invoice-notification-fields'

interface InvoiceAdjustFormClientProps {
    invoiceId: string
    onAdjust: (input: { invoiceId: string; amount: number; notes?: string }) => Promise<unknown>
}

export function InvoiceAdjustFormClient({ invoiceId, onAdjust }: InvoiceAdjustFormClientProps) {
    const [amount, setAmount] = useState(100)
    const [notes, setNotes] = useState('')
    const [isPending, startTransition] = useTransition()

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        startTransition(async () => {
            await onAdjust({ invoiceId, amount, notes: notes || undefined })
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <InvoiceFormShell title="Apply Credit / Adjustment">
                <InvoiceDiscountFields amount={amount} onAmountChange={setAmount} />
                <InvoiceNotificationFields message={notes} onMessageChange={setNotes} />
                <InvoiceFormActions submitLabel="Apply Credit" isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
