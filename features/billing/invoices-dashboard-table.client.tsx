'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { InvoicesDashboardTable } from '@/components/billing/invoices-dashboard-table'
import { type InvoiceDTO } from '@/types/billing.types'

interface InvoicesDashboardTableClientProps {
    invoices: InvoiceDTO[]
}

/**
 * InvoicesDashboardTableClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicesDashboardTableClient({ invoices }: InvoicesDashboardTableClientProps) {
    return <InvoicesDashboardTable invoices={invoices} />
}
