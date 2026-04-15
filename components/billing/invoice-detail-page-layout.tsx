import Link from 'next/link'
import type { ReactNode } from 'react'

import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import type { InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailPageLayoutProps {
    invoice: InvoiceDetailDTO
    backPath: string
    statusBadge: {
        label: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        className?: string
    }
    lineItemsSection: ReactNode
    paymentPanelSection: ReactNode
    tabsSection: ReactNode
}

export function InvoiceDetailPageLayout({
    invoice,
    backPath,
    statusBadge,
    lineItemsSection,
    paymentPanelSection,
    tabsSection,
}: InvoiceDetailPageLayoutProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Billing"
                title={`Invoice ${invoice.id}`}
                description="Review totals, milestones, and payment progress for this wrap project invoice."
            />
            <WorkspacePageContextCard
                title="Invoice Controls"
                description="Current status and quick navigation"
            >
                <InvoiceStatusBadge
                    label={statusBadge.label}
                    variant={statusBadge.variant}
                    className={statusBadge.className}
                />
                <Button asChild variant="outline">
                    <Link href={backPath}>Back to Billing</Link>
                </Button>
            </WorkspacePageContextCard>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">{lineItemsSection}</div>
                {paymentPanelSection}
            </div>

            {tabsSection}
        </div>
    )
}
