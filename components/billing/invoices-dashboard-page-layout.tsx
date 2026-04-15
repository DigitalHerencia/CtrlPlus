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
                label="Billing"
                title="Billing"
                description="Keep every wrap project financially aligned with clear balances, payment signals, and invoice accountability."
            />

            {canManageInvoices && (
                <InvoicesDashboardToolbar>
                    <Button asChild>
                        <Link href="/billing/manage">Manage Invoices</Link>
                    </Button>
                </InvoicesDashboardToolbar>
            )}

            {statsSection}
            {filtersSection}
            {tableSection}
        </div>
    )
}
