import 'server-only'

import Link from 'next/link'
import { redirect } from 'next/navigation'

import { BookingCard } from '@/components/scheduling/booking-card'
import {
    WorkspaceEmptyState,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cancelBooking } from '@/lib/actions/scheduling.actions'
import { getBookings } from '@/lib/fetchers/scheduling.fetchers'
import { getTenantLocationView } from '@/lib/fetchers/settings.fetchers'

import { toBookingCardItem } from './booking.mappers'

interface SchedulingBookingsPageFeatureProps {
    tab: 'upcoming' | 'past'
    userId: string
}

const CUSTOMER_ACTIONABLE_STATUSES = new Set([
    'reserved',
    'requested',
    'confirmed',
    'expired',
    'reschedule_requested',
])

function buildLocationLabel(location: {
    businessName: string | null
    address: string | null
}): string {
    return [location.businessName, location.address].filter(Boolean).join(' • ')
}

export function createCustomerCancelBookingAction(tab: 'upcoming' | 'past') {
    return async function cancelCustomerBooking(formData: FormData) {
        'use server'

        const bookingId = formData.get('bookingId')

        if (typeof bookingId !== 'string' || bookingId.length === 0) {
            throw new Error('Booking id is required')
        }

        await cancelBooking(bookingId, {
            reason: 'Cancelled by customer from My Appointments',
        })

        redirect(`/scheduling/bookings?tab=${tab}`)
    }
}

export async function SchedulingBookingsPageFeature({
    tab,
    userId,
}: SchedulingBookingsPageFeatureProps) {
    const nowIso = new Date().toISOString()
    const [bookingsResult, tenantLocation] = await Promise.all([
        getBookings(
            tab === 'upcoming'
                ? { page: 1, pageSize: 20, fromDate: nowIso }
                : { page: 1, pageSize: 20, toDate: nowIso },
            { customerId: userId }
        ),
        getTenantLocationView(),
    ])

    const bookings = bookingsResult.items.map(toBookingCardItem)
    const isUpcoming = tab === 'upcoming'
    const cancelAction = createCustomerCancelBookingAction(tab)
    const locationLabel = buildLocationLabel(tenantLocation) || 'Location shared after confirmation'

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="My Appointments"
                description="Review upcoming installation times, revisit past appointments, and make changes to your own bookings."
            />

            <WorkspacePageContextCard
                title="Appointments"
                description="Switch between upcoming and past appointments or start a new appointment."
            >
                <div className="inline-flex gap-1 border border-neutral-700 bg-neutral-900/80 p-1">
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
                <Button asChild>
                    <Link href="/scheduling/book">Book Appointment</Link>
                </Button>
            </WorkspacePageContextCard>

            <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-base text-neutral-100">
                        {isUpcoming ? 'Upcoming Appointments' : 'Past Appointments'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <WorkspaceEmptyState
                            title={
                                isUpcoming ? 'No upcoming appointments' : 'No past appointments yet'
                            }
                            description={
                                isUpcoming
                                    ? 'When you book an installation, it will appear here.'
                                    : 'Your appointment history will appear here after your first completed booking.'
                            }
                            action={
                                isUpcoming ? (
                                    <Button asChild>
                                        <Link href="/scheduling/book">Book Appointment</Link>
                                    </Button>
                                ) : null
                            }
                            className="min-h-80 border-0 bg-transparent shadow-none"
                        />
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => {
                                const displayStatus = String(
                                    booking.displayStatus ?? booking.status
                                )
                                const canManageFromList =
                                    isUpcoming &&
                                    CUSTOMER_ACTIONABLE_STATUSES.has(displayStatus) &&
                                    displayStatus !== 'cancelled' &&
                                    displayStatus !== 'completed'

                                return (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        locationLabel={locationLabel}
                                        actions={
                                            <>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/scheduling/${booking.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                                {canManageFromList ? (
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link
                                                            href={`/scheduling/${booking.id}/edit`}
                                                        >
                                                            Reschedule
                                                        </Link>
                                                    </Button>
                                                ) : null}
                                                {canManageFromList ? (
                                                    <form action={cancelAction}>
                                                        <input
                                                            type="hidden"
                                                            name="bookingId"
                                                            value={booking.id}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            type="submit"
                                                            variant="outline"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </form>
                                                ) : null}
                                            </>
                                        }
                                    />
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
