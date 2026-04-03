import { cache } from 'react'

import { InvoicesDashboardStats } from '@/components/billing/invoices-dashboard-stats'
import { getBalance, getInvoices } from '@/lib/fetchers/billing.fetchers'
import type { InvoiceListParams } from '@/types/billing.types'

import { InvoicesDashboardTableClient } from './invoices-dashboard-table.client'

const getInvoicesForDashboard = cache(async (filters: InvoiceListParams) => getInvoices(filters))

export async function InvoicesDashboardStatsSection({ filters }: { filters: InvoiceListParams }) {
    const [{ total }, balance] = await Promise.all([getInvoicesForDashboard(filters), getBalance()])

    return (
        <InvoicesDashboardStats
            totalInvoices={total}
            outstandingAmount={balance.outstandingAmount}
            creditAmount={balance.creditAmount}
        />
    )
}

export async function InvoicesDashboardTableSection({ filters }: { filters: InvoiceListParams }) {
    const { invoices } = await getInvoicesForDashboard(filters)

    return <InvoicesDashboardTableClient invoices={invoices} />
}
