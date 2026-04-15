import { InvoiceManagerPageLayout } from '@/components/billing/manage/invoice-manager-page-layout'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getBalance, getInvoices } from '@/lib/fetchers/billing.fetchers'
import { parseBillingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'
import { redirect } from 'next/navigation'

import { InvoiceManagerTableClient } from './invoice-manager-table.client'
import { InvoiceManagerToolbarClient } from './invoice-manager-toolbar.client'
import { InvoiceNotificationControlsClient } from './invoice-notification-controls.client'

interface InvoiceManagerPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function InvoiceManagerPageFeature({ searchParams }: InvoiceManagerPageFeatureProps) {
    const session = await getSession()
    if (!session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'billing.read.all')) {
        redirect('/billing')
    }

    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseBillingSearchParams(resolvedParams)

    const [{ invoices, total }, balance] = await Promise.all([getInvoices(filters), getBalance()])

    return (
        <InvoiceManagerPageLayout
            totalInvoices={total}
            outstandingAmount={balance.outstandingAmount}
            creditAmount={balance.creditAmount}
            toolbarSection={<InvoiceManagerToolbarClient />}
            tableSection={<InvoiceManagerTableClient invoices={invoices} />}
            notificationControls={<InvoiceNotificationControlsClient />}
        />
    )
}
