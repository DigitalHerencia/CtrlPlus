'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { BookingSlotPicker } from '@/components/scheduling/booking-form/booking-slot-picker'

interface BookingSlotPickerClientProps {
    slots: Array<{ id: string; startTime: string; endTime: string; capacity: number }>
    selectedSlotId: string
    onSelectSlot: (slotId: string) => void
    disabled?: boolean
}

/**
 * BookingSlotPickerClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingSlotPickerClient(props: BookingSlotPickerClientProps) {
    return <BookingSlotPicker {...props} />
}
