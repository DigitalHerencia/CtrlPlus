import { Suspense } from 'react'

import {
    BillingInvoiceTableSkeleton,
    BillingKpiCardsSkeleton,
} from '@/components/billing/billing-skeletons'
import { InvoicesDashboardPageLayout } from '@/components/billing/invoices-dashboard-page-layout'
import { parseBillingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { InvoicesDashboardFiltersClient } from './invoices-dashboard-filters.client'
import {
    InvoicesDashboardStatsSection,
    InvoicesDashboardTableSection,
} from './invoices-dashboard-parts'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

interface InvoicesDashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function InvoicesDashboardPageFeature({
    searchParams,
}: InvoicesDashboardPageFeatureProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseBillingSearchParams(resolvedParams)
    const canManageInvoices = session?.role === 'owner' || session?.role === 'admin'

    return (
        <InvoicesDashboardPageLayout
            canManageInvoices={canManageInvoices}
            statsSection={
                <Suspense fallback={<BillingKpiCardsSkeleton />}>
                    <InvoicesDashboardStatsSection filters={filters} />
                </Suspense>
            }
            filtersSection={<InvoicesDashboardFiltersClient />}
            tableSection={
                <Suspense fallback={<BillingInvoiceTableSkeleton />}>
                    <InvoicesDashboardTableSection filters={filters} />
                </Suspense>
            }
        />
    )
}
