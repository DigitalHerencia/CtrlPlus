import Link from 'next/link'

import { InvoiceCommandPanel } from '@/components/billing/manage/invoice-command-panel'
import { InvoiceManagerHeader } from '@/components/billing/manage/invoice-manager-header'
import { InvoiceManagerStats } from '@/components/billing/manage/invoice-manager-stats'
import { InvoiceNotificationPanel } from '@/components/billing/manage/invoice-notification-panel'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getBalance, getInvoices } from '@/lib/fetchers/billing.fetchers'
import { parseBillingSearchParams } from '@/lib/utils/search-params'
import type { SearchParamRecord } from '@/types/common.types'

import { InvoiceManagerTableClient } from './invoice-manager-table.client'
import { InvoiceManagerToolbarClient } from './invoice-manager-toolbar.client'
import { InvoiceNotificationControlsClient } from './invoice-notification-controls.client'

interface InvoiceManagerPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
}

export async function InvoiceManagerPageFeature({ searchParams }: InvoiceManagerPageFeatureProps) {
    const resolvedParams = (searchParams ? await searchParams : {}) satisfies SearchParamRecord
    const { filters } = parseBillingSearchParams(resolvedParams)

    const [{ invoices, total }, balance] = await Promise.all([getInvoices(filters), getBalance()])

    return (
        <div className="space-y-6">
            <InvoiceManagerHeader />
            <WorkspacePageContextCard
                title="Manager Actions"
                description="Create invoices and operate lifecycle tools"
            >
                <Button asChild>
                    <Link href="/billing/manage/new">New Invoice</Link>
                </Button>
            </WorkspacePageContextCard>

            <InvoiceManagerStats
                totalInvoices={total}
                outstandingAmount={balance.outstandingAmount}
                creditAmount={balance.creditAmount}
            />

            <InvoiceManagerToolbarClient />
            <InvoiceManagerTableClient invoices={invoices} />

            <div className="grid gap-4 md:grid-cols-3">
                <InvoiceCommandPanel>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/billing/manage/new">Create Invoice</Link>
                    </Button>
                </InvoiceCommandPanel>

                <WorkspacePageContextCard
                    title="Lifecycle Actions"
                    description="Open a specific invoice row before running void, refund, or adjustment actions."
                >
                    <p className="text-sm text-neutral-400">
                        Lifecycle operations are intentionally scoped to the invoice detail page so
                        they cannot target the wrong record from the manager dashboard.
                    </p>
                </WorkspacePageContextCard>

                <InvoiceNotificationPanel>
                    <InvoiceNotificationControlsClient />
                </InvoiceNotificationPanel>
            </div>
        </div>
    )
}
