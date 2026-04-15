
import { Card, CardContent } from '@/components/ui/card'

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
        return (
            <Card className="border-neutral-800 bg-neutral-900/70">
                <CardContent className="p-6 text-center text-sm text-neutral-400">
                    No appointment times are available for the selected date.
                </CardContent>
            </Card>
        )
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
