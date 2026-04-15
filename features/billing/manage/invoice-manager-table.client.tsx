'use client'

import { InvoiceManagerTable } from '@/components/billing/manage/invoice-manager-table'
import { type InvoiceDTO } from '@/types/billing.types'
import { renderInvoiceStatusBadge } from '../invoice-status-badge-presenter'

interface InvoiceManagerTableClientProps {
    invoices: InvoiceDTO[]
}

export function InvoiceManagerTableClient({ invoices }: InvoiceManagerTableClientProps) {
    return <InvoiceManagerTable invoices={invoices} renderStatusBadge={renderInvoiceStatusBadge} />
}
