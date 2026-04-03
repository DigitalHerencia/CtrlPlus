import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailHeaderProps {
    invoice: InvoiceDetailDTO
}

export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
    return (
        <WorkspacePageIntro
            label="Billing"
            title={`Invoice ${invoice.id}`}
            description="Review totals, milestones, and payment progress for this wrap project invoice."
        />
    )
}
