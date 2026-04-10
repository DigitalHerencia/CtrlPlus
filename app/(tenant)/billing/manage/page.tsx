import { InvoiceManagerPageFeature } from '@/features/billing/manage/invoice-manager-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { redirect } from 'next/navigation'
import type { SearchParamRecord } from '@/types/common.types'

interface InvoiceManagePageProps {
    searchParams?: Promise<SearchParamRecord>
}

export default async function InvoiceManagePage({ searchParams }: InvoiceManagePageProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'billing.read.all')) {
        redirect('/billing')
    }

    return <InvoiceManagerPageFeature searchParams={searchParams} />
}
