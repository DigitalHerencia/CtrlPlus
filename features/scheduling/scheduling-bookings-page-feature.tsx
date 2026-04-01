import 'server-only'

import Link from 'next/link'

import { BookingCard, type BookingCardItem } from '@/components/scheduling/booking-card'
import { WorkspaceEmptyState, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getBookings } from '@/lib/fetchers/scheduling.fetchers'

interface SchedulingBookingsPageFeatureProps {
    tab: 'upcoming' | 'past'
}

function toBookingCardItem(
    booking: Awaited<ReturnType<typeof getBookings>>['items'][number]
): BookingCardItem {
    return {
        id: booking.id,
        wrapId: booking.wrapId,
        wrapName: booking.wrapName,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        status: booking.status,
        displayStatus: booking.displayStatus,
        reservationExpiresAt: booking.reservationExpiresAt
            ? new Date(booking.reservationExpiresAt)
            : null,
        totalPrice: booking.totalPrice,
    }
}

export async function SchedulingBookingsPageFeature({ tab }: SchedulingBookingsPageFeatureProps) {
    const now = new Date()
    const nowIso = now.toISOString()
    const bookingsResult = await getBookings(
        tab === 'upcoming'
            ? { page: 1, pageSize: 20, fromDate: nowIso }
            : { page: 1, pageSize: 20, toDate: nowIso }
    )

    const bookings = bookingsResult.items.map(toBookingCardItem)
    const isUpcoming = tab === 'upcoming'

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Appointments"
                title="Bookings"
                description="Flip between upcoming and past installs while keeping navigation and actions consistent with the rest of the workspace."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link href="/scheduling">Calendar</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/scheduling/book">New Booking</Link>
                        </Button>
                    </>
                }
            />

            <div className="inline-flex gap-1 border border-neutral-800 bg-neutral-900/80 p-1">
                <Link
                    href="/scheduling/bookings?tab=upcoming"
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        isUpcoming
                            ? 'bg-blue-600 text-neutral-100 shadow-[0_16px_30px_-20px_rgba(37,99,235,0.9)]'
                            : 'text-neutral-400 hover:text-neutral-100'
                    }`}
                >
                    Upcoming
                </Link>
                <Link
                    href="/scheduling/bookings?tab=past"
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        !isUpcoming
                            ? 'bg-blue-600 text-neutral-100 shadow-[0_16px_30px_-20px_rgba(37,99,235,0.9)]'
                            : 'text-neutral-400 hover:text-neutral-100'
                    }`}
                >
                    Past
                </Link>
            </div>

            <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-base text-neutral-100">
                        {isUpcoming ? 'Upcoming Appointments' : 'Past Appointments'}
                    </CardTitle>
                    {bookingsResult.total > 0 ? (
                        <CardDescription className="text-neutral-400">
                            {bookingsResult.total} booking
                            {bookingsResult.total !== 1 ? 's' : ''}
                        </CardDescription>
                    ) : null}
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <WorkspaceEmptyState
                            title={isUpcoming ? 'No upcoming bookings' : 'No past bookings'}
                            description={
                                isUpcoming
                                    ? 'Ready to schedule the next install? Start a new booking from here.'
                                    : 'Completed and historical appointments will appear here once they exist.'
                            }
                            action={
                                isUpcoming ? (
                                    <Button asChild>
                                        <Link href="/scheduling/book">Book Appointment</Link>
                                    </Button>
                                ) : null
                            }
                            className="border-0 bg-transparent shadow-none"
                        />
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
