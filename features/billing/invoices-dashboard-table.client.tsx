'use client'

import { InvoicesDashboardTable } from '@/components/billing/invoices-dashboard-table'
import { type InvoiceDTO } from '@/types/billing.types'
import { renderInvoiceStatusBadge } from './invoice-status-badge-presenter'

interface InvoicesDashboardTableClientProps {
    invoices: InvoiceDTO[]
}

export function InvoicesDashboardTableClient({ invoices }: InvoicesDashboardTableClientProps) {
    return (
        <InvoicesDashboardTable invoices={invoices} renderStatusBadge={renderInvoiceStatusBadge} />
    )
}
