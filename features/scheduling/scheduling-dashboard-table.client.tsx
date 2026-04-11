'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import type { BookingManagerRowDTO } from '@/types/scheduling.types'

import { SchedulingDashboardTable } from '@/components/scheduling/scheduling-dashboard-table'

interface SchedulingDashboardTableClientProps {
    rows: BookingManagerRowDTO[]
}

/**
 * SchedulingDashboardTableClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SchedulingDashboardTableClient({ rows }: SchedulingDashboardTableClientProps) {
    return <SchedulingDashboardTable rows={rows} />
}
