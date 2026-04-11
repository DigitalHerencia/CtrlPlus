/**
 * @introduction Components — TODO: short one-line summary of scheduling-skeletons.tsx
 *
 * @description TODO: longer description for scheduling-skeletons.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Scheduling-specific skeleton components
 * Mapped 1:1 to real scheduling UI structure
 */

/**
 * SchedulingCalendarSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingCalendarSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-80 w-full rounded-lg" />
        </div>
    )
}

/**
 * SchedulingBookingCardsSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingBookingCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
        </div>
    )
}

/**
 * SchedulingDashboardStatsSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingDashboardStatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
        </div>
    )
}

/**
 * SchedulingBookingTableSkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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

/**
 * SchedulingAvailabilitySkeleton — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
