import Link from 'next/link'
import { Suspense } from 'react'

import {
    BillingInvoiceTableSkeleton,
    BillingKpiCardsSkeleton,
} from '@/components/billing/billing-skeletons'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
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
            {/* Header Section */}
            <WorkspacePageIntro
                label="Billing"
                title="Billing"
                description="Keep every wrap project financially aligned with clear balances, payment signals, and invoice accountability."
            />

            {/* Actions Section */}
            <WorkspacePageContextCard>
                <Button asChild>
                    <Link href="/billing/manage">Manage Invoices</Link>
                </Button>
            </WorkspacePageContextCard>

            {/* KPI Cards Section */}
            <Suspense fallback={<BillingKpiCardsSkeleton />}>
                <InvoicesDashboardStatsSection filters={filters} />
            </Suspense>

            {/* Combined Filters Section - Single Card, No Nesting */}
            <InvoicesDashboardFiltersClient />

            {/* Results Section */}
            <Suspense fallback={<BillingInvoiceTableSkeleton />}>
                <InvoicesDashboardTableSection filters={filters} />
            </Suspense>
        </div>
    )
}
