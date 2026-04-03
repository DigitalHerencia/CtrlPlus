import { Skeleton } from '@/components/ui/skeleton'

/**
 * Scheduling-specific skeleton components
 * Mapped 1:1 to real scheduling UI structure
 */

export function SchedulingCalendarSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-lg" />
        </div>
    )
}

export function SchedulingBookingCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
        </div>
    )
}

export function SchedulingBookingTableSkeleton() {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="mb-3 grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 rounded" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded" />
            ))}
        </div>
    )
}

export function SchedulingAvailabilitySkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded" />
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded" />
                ))}
            </div>
        </div>
    )
}
