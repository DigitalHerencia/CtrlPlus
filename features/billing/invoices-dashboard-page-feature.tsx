import Link from 'next/link'

import { InvoicesDashboardHeader } from '@/components/billing/invoices-dashboard-header'
import { InvoicesDashboardStats } from '@/components/billing/invoices-dashboard-stats'
import { InvoicesDashboardToolbar } from '@/components/billing/invoices-dashboard-toolbar'
import { Button } from '@/components/ui/button'
import { getBalance, getInvoices } from '@/lib/fetchers/billing.fetchers'
import { parseBillingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { InvoicesDashboardFiltersClient } from './invoices-dashboard-filters.client'
import { InvoicesDashboardTableClient } from './invoices-dashboard-table.client'

interface InvoicesDashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function InvoicesDashboardPageFeature({
    searchParams,
}: InvoicesDashboardPageFeatureProps) {
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseBillingSearchParams(resolvedParams)

    const [{ invoices, total }, balance] = await Promise.all([
        getInvoices(filters),
        getBalance(),
    ])

    return (
        <div className="space-y-6">
            <InvoicesDashboardHeader
                title="Billing"
                description="Monitor invoice status, balances, and payment lifecycle events."
                actions={
                    <Button asChild>
                        <Link href="/billing/manage">Manage</Link>
                    </Button>
                }
            />

            <InvoicesDashboardStats
                totalInvoices={total}
                outstandingAmount={balance.outstandingAmount}
                creditAmount={balance.creditAmount}
            />

            <InvoicesDashboardToolbar>
                <InvoicesDashboardFiltersClient />
            </InvoicesDashboardToolbar>

            <InvoicesDashboardTableClient invoices={invoices} />
        </div>
    )
}
