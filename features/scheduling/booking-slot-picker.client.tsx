'use client'


import { BookingSlotPicker } from '@/components/scheduling/booking-form/booking-slot-picker'

interface BookingSlotPickerClientProps {
    slots: Array<{ id: string; startTime: string; endTime: string; capacity: number }>
    selectedSlotId: string
    onSelectSlot: (slotId: string) => void
    disabled?: boolean
}


export function BookingSlotPickerClient(props: BookingSlotPickerClientProps) {
    return <BookingSlotPicker {...props} />
}
