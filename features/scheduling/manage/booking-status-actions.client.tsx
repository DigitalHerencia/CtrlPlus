'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cancelBooking, completeBooking, confirmBooking } from '@/lib/actions/scheduling.actions'

interface BookingStatusActionsClientProps {
    bookingId: string
    status?: string
}

/**
 * BookingStatusActionsClient — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingStatusActionsClient({ bookingId, status }: BookingStatusActionsClientProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    async function run(action: 'confirm' | 'complete' | 'cancel') {
        setIsPending(true)

        try {
            if (action === 'confirm') {
                await confirmBooking(bookingId)
            } else if (action === 'complete') {
                await completeBooking(bookingId)
            } else {
                await cancelBooking(bookingId, { reason: 'Cancelled by manager action panel' })
            }

            router.refresh()
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {status === 'confirmed' ? (
                <Button type="button" size="sm" disabled={isPending} onClick={() => run('complete')}>
                    Mark Complete
                </Button>
            ) : status !== 'completed' && status !== 'cancelled' ? (
                <Button type="button" size="sm" disabled={isPending} onClick={() => run('confirm')}>
                    Confirm
                </Button>
            ) : null}
            {status !== 'completed' && status !== 'cancelled' ? (
                <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => run('cancel')}>
                    Cancel
                </Button>
            ) : null}
        </div>
    )
}
