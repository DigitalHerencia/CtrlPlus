import { InvoiceActionPageShell } from '@/components/billing/invoice-action-page-shell'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound, redirect } from 'next/navigation'

import { InvoiceAdjustFormClient } from './invoice-adjust-form.client'

interface InvoiceAdjustPageFeatureProps {
    params: Promise<{ invoiceId: string }>
}

export async function InvoiceAdjustPageFeature({ params }: InvoiceAdjustPageFeatureProps) {
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
            title={`Adjust Invoice ${invoice.id}`}
            description="Apply precise credits or corrections to keep project billing accurate and customer-trust intact."
            backHref={`/billing/${invoice.id}`}
            backLabel="Back to Invoice"
            navTitle="Adjustment Navigation"
            navDescription="Return to invoice detail"
        >
            <InvoiceAdjustFormClient invoiceId={invoice.id} />
        </InvoiceActionPageShell>
    )
}
