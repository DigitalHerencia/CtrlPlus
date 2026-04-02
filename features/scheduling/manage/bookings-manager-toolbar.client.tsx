'use client'

import { BookingsManagerToolbar } from '@/components/scheduling/manage/bookings-manager-toolbar'

import { BookingsManagerFiltersClient } from './bookings-manager-filters.client'

export function BookingsManagerToolbarClient() {
    return (
        <BookingsManagerToolbar>
            <BookingsManagerFiltersClient />
        </BookingsManagerToolbar>
    )
}
