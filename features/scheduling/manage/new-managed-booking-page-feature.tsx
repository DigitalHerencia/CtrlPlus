import { getWrapsForScheduling, getAvailabilityWindows } from '@/lib/fetchers/scheduling.fetchers'

import { ManagedBookingFormClient } from './managed-booking-form.client'

export async function NewManagedBookingPageFeature() {
    const [availabilityResult, wrapsResult] = await Promise.all([
        getAvailabilityWindows(),
        getWrapsForScheduling({ includeHidden: true }),
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

    return <ManagedBookingFormClient availabilityWindows={availabilityWindows} wraps={wraps} />
}
