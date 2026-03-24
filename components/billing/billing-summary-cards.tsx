import { WorkspaceMetricCard } from '@/components/shared/tenant-elements'

interface BillingSummaryCardsProps {
    totalInvoices: number
    outstandingAmount: number
    paidInvoiceCount: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

export function BillingSummaryCards({
    totalInvoices,
    outstandingAmount,
    paidInvoiceCount,
}: BillingSummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <WorkspaceMetricCard
                label="Total Invoices"
                value={totalInvoices}
                description="Every invoice currently tracked by the store."
            />
            <WorkspaceMetricCard
                label="Outstanding"
                value={currencyFormatter.format(outstandingAmount / 100)}
                description="Draft, sent, and failed invoices that still need attention."
            />
            <WorkspaceMetricCard
                label="Paid"
                value={paidInvoiceCount}
                description="Invoices that have cleared successfully."
            />
        </div>
    )
}
