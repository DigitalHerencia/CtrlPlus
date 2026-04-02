import { applyCredit } from '@/lib/actions/billing.actions'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound } from 'next/navigation'

import { InvoiceAdjustFormClient } from './invoice-adjust-form.client'

interface InvoiceAdjustPageFeatureProps {
    invoiceId: string
}

export async function InvoiceAdjustPageFeature({ invoiceId }: InvoiceAdjustPageFeatureProps) {
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-neutral-100">Adjust {invoice.id}</h1>
            <InvoiceAdjustFormClient invoiceId={invoice.id} onAdjust={applyCredit} />
        </div>
    )
}
