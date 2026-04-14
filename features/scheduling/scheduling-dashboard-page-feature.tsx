import 'server-only'

import Link from 'next/link'
import { CalendarClock, CircleCheckBig, ClipboardList, FolderClock } from 'lucide-react'

import { BookingCard } from '@/components/scheduling/booking-card'
import {
    WorkspaceEmptyState,
    WorkspaceMetricCard,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBookings, getUpcomingBookingCount } from '@/lib/fetchers/scheduling.fetchers'
import { getTenantLocationView } from '@/lib/fetchers/settings.fetchers'
import type { SearchParamRecord } from '@/types/common.types'

import { toBookingCardItem } from './booking.mappers'

interface SchedulingDashboardPageFeatureProps {
    searchParams?: Promise<SearchParamRecord>
    userId: string
    canManageAppointments: boolean
}

function buildLocationLabel(location: {
    businessName: string | null
    address: string | null
}): string {
    return [location.businessName, location.address].filter(Boolean).join(' • ')
}

export async function SchedulingDashboardPageFeature({
    searchParams,
    userId,
    canManageAppointments,
}: SchedulingDashboardPageFeatureProps) {
    void searchParams

    const now = new Date()
    const nowIso = now.toISOString()

    const [upcomingCount, upcomingBookings, tenantLocation] = await Promise.all([
        getUpcomingBookingCount(now, { customerId: userId }),
        getBookings({ page: 1, pageSize: 20, fromDate: nowIso }, { customerId: userId }),
        getTenantLocationView(),
    ])

    const requestedCount = upcomingBookings.items.filter(
        (item) => item.status === 'requested' || item.status === 'reschedule_requested'
    ).length
    const confirmedCount = upcomingBookings.items.filter(
        (item) => item.status === 'confirmed'
    ).length
    const recentAppointments = upcomingBookings.items.slice(0, 3).map(toBookingCardItem)
    const locationLabel = buildLocationLabel(tenantLocation) || 'Location shared after confirmation'

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Appointment Scheduling"
                description="Book consultations or installs, track the next open appointment, and keep every confirmed visit in one place."
            />

            <WorkspacePageContextCard
                title="Appointment Actions"
                description="Move between booking, your appointment history, and manager coordination without exposing admin-only routes to customer users."
            >
                <Button asChild>
                    <Link href="/scheduling/book">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" className="bg-neutral-900">
                    <Link href="/scheduling/bookings">My Appointments</Link>
                </Button>
                {canManageAppointments ? (
                    <Button asChild variant="outline" className="bg-neutral-900">
                        <Link href="/scheduling/manage">Manage Appointments</Link>
                    </Button>
                ) : null}
            </WorkspacePageContextCard>

            {canManageAppointments ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8 xl:grid-cols-3">
                    <WorkspaceMetricCard
                        label="Upcoming Appointments"
                        value={upcomingCount}
                        description="Anything still on your calendar after today."
                        icon={CalendarClock}
                    />
                    <WorkspaceMetricCard
                        label="Awaiting Review"
                        value={requestedCount}
                        description="Requests still waiting on owner/admin coordination."
                        icon={FolderClock}
                    />
                    <WorkspaceMetricCard
                        label="Confirmed"
                        value={confirmedCount}
                        description="Install times already approved and ready to go."
                        icon={CircleCheckBig}
                    />
                </div>
            ) : null}

            <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-base text-neutral-100">Next Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentAppointments.length === 0 ? (
                        <WorkspaceEmptyState
                            title="No upcoming appointments"
                            description="Book your first consultation or install appointment to get started."
                            action={
                                <Button asChild>
                                    <Link href="/scheduling/book">Book Appointment</Link>
                                </Button>
                            }
                            className="min-h-70 border-0 bg-transparent shadow-none"
                        />
                    ) : (
                        <div className="space-y-4">
                            {recentAppointments.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    locationLabel={locationLabel}
                                    actions={
                                        <>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/scheduling/${booking.id}`}>View</Link>
                                            </Button>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/scheduling/${booking.id}/edit`}>
                                                    Edit
                                                </Link>
                                            </Button>
                                        </>
                                    }
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {canManageAppointments ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                                Install Location
                            </p>
                            <p className="text-sm text-neutral-100">{locationLabel}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                            <p className="text-sm text-neutral-100">
                                Owner/admin teams coordinate confirmations and reschedules from the
                                manager appointment board.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
