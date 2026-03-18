import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    pending: {
        label: 'Pending',
        className: 'border-neutral-700 bg-neutral-900 text-neutral-100',
    },
    confirmed: {
        label: 'Confirmed',
        className: 'border-blue-600 bg-neutral-900 text-neutral-100',
    },
    completed: {
        label: 'Completed',
        className: 'border-blue-600 bg-neutral-900 text-neutral-100',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'border-neutral-700 bg-neutral-900 text-neutral-100',
    },
}

interface BookingStatusBadgeProps {
    status: string
    className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        className: 'border-neutral-400/70 bg-neutral-700/20 text-neutral-200',
    }

    return (
        <Badge variant="outline" className={cn('font-medium', config.className, className)}>
            {config.label}
        </Badge>
    )
}
