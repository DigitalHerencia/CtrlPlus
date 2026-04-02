import { applyCredit } from '@/lib/actions/billing.actions'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoiceEditorFormClient } from './invoice-editor-form.client'

interface EditInvoicePageFeatureProps {
    invoiceId: string
}

export async function EditInvoicePageFeature({ invoiceId }: EditInvoicePageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    async function onSubmitInvoice(input: { bookingId: string }) {
        'use server'
        return applyCredit({
            invoiceId,
            amount: 0,
            notes: `Edited from booking ${input.bookingId}`,
        })
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-neutral-100">Edit Invoice {invoice.id}</h1>
            <InvoiceEditorFormClient
                initialBookingId={invoice.bookingId}
                submitLabel="Save Changes"
                onSubmitInvoice={onSubmitInvoice}
            />
        </div>
    )
}
