import Link from 'next/link'

import {
    WorkspaceEmptyState,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BookingCard, type BookingCardItem } from './booking-card'

interface SchedulingBookingViewItem {
    booking: BookingCardItem
    canManageFromList: boolean
}

interface SchedulingBookingsPageViewProps {
    isUpcoming: boolean
    bookings: SchedulingBookingViewItem[]
    locationLabel: string
    cancelAction: (formData: FormData) => Promise<void>
}

export function SchedulingBookingsPageView({
    isUpcoming,
    bookings,
    locationLabel,
    cancelAction,
}: SchedulingBookingsPageViewProps) {
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
                <Tabs value={isUpcoming ? 'upcoming' : 'past'} className="w-full">
                    <TabsList>
                        <TabsTrigger value="upcoming" asChild>
                            <Link href="/scheduling?tab=upcoming">Upcoming</Link>
                        </TabsTrigger>
                        <TabsTrigger value="past" asChild>
                            <Link href="/scheduling?tab=past">Past</Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button asChild>
                    <Link href="/scheduling/new">Book Appointment</Link>
                </Button>
            </WorkspacePageContextCard>

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
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
                                        <Link href="/scheduling/new">Book Appointment</Link>
                                    </Button>
                                ) : null
                            }
                            className="min-h-80 border-0 bg-transparent shadow-none"
                        />
                    ) : (
                        <div className="space-y-4">
                            {bookings.map(({ booking, canManageFromList }) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    locationLabel={locationLabel}
                                    actions={
                                        <>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/scheduling/${booking.id}`}>View</Link>
                                            </Button>
                                            {canManageFromList ? (
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/scheduling/${booking.id}/edit`}>
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
