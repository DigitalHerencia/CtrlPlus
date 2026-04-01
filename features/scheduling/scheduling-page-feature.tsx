import 'server-only'

import Link from 'next/link'

import { BookingCard, type BookingCardItem } from '@/components/scheduling/booking-card'
import { CalendarClient } from '@/components/scheduling/calendar-client'
import { WorkspaceMetricCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAvailabilityWindows, getBookings } from '@/lib/fetchers/scheduling.fetchers'

const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const

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

function getAvailableWeekdays(
    windows: Awaited<ReturnType<typeof getAvailabilityWindows>>['items']
) {
    const availableWeekdays = [...new Set(windows.map((window) => window.dayOfWeek))]
    return availableWeekdays
}

export async function SchedulingPageFeature() {
    const now = new Date()
    const nowIso = now.toISOString()
    const [availabilityResult, bookingsResult] = await Promise.all([
        getAvailabilityWindows(),
        getBookings({
            page: 1,
            pageSize: 3,
            fromDate: nowIso,
        }),
    ])

    const availableWeekdays = getAvailableWeekdays(availabilityResult.items)
    const upcomingBookings = bookingsResult.items.map(toBookingCardItem)

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Calendar"
                title="Scheduling"
                description="Review open days, monitor upcoming installs, and move into booking without leaving the workspace flow."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link href="/scheduling/bookings">All Bookings</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/scheduling/book">Book Appointment</Link>
                        </Button>
                    </>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                <WorkspaceMetricCard
                    label="Open Days"
                    value={availableWeekdays.length}
                    description="Weekdays currently accepting bookings."
                />
                <WorkspaceMetricCard
                    label="Availability Windows"
                    value={availabilityResult.items.length}
                    description="Total configured time windows for the shop."
                />
                <WorkspaceMetricCard
                    label="Upcoming Jobs"
                    value={upcomingBookings.length}
                    description="Appointments coming up next."
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-neutral-100">
                                Availability Calendar
                            </CardTitle>
                            <CardDescription className="text-neutral-400">
                                Highlighted days have open time slots. Click a day to book.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <CalendarClient availableWeekdays={availableWeekdays} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-base text-neutral-100">Open Days</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {availabilityResult.items.length === 0 ? (
                                <p className="text-sm text-neutral-500">
                                    No availability windows configured.
                                </p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {[0, 1, 2, 3, 4, 5, 6]
                                        .filter((dayOfWeek) =>
                                            availableWeekdays.includes(dayOfWeek)
                                        )
                                        .map((dayOfWeek) => {
                                            const slots = availabilityResult.items.filter(
                                                (window) => window.dayOfWeek === dayOfWeek
                                            )

                                            return (
                                                <li
                                                    key={dayOfWeek}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="font-medium text-neutral-200">
                                                        {DAY_NAMES[dayOfWeek]}
                                                    </span>
                                                    <span className="text-neutral-400">
                                                        {slots.length} slot
                                                        {slots.length !== 1 ? 's' : ''}
                                                    </span>
                                                </li>
                                            )
                                        })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-base text-neutral-100">
                                Upcoming Bookings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingBookings.length === 0 ? (
                                <p className="text-sm text-neutral-500">No upcoming bookings.</p>
                            ) : (
                                upcomingBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                            {upcomingBookings.length > 0 ? (
                                <Link
                                    href="/scheduling/bookings"
                                    className="block text-center text-sm text-blue-300 hover:underline"
                                >
                                    View all bookings →
                                </Link>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
