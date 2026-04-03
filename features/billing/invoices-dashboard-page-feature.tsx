import Link from 'next/link'
import { Suspense } from 'react'

import { InvoicesDashboardHeader } from '@/components/billing/invoices-dashboard-header'
import {
    BillingInvoiceTableSkeleton,
    BillingKpiCardsSkeleton,
} from '@/components/billing/billing-skeletons'
import { InvoicesDashboardToolbar } from '@/components/billing/invoices-dashboard-toolbar'
import { Button } from '@/components/ui/button'
import { parseBillingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { InvoicesDashboardFiltersClient } from './invoices-dashboard-filters.client'
import {
    InvoicesDashboardStatsSection,
    InvoicesDashboardTableSection,
} from './invoices-dashboard-parts'

interface InvoicesDashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function InvoicesDashboardPageFeature({
    searchParams,
}: InvoicesDashboardPageFeatureProps) {
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseBillingSearchParams(resolvedParams)

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

            <Suspense fallback={<BillingKpiCardsSkeleton />}>
                <InvoicesDashboardStatsSection filters={filters} />
            </Suspense>

            <InvoicesDashboardToolbar>
                <InvoicesDashboardFiltersClient />
            </InvoicesDashboardToolbar>

            <Suspense fallback={<BillingInvoiceTableSkeleton />}>
                <InvoicesDashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
