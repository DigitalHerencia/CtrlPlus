import { InvoiceManagerPageFeature } from '@/features/billing/manage/invoice-manager-page-feature'
import type { SearchParamRecord } from '@/types/common.types'

interface InvoiceManagePageProps {
    searchParams?: Promise<SearchParamRecord>
}

export default async function InvoiceManagePage({ searchParams }: InvoiceManagePageProps) {
    return <InvoiceManagerPageFeature searchParams={searchParams} />
}
