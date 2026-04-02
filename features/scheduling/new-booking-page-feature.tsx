import { getWrapsForScheduling, getAvailabilityWindows } from '@/lib/fetchers/scheduling.fetchers'

import { BookingFormClient } from './booking-form.client'

interface NewBookingPageFeatureProps {
    canViewHiddenWraps: boolean
}

export async function NewBookingPageFeature({ canViewHiddenWraps }: NewBookingPageFeatureProps) {
    const [availabilityResult, wrapsResult] = await Promise.all([
        getAvailabilityWindows(),
        getWrapsForScheduling({ includeHidden: canViewHiddenWraps }),
    ])

    const availabilityWindows = availabilityResult.items.map((window) => ({
        id: window.id,
        dayOfWeek: window.dayOfWeek,
        startTime: window.startTime,
        endTime: window.endTime,
        capacity: window.capacitySlots,
    }))

    const wraps = wrapsResult.map((wrap) => ({
        id: wrap.id,
        name: wrap.name,
        price: wrap.price,
    }))

    return <BookingFormClient availabilityWindows={availabilityWindows} wraps={wraps} />
}
