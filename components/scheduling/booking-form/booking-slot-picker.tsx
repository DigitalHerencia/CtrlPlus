/**
 * @introduction Components — TODO: short one-line summary of booking-slot-picker.tsx
 *
 * @description TODO: longer description for booking-slot-picker.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
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

/**
 * BookingSlotPicker — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingSlotPicker({
    slots,
    selectedSlotId,
    onSelectSlot,
    disabled = false,
}: BookingSlotPickerProps) {
    if (slots.length === 0) {
        return (
            <div className="border border-dashed border-neutral-700 bg-neutral-950/80 px-4 py-6 text-sm text-neutral-300">
                No appointment times are available for the selected date.
            </div>
        )
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
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
