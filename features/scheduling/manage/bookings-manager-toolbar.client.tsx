'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { BookingsManagerToolbar } from '@/components/scheduling/manage/bookings-manager-toolbar'

import { BookingsManagerFiltersClient } from './bookings-manager-filters.client'

/**
 * BookingsManagerToolbarClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerToolbarClient() {
    return (
        <BookingsManagerToolbar>
            <BookingsManagerFiltersClient />
        </BookingsManagerToolbar>
    )
}
