/**
 * @introduction Components — TODO: short one-line summary of booking-card.tsx
 *
 * @description TODO: longer description for booking-card.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock3, MapPin, TimerReset } from 'lucide-react'
import type { ReactNode } from 'react'

import { BookingStatusBadge, type BookingDisplayStatus } from './booking-status-badge'

/**
 * BookingCardItem — TODO: brief description of this type.
 */
export interface BookingCardItem {
    id: string
    wrapId: string | null
    wrapName?: string
    startTime: Date
    endTime: Date
    status: string
    displayStatus?: BookingDisplayStatus | string
    reservationExpiresAt?: Date | null
    totalPrice: number | null
}

interface BookingCardProps {
    booking: BookingCardItem
    locationLabel?: string
    actions?: ReactNode
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
export function BookingCard({ booking, locationLabel, actions }: BookingCardProps) {
    const displayStatus = booking.displayStatus ?? booking.status
    const bookingLabel = booking.wrapName
        ? booking.wrapName
        : booking.wrapId
          ? `Wrap ${booking.wrapId.slice(0, 8)}…`
          : 'Consultation or service appointment'
    const serviceLabel = booking.wrapName || booking.wrapId ? 'Wrap-related appointment' : 'Consultation or service'

    return (
        <Card className="border-neutral-700 bg-neutral-900 text-neutral-100 shadow-sm transition-all hover:border-blue-600/40">
            <CardContent className="space-y-4 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-base font-semibold text-neutral-100">
                                {bookingLabel}
                            </span>
                            <BookingStatusBadge status={displayStatus} />
                        </div>

                        <div className="grid gap-2 text-sm text-neutral-300 sm:grid-cols-2">
                            <p className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-blue-300" />
                                {formatDate(booking.startTime)}
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock3 className="size-4 text-blue-300" />
                                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                            </p>
                            <p className="flex items-start gap-2 sm:col-span-2">
                                <MapPin className="mt-0.5 size-4 text-blue-300" />
                                <span>{locationLabel ?? 'Location shared after confirmation'}</span>
                            </p>
                        </div>

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

                    <div className="shrink-0 text-left sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                            Service
                        </p>
                        <p className="mt-1 text-sm text-neutral-100">{serviceLabel}</p>
                    </div>
                </div>

                {actions ? (
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-700 pt-4">
                        {actions}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
