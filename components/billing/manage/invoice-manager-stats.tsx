/**
 * @introduction Components — TODO: short one-line summary of invoice-manager-stats.tsx
 *
 * @description TODO: longer description for invoice-manager-stats.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { InvoicesDashboardStats } from '@/components/billing/invoices-dashboard-stats'

interface InvoiceManagerStatsProps {
    totalInvoices: number
    outstandingAmount: number
    creditAmount: number
}

/**
 * InvoiceManagerStats — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerStats(props: InvoiceManagerStatsProps) {
    return <InvoicesDashboardStats {...props} />
}
