'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cancelBooking, confirmBooking } from '@/lib/actions/scheduling.actions'

interface BookingStatusActionsClientProps {
    bookingId: string
}

export function BookingStatusActionsClient({ bookingId }: BookingStatusActionsClientProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    async function run(action: 'confirm' | 'cancel') {
        setIsPending(true)

        try {
            if (action === 'confirm') {
                await confirmBooking(bookingId)
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
            <Button type="button" size="sm" disabled={isPending} onClick={() => run('confirm')}>
                Confirm
            </Button>
            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => run('cancel')}
            >
                Cancel
            </Button>
        </div>
    )
}
