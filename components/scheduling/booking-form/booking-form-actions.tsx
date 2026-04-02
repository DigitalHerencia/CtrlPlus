import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

interface BookingFormActionsProps {
    isPending?: boolean
    secondaryAction?: ReactNode
    submitLabel?: string
}

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
