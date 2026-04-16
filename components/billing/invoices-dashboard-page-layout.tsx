import Link from 'next/link'
import type { ReactNode } from 'react'

import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { InvoicesDashboardToolbar } from '@/components/billing/invoices-dashboard-toolbar'
import { Button } from '@/components/ui/button'

interface InvoicesDashboardPageLayoutProps {
    canManageInvoices: boolean
    statsSection: ReactNode
    filtersSection: ReactNode
    tableSection: ReactNode
}

export function InvoicesDashboardPageLayout({
    canManageInvoices,
    statsSection,
    filtersSection,
    tableSection,
}: InvoicesDashboardPageLayoutProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="WrapWallet™"
                title="Project Billing & Payments"
                description="Track your wrap project costs, review invoices, and manage payments with complete transparency and zero surprises."
            />

            {canManageInvoices && (
                <InvoicesDashboardToolbar>
                    <Button asChild>
                        <Link href="/billing/manage">Manage Project Bills</Link>
                    </Button>
                </InvoicesDashboardToolbar>
            )}

            {statsSection}
            {filtersSection}
            {tableSection}
        </div>
    )
}
