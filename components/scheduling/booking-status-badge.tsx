/**
 * @introduction Components — TODO: short one-line summary of booking-status-badge.tsx
 *
 * @description TODO: longer description for booking-status-badge.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

/**
 * BookingDisplayStatus — TODO: brief description of this type.
 */
export type BookingDisplayStatus =
    | 'pending'
    | 'requested'
    | 'reschedule_requested'
    | 'reserved'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'expired'

const STATUS_CONFIG: Record<
    BookingDisplayStatus,
    { label: string; className: string }
> = {
    pending: {
        label: 'Requested',
        className: 'border-neutral-700 bg-neutral-900 text-neutral-100',
    },
    requested: {
        label: 'Requested',
        className: 'border-neutral-700 bg-neutral-900 text-neutral-100',
    },
    reschedule_requested: {
        label: 'Reschedule Requested',
        className: 'border-blue-600/50 bg-blue-600/10 text-neutral-100',
    },
    reserved: {
        label: 'Reserved',
        className: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
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
    expired: {
        label: 'Expired',
        className: 'border-neutral-500/50 bg-neutral-800/80 text-neutral-200',
    },
}

interface BookingStatusBadgeProps {
    status: BookingDisplayStatus | string
    className?: string
}

/**
 * BookingStatusBadge — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
    const config =
        STATUS_CONFIG[status as BookingDisplayStatus] ??
        ({
            label: status,
            className: 'border-neutral-400/70 bg-neutral-700/20 text-neutral-200',
        } as const)

    return (
        <Badge variant="outline" className={cn('font-medium', config.className, className)}>
            {config.label}
        </Badge>
    )
}
