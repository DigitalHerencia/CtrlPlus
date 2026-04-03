import { WorkspacePageIntro } from '@/components/shared/tenant-elements'

interface InvoiceManagerHeaderProps {
    title?: string
    description?: string
}

export function InvoiceManagerHeader({
    title = 'Invoice Manager',
    description = 'Guide every customer project from estimate to payment with confident, transparent billing operations.',
}: InvoiceManagerHeaderProps) {
    return (
        <WorkspacePageIntro label="Billing" title={title} description={description} />
    )
}
