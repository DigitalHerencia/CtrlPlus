import { InvoiceActionPageShell } from '@/components/billing/invoice-action-page-shell'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound, redirect } from 'next/navigation'

import { InvoiceRefundFormClient } from './invoice-refund-form.client'

interface InvoiceRefundPageFeatureProps {
    params: Promise<{ invoiceId: string }>
}

export async function InvoiceRefundPageFeature({ params }: InvoiceRefundPageFeatureProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    const { invoiceId } = await params

    if (!hasCapability(session.authz, 'billing.write.all')) {
        redirect(`/billing/manage/${invoiceId}`)
    }

    const invoice = (await getInvoice(invoiceId)) ?? notFound()

    return (
        <InvoiceActionPageShell
            title={`Refund Invoice ${invoice.id}`}
            description="Issue a controlled refund while preserving full audit clarity and a premium customer experience."
            backHref={`/billing/${invoice.id}`}
            backLabel="Back to Invoice"
            navTitle="Refund Navigation"
            navDescription="Return to invoice detail"
        >
            <InvoiceRefundFormClient invoiceId={invoice.id} />
        </InvoiceActionPageShell>
    )
}
