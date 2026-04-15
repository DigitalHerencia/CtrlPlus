import { NewInvoicePageFeature } from '@/features/billing/manage/new-invoice-page-feature'
import type { SearchParamRecord } from '@/types/common.types'

interface NewInvoicePageProps {
    searchParams: Promise<SearchParamRecord>
}

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
    return <NewInvoicePageFeature searchParams={searchParams} />
}
