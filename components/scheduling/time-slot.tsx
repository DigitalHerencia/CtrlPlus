
import { cn } from '@/lib/utils/cn'

interface TimeSlotProps {
    startTime: string
    endTime: string
    capacity: number
    bookedCount?: number
    isSelected?: boolean
    onClick?: () => void
    disabled?: boolean
}

function formatTime(time: string): string {
    const [hourStr, minuteStr] = time.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = minuteStr ?? '00'
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${displayHour}:${minute} ${period}`
}


export function TimeSlot({
    startTime,
    endTime,
    capacity,
    bookedCount = 0,
    isSelected = false,
    onClick,
    disabled = false,
}: TimeSlotProps) {
    const available = capacity - bookedCount
    const isFull = available <= 0
    const effectivelyDisabled = disabled || isFull

    return (
        <button
            type="button"
            disabled={effectivelyDisabled}
            onClick={onClick}
            className={cn(
                'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                isSelected
                    ? 'border-blue-600 bg-blue-950/20 text-neutral-100'
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-100',
                !effectivelyDisabled && !isSelected
                    ? 'cursor-pointer hover:border-neutral-700'
                    : '',
                effectivelyDisabled && 'cursor-not-allowed opacity-50'
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">
                    {formatTime(startTime)} – {formatTime(endTime)}
                </span>
                <span
                    className={cn(
                        'shrink-0 text-xs',
                        isFull
                            ? 'text-neutral-100'
                            : available <= 2
                              ? 'text-blue-600'
                              : 'text-neutral-100'
                    )}
                >
                    {isFull ? 'Full' : `${available} of ${capacity} open`}
                </span>
            </div>
        </button>
    )
}
