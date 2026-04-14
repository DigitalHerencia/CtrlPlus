/**
 * @introduction Components — TODO: short one-line summary of InvoiceStatusBadge.tsx
 *
 * @description TODO: longer description for InvoiceStatusBadge.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { type InvoiceStatus } from '@/lib/constants/statuses'

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
    issued: {
        label: 'Issued',
        variant: 'outline',
        className: 'border-blue-600 text-neutral-100',
    },
    paid: {
        label: 'Paid',
        variant: 'outline',
        className: 'border-blue-600 bg-neutral-950/80 text-neutral-100',
    },
    refunded: {
        label: 'Refunded',
        variant: 'outline',
        className: 'border-neutral-700 bg-neutral-950/60 text-neutral-200',
    },
    void: {
        label: 'Void',
        variant: 'outline',
        className: 'border-neutral-700 text-neutral-300',
    },
}

/**
 * InvoiceStatusBadge — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? { label: status, variant: 'outline' as const }
    return (
        <Badge variant={config.variant} className={cn(config.className)}>
            {config.label}
        </Badge>
    )
}
