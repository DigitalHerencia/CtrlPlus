import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BookingDetailViewDTO } from '@/types/scheduling.types'

import { BookingStatusBadge } from './booking-status-badge'

interface BookingDetailSummaryProps {
    booking: BookingDetailViewDTO
}

export function BookingDetailSummary({ booking }: BookingDetailSummaryProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-neutral-300 md:grid-cols-2">
                <div>
                    <p className="text-neutral-500">Status</p>
                    <BookingStatusBadge status={booking.status} className="mt-1" />
                </div>
                <div>
                    <p className="text-neutral-500">Wrap</p>
                    <p>{booking.wrapName ?? 'Wrap installation'}</p>
                </div>
                <div>
                    <p className="text-neutral-500">Customer</p>
                    <p>{booking.customerName}</p>
                    <p className="text-neutral-400">{booking.customerEmail}</p>
                </div>
                <div>
                    <p className="text-neutral-500">Vehicle</p>
                    <p>{[booking.vehicleYear, booking.vehicleMake, booking.vehicleModel, booking.vehicleTrim].filter(Boolean).join(' ') || 'Vehicle details not provided.'}</p>
                </div>
                <div>
                    <p className="text-neutral-500">Drop-off</p>
                    <p>{new Date(booking.scheduledAt).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-neutral-500">Estimated pickup</p>
                    <p>{new Date(booking.estimatedPickupAt).toLocaleString()}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-neutral-500">Notes</p>
                    <p>{booking.notes ?? 'No notes recorded.'}</p>
                </div>
            </CardContent>
        </Card>
    )
}
