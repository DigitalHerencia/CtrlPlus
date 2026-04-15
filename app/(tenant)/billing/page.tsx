import { InvoicesDashboardPageFeature } from '@/features/billing/invoices-dashboard-page-feature'
import type { SearchParamRecord } from '@/types/common.types'

interface BillingPageProps {
    searchParams?: Promise<SearchParamRecord>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
    return <InvoicesDashboardPageFeature searchParams={searchParams} />
}
