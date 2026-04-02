import { TimeSlot } from '@/components/scheduling/time-slot'

interface Slot {
    id: string
    startTime: string
    endTime: string
    capacity: number
}

interface BookingSlotPickerProps {
    slots: Slot[]
    selectedSlotId: string
    onSelectSlot: (slotId: string) => void
    disabled?: boolean
}

export function BookingSlotPicker({
    slots,
    selectedSlotId,
    onSelectSlot,
    disabled = false,
}: BookingSlotPickerProps) {
    if (slots.length === 0) {
        return <p className="text-xs text-neutral-500">No slots available for selected date.</p>
    }

    return (
        <div className="space-y-2">
            {slots.map((slot) => (
                <TimeSlot
                    key={slot.id}
                    startTime={slot.startTime}
                    endTime={slot.endTime}
                    capacity={slot.capacity}
                    isSelected={selectedSlotId === slot.id}
                    onClick={() => onSelectSlot(slot.id)}
                    disabled={disabled}
                />
            ))}
        </div>
    )
}
