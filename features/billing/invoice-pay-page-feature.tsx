import { InvoiceActionPageShell } from '@/components/billing/invoice-action-page-shell'
import { getSession } from '@/lib/auth/session'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound, redirect } from 'next/navigation'

import { InvoicePayFormClient } from './invoice-pay-form.client'

interface InvoicePayPageFeatureProps {
    params: Promise<{ invoiceId: string }>
}

export async function InvoicePayPageFeature({ params }: InvoicePayPageFeatureProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params
    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <InvoiceActionPageShell
            title={`Pay Invoice ${invoice.id}`}
            description="Complete this payment securely to keep your wrap project moving on schedule."
            backHref={`/billing/${invoice.id}`}
            backLabel="Back to Invoice"
            navTitle="Payment Navigation"
            navDescription="Return to invoice detail"
        >
            <InvoicePayFormClient invoiceId={invoice.id} />
        </InvoiceActionPageShell>
    )
}
