import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { type InvoiceStatus } from '@/types/billing'

interface InvoiceStatusBadgeProps {
    status: InvoiceStatus
}

const STATUS_CONFIG: Record<
    InvoiceStatus,
    {
        label: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        className?: string
    }
> = {
    draft: { label: 'Draft', variant: 'secondary' },
    sent: { label: 'Sent', variant: 'outline', className: 'border-blue-600 text-neutral-100' },
    paid: {
        label: 'Paid',
        variant: 'outline',
        className: 'border-blue-600 bg-neutral-900 text-neutral-100',
    },
    failed: { label: 'Failed', variant: 'destructive' },
    refunded: {
        label: 'Refunded',
        variant: 'outline',
        className: 'border-neutral-700 bg-neutral-800/60 text-neutral-200',
    },
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? { label: status, variant: 'outline' as const }
    return (
        <Badge variant={config.variant} className={cn(config.className)}>
            {config.label}
        </Badge>
    )
}
