import { InvoiceManagerPageFeature } from '@/features/billing/manage/invoice-manager-page-feature'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import type { SearchParamRecord } from '@/types/common.types'

interface InvoiceManagePageProps {
    searchParams?: Promise<SearchParamRecord>
}

export default async function InvoiceManagePage({ searchParams }: InvoiceManagePageProps) {
    const { userId } = await getSession()
    if (!userId) {
        redirect('/sign-in')
    }

    return <InvoiceManagerPageFeature searchParams={searchParams} />
}
