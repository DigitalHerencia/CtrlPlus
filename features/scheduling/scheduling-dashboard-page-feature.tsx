import 'server-only'

import { SchedulingDashboardPageView } from '@/components/scheduling/scheduling-dashboard-page-view'
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
        <SchedulingDashboardPageView
            canManageAppointments={canManageAppointments}
            upcomingCount={upcomingCount}
            requestedCount={requestedCount}
            confirmedCount={confirmedCount}
            recentAppointments={recentAppointments}
            locationLabel={locationLabel}
        />
    )
}
