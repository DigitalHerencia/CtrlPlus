/**
 * @introduction Components — TODO: short one-line summary of booking-form-actions.tsx
 *
 * @description TODO: longer description for booking-form-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { LoaderCircle } from 'lucide-react'
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
        <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
            {secondaryAction}
            <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full bg-neutral-100 font-medium text-neutral-950 hover:bg-white sm:w-auto"
            >
                {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                {submitLabel}
            </Button>
        </div>
    )
}
