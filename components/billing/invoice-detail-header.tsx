/**
 * @introduction Components — TODO: short one-line summary of invoice-detail-header.tsx
 *
 * @description TODO: longer description for invoice-detail-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { type InvoiceDetailDTO } from '@/types/billing.types'

interface InvoiceDetailHeaderProps {
    invoice: InvoiceDetailDTO
}

/**
 * InvoiceDetailHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
    return (
        <WorkspacePageIntro
            label="Billing"
            title={`Invoice ${invoice.id}`}
            description="Review totals, milestones, and payment progress for this wrap project invoice."
        />
    )
}
