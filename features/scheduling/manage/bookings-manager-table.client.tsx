'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { BookingsManagerRowActions } from '@/components/scheduling/manage/bookings-manager-row-actions'
import { BookingsManagerTable } from '@/components/scheduling/manage/bookings-manager-table'
import type { BookingManagerRowDTO } from '@/types/scheduling.types'

interface BookingsManagerTableClientProps {
    rows: BookingManagerRowDTO[]
}

/**
 * BookingsManagerTableClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerTableClient({ rows }: BookingsManagerTableClientProps) {
    return (
        <BookingsManagerTable
            rows={rows}
            rowActions={(row) => <BookingsManagerRowActions bookingId={row.id} />}
        />
    )
}
