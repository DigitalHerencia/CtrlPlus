import { InvoiceDetailSummary } from '@/components/billing/invoice-detail-summary'
import { InvoiceDetailPageLayout } from '@/components/billing/invoice-detail-page-layout'
import { InvoiceLineItemsTable } from '@/components/billing/invoice-line-items-table'
import { InvoicePaymentPanel } from '@/components/billing/invoice-payment-panel'
import { InvoicePaymentHistoryPanel } from '@/components/billing/invoice-payment-history-panel'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { isInvoicePayable } from '@/lib/constants/statuses'
import { getInvoice } from '@/lib/fetchers/billing.fetchers'
import { notFound, redirect } from 'next/navigation'

import { InvoiceDetailTabsClient } from './invoice-detail-tabs.client'
import { getInvoiceStatusBadgePresentation } from './invoice-status-badge-presenter'

interface InvoiceDetailPageFeatureProps {
    params: Promise<{ invoiceId: string }>
    backPath?: string
    requireBillingReadAll?: boolean
}

export async function InvoiceDetailPageFeature({
    params,
    backPath = '/billing',
    requireBillingReadAll = false,
}: InvoiceDetailPageFeatureProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    if (requireBillingReadAll && !hasCapability(session.authz, 'billing.read.all')) {
        redirect('/billing')
    }

    const { invoiceId } = await params
    const invoice = await getInvoice(invoiceId)

    if (!invoice) {
        notFound()
    }

    const canManageInvoice = hasCapability(session.authz, 'billing.write.all')
    const canPayInvoice = isInvoicePayable(invoice.status)
    const canAdjustInvoice =
        canManageInvoice && (invoice.status === 'draft' || invoice.status === 'issued')
    const canRefundInvoice = canManageInvoice && invoice.status === 'paid'
    const statusBadge = getInvoiceStatusBadgePresentation(invoice.status)

    return (
        <InvoiceDetailPageLayout
            invoice={invoice}
            backPath={backPath}
            statusBadge={statusBadge}
            lineItemsSection={<InvoiceLineItemsTable lineItems={invoice.lineItems} />}
            paymentPanelSection={
                <InvoicePaymentPanel
                    invoiceId={invoice.id}
                    canPayInvoice={canPayInvoice}
                    canAdjustInvoice={canAdjustInvoice}
                    canRefundInvoice={canRefundInvoice}
                />
            }
            tabsSection={
                <InvoiceDetailTabsClient
                    summary={<InvoiceDetailSummary invoice={invoice} />}
                    paymentHistory={
                        <InvoicePaymentHistoryPanel paymentHistory={invoice.paymentHistory} />
                    }
                />
            }
        />
    )
}
