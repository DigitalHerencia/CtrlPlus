import { processPayment } from '@/lib/actions/billing.actions'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoicePayFormClient } from './invoice-pay-form.client'

interface InvoicePayPageFeatureProps {
    invoiceId: string
}

export async function InvoicePayPageFeature({ invoiceId }: InvoicePayPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    async function processPaymentAction(input: { invoiceId: string }) {
        'use server'
        return processPayment(input)
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-neutral-100">Pay Invoice {invoice.id}</h1>
            <InvoicePayFormClient
                invoiceId={invoice.id}
                processPaymentAction={processPaymentAction}
            />
        </div>
    )
}
