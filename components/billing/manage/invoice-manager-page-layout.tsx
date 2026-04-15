import Link from 'next/link'
import type { ReactNode } from 'react'

import { InvoiceCommandPanel } from '@/components/billing/manage/invoice-command-panel'
import { InvoiceLifecyclePanel } from '@/components/billing/manage/invoice-lifecycle-panel'
import { InvoiceNotificationPanel } from '@/components/billing/manage/invoice-notification-panel'
import { InvoicesDashboardStats } from '@/components/billing/invoices-dashboard-stats'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'

interface InvoiceManagerPageLayoutProps {
    totalInvoices: number
    outstandingAmount: number
    creditAmount: number
    toolbarSection: ReactNode
    tableSection: ReactNode
    notificationControls: ReactNode
}

export function InvoiceManagerPageLayout({
    totalInvoices,
    outstandingAmount,
    creditAmount,
    toolbarSection,
    tableSection,
    notificationControls,
}: InvoiceManagerPageLayoutProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title="Invoice Manager"
                description="Guide every customer project from estimate to payment with confident, transparent billing operations."
            />
            <WorkspacePageContextCard
                title="Manager Actions"
                description="Create invoices and operate lifecycle tools"
            >
                <Button asChild>
                    <Link href="/billing/manage/new">New Invoice</Link>
                </Button>
            </WorkspacePageContextCard>

            <InvoicesDashboardStats
                totalInvoices={totalInvoices}
                outstandingAmount={outstandingAmount}
                creditAmount={creditAmount}
            />

            {toolbarSection}
            {tableSection}

            <div className="grid gap-4 md:grid-cols-3">
                <InvoiceCommandPanel>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/billing/manage/new">Create Invoice</Link>
                    </Button>
                </InvoiceCommandPanel>

                <InvoiceLifecyclePanel>
                    <p className="text-sm text-neutral-400">
                        Lifecycle operations are intentionally scoped to the invoice detail page so
                        they cannot target the wrong record from the manager dashboard.
                    </p>
                </InvoiceLifecyclePanel>

                <InvoiceNotificationPanel>{notificationControls}</InvoiceNotificationPanel>
            </div>
        </div>
    )
}
