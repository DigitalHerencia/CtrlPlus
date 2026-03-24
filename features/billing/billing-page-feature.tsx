import Link from 'next/link'

import { BillingSummaryCards } from '@/components/billing/billing-summary-cards'
import { InvoiceListCard } from '@/components/billing/invoice-list-card'
import {
    WorkspaceEmptyState,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getInvoices } from '@/lib/billing/fetchers/get-invoices'

export async function BillingPageFeature() {
    const { invoices, total } = await getInvoices()
    const outstandingAmount = invoices
        .filter(
            (invoice) =>
                invoice.status === 'draft' ||
                invoice.status === 'sent' ||
                invoice.status === 'failed'
        )
        .reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    const paidInvoiceCount = invoices.filter((invoice) => invoice.status === 'paid').length

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Revenue"
                title="Billing"
                description="Monitor invoices, track payment status, and move directly into detail or collection actions from one financial workspace."
                actions={
                    <Button asChild variant="outline">
                        <Link href="/scheduling/bookings">View Bookings</Link>
                    </Button>
                }
            />

            <BillingSummaryCards
                totalInvoices={total}
                outstandingAmount={outstandingAmount}
                paidInvoiceCount={paidInvoiceCount}
            />

            {invoices.length === 0 ? (
                <WorkspaceEmptyState
                    title="No invoices found"
                    description="Once appointments create invoices, they will appear here with payment status and detail links."
                />
            ) : (
                <InvoiceListCard invoices={invoices} />
            )}
        </div>
    )
}
