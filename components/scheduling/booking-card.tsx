/**
 * @introduction Components — TODO: short one-line summary of booking-card.tsx
 *
 * @description TODO: longer description for booking-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock3, DollarSign, TimerReset } from 'lucide-react'

import { BookingStatusBadge, type BookingDisplayStatus } from './booking-status-badge'

/**
 * BookingCardItem — TODO: brief description of this type.
 */
export interface BookingCardItem {
    id: string
    wrapId: string
    wrapName?: string
    startTime: Date
    endTime: Date
    status: string
    displayStatus?: BookingDisplayStatus | string
    reservationExpiresAt?: Date | null
    totalPrice: number
}

interface BookingCardProps {
    booking: BookingCardItem
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date)
}

function formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100)
}

function formatExpiry(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date)
}

/**
 * BookingCard — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingCard({ booking }: BookingCardProps) {
    const displayStatus = booking.displayStatus ?? booking.status

    return (
        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100 shadow-sm transition-all hover:-translate-y-0.5">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-neutral-100">
                                {booking.wrapName ?? `Wrap ${booking.wrapId.slice(0, 8)}…`}
                            </span>
                            <BookingStatusBadge status={displayStatus} />
                        </div>

                        <p className="flex items-center gap-2 text-sm text-neutral-300">
                            <CalendarDays className="size-4 text-blue-300" />
                            {formatDate(booking.startTime)}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-neutral-400">
                            <Clock3 className="size-3.5 text-neutral-500" />
                            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                        </p>

                        {displayStatus === 'reserved' && booking.reservationExpiresAt ? (
                            <p className="flex items-center gap-2 text-xs text-amber-100/80">
                                <TimerReset className="size-3.5 text-amber-300" />
                                Reserved until {formatExpiry(booking.reservationExpiresAt)}
                            </p>
                        ) : null}

                        {displayStatus === 'expired' ? (
                            <p className="flex items-center gap-2 text-xs text-neutral-400">
                                <TimerReset className="size-3.5 text-neutral-500" />
                                Reservation expired
                            </p>
                        ) : null}
                    </div>

                    <div className="shrink-0 border border-neutral-700 bg-neutral-900 px-3 py-2 text-right">
                        <p className="flex items-center gap-1 text-sm font-semibold text-neutral-100">
                            <DollarSign className="size-3.5 text-blue-600" />
                            {formatPrice(booking.totalPrice)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
