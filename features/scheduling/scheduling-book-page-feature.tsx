import 'server-only'

import Link from 'next/link'

import {
    WorkspaceEmptyState,
    WorkspacePageContextCard,
    WorkspacePageIntro,
} from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAvailabilityWindows, getActiveBookingDraft } from '@/lib/fetchers/scheduling.fetchers'
import { getUserSettingsView } from '@/lib/fetchers/settings.fetchers'

import { SchedulingBookingFormClient } from './scheduling-booking-form-client'

interface SchedulingBookPageFeatureProps {
    canViewHiddenWraps: boolean
}

export async function SchedulingBookPageFeature({
    canViewHiddenWraps,
}: SchedulingBookPageFeatureProps) {
    void canViewHiddenWraps

    const [availabilityResult, draft, settings] = await Promise.all([
        getAvailabilityWindows(),
        getActiveBookingDraft(),
        getUserSettingsView(),
    ])

    const availabilityWindows = availabilityResult.items.map((window) => ({
        id: window.id,
        dayOfWeek: window.dayOfWeek,
        startTime: window.startTime,
        endTime: window.endTime,
        capacity: window.capacitySlots,
    }))

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Book Appointment"
                description="Choose an installation time, confirm your details, and submit your wrap appointment in one place."
            />
            <WorkspacePageContextCard
                title="Booking"
                description="Keep moving through your customer flow without leaving scheduling."
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling/bookings">My Appointments</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/visualizer">Back to Visualizer</Link>
                </Button>
            </WorkspacePageContextCard>

            {!draft ? (
                <WorkspaceEmptyState
                    title="Choose a wrap before booking"
                    description="Start in the catalog or visualizer so your selected wrap carries into your appointment request."
                    action={
                        <Button asChild>
                            <Link href="/catalog">Browse Wraps</Link>
                        </Button>
                    }
                    className="min-h-[320px] border border-neutral-700 bg-neutral-950/80"
                />
            ) : null}

            {draft && availabilityWindows.length === 0 ? (
                <WorkspaceEmptyState
                    title="No appointment times are available right now"
                    description="Check back soon for the next open installation window."
                    action={
                        <Button asChild variant="outline">
                            <Link href="/scheduling/bookings">My Appointments</Link>
                        </Button>
                    }
                    className="min-h-[320px] border border-neutral-700 bg-neutral-950/80"
                />
            ) : null}

            {draft && availabilityWindows.length > 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="p-4 sm:p-6">
                        <SchedulingBookingFormClient
                            availabilityWindows={availabilityWindows}
                            draft={draft}
                            initialSettings={settings}
                            minDate={new Date()}
                        />
                    </CardContent>
                </Card>
            ) : null}

            {!draft || availabilityWindows.length === 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="py-6 text-center text-sm text-neutral-400">
                        Appointment booking becomes available as soon as your wrap selection and the next open time are ready.
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
