/**
 * @introduction Components — TODO: short one-line summary of invoices-dashboard-header.tsx
 *
 * @description TODO: longer description for invoices-dashboard-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface InvoicesDashboardHeaderProps {
    label?: string
    title?: string
    description?: string
}

/**
 * InvoicesDashboardHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicesDashboardHeader({
    label = 'Billing',
    title = 'Invoices',
    description = 'Keep every wrap project financially clear with transparent invoices, balances, and payment milestones.',
}: InvoicesDashboardHeaderProps) {
    return <WorkspacePageIntro label={label} title={title} description={description} />
}
