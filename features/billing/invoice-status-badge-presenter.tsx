import { InvoiceStatusBadge } from '@/components/billing/InvoiceStatusBadge'
import type { InvoiceStatus } from '@/lib/constants/statuses'

interface InvoiceStatusBadgePresentation {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
}

export function getInvoiceStatusBadgePresentation(
    status: InvoiceStatus
): InvoiceStatusBadgePresentation {
    switch (status) {
        case 'draft':
            return { label: 'Draft', variant: 'secondary' }
        case 'issued':
            return {
                label: 'Issued',
                variant: 'outline',
                className: 'border-blue-600 text-neutral-100',
            }
        case 'paid':
            return {
                label: 'Paid',
                variant: 'outline',
                className: 'border-blue-600 bg-neutral-950/80 text-neutral-100',
            }
        case 'refunded':
            return {
                label: 'Refunded',
                variant: 'outline',
                className: 'border-neutral-700 bg-neutral-950/60 text-neutral-200',
            }
        case 'void':
            return {
                label: 'Void',
                variant: 'outline',
                className: 'border-neutral-700 text-neutral-300',
            }
        default:
            return { label: status, variant: 'outline' }
    }
}

export function renderInvoiceStatusBadge(status: InvoiceStatus) {
    const presentation = getInvoiceStatusBadgePresentation(status)

    return (
        <InvoiceStatusBadge
            label={presentation.label}
            variant={presentation.variant}
            className={presentation.className}
        />
    )
}
