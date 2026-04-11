/**
 * @introduction Components — TODO: short one-line summary of booking-form-actions.tsx
 *
 * @description TODO: longer description for booking-form-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

interface BookingFormActionsProps {
    isPending?: boolean
    secondaryAction?: ReactNode
    submitLabel?: string
}

/**
 * BookingFormActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingFormActions({
    isPending = false,
    secondaryAction,
    submitLabel = 'Confirm Booking',
}: BookingFormActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {secondaryAction}
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : submitLabel}
            </Button>
        </div>
    )
}
