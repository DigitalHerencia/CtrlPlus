'use client'


import { BookingsManagerRowActions } from '@/components/scheduling/manage/bookings-manager-row-actions'
import { BookingsManagerTable } from '@/components/scheduling/manage/bookings-manager-table'
import type { BookingManagerRowDTO } from '@/types/scheduling.types'

interface BookingsManagerTableClientProps {
    rows: BookingManagerRowDTO[]
}


export function BookingsManagerTableClient({ rows }: BookingsManagerTableClientProps) {
    return (
        <BookingsManagerTable
            rows={rows}
            rowActions={(row) => <BookingsManagerRowActions bookingId={row.id} />}
        />
    )
}
