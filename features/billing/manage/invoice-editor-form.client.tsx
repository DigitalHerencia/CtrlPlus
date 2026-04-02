'use client'

import { useState, useTransition } from 'react'

import { InvoiceFormActions } from '@/components/billing/invoice-form/invoice-form-actions'
import { InvoiceFormFields } from '@/components/billing/invoice-form/invoice-form-fields'
import { InvoiceFormShell } from '@/components/billing/invoice-form/invoice-form-shell'

interface InvoiceEditorFormClientProps {
    initialBookingId?: string
    submitLabel: string
    onSubmitInvoice: (input: { bookingId: string }) => Promise<unknown>
}

export function InvoiceEditorFormClient({
    initialBookingId = '',
    submitLabel,
    onSubmitInvoice,
}: InvoiceEditorFormClientProps) {
    const [bookingId, setBookingId] = useState(initialBookingId)
    const [isPending, startTransition] = useTransition()

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        startTransition(async () => {
            await onSubmitInvoice({ bookingId })
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <InvoiceFormShell
                title="Invoice Editor"
                description="Issue an invoice from booking context."
            >
                <InvoiceFormFields bookingId={bookingId} onBookingIdChange={setBookingId} />
                <InvoiceFormActions submitLabel={submitLabel} isPending={isPending} />
            </InvoiceFormShell>
        </form>
    )
}
