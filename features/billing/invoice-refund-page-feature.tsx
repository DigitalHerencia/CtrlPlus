import { refundInvoice } from '@/lib/actions/billing.actions'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoiceRefundFormClient } from './invoice-refund-form.client'

interface InvoiceRefundPageFeatureProps {
    invoiceId: string
}

export async function InvoiceRefundPageFeature({ invoiceId }: InvoiceRefundPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-neutral-100">Refund {invoice.id}</h1>
            <InvoiceRefundFormClient invoiceId={invoice.id} onRefund={refundInvoice} />
        </div>
    )
}
