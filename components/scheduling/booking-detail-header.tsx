import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { BookingDetailViewDTO } from '@/types/scheduling.types'

interface BookingDetailHeaderProps {
    booking: BookingDetailViewDTO
    isManageView?: boolean
}

export function BookingDetailHeader({ booking, isManageView = false }: BookingDetailHeaderProps) {
    const basePath = isManageView ? `/scheduling/manage/${booking.id}` : `/scheduling/${booking.id}`

    return (
        <header className="flex flex-col gap-4 border border-neutral-800 bg-neutral-950/80 p-5 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">
                    Booking {booking.id.slice(0, 10)}
                </h1>
                <p className="text-sm text-neutral-400">
                    Scheduled {new Date(booking.scheduledAt).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <Link href={isManageView ? '/scheduling/manage' : '/scheduling'}>Back</Link>
                </Button>
                <Button asChild>
                    <Link href={`${basePath}/edit`}>Edit Booking</Link>
                </Button>
            </div>
        </header>
    )
}
