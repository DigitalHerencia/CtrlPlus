/**
 * @introduction Components — TODO: short one-line summary of invoice-manager-header.tsx
 *
 * @description TODO: longer description for invoice-manager-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface InvoiceManagerHeaderProps {
    title?: string
    description?: string
}

/**
 * InvoiceManagerHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceManagerHeader({
    title = 'Invoice Manager',
    description = 'Guide every customer project from estimate to payment with confident, transparent billing operations.',
}: InvoiceManagerHeaderProps) {
    return (
        <WorkspacePageIntro label="Billing" title={title} description={description} />
    )
}
