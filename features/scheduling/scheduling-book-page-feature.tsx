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
                label="Booking"
                title="Request Installation"
                description="Carry the selected wrap, preview, and customer details through a single checkout step instead of restarting the journey."
            />
            <WorkspacePageContextCard
                title="Booking Navigation"
                description="Return to your vehicle preview or browse wraps again before submitting the request."
            >
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                        <Link href="/visualizer">Back to Visualizer</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/catalog">Browse Catalog</Link>
                    </Button>
                </div>
            </WorkspacePageContextCard>

            {!draft ? (
                <WorkspaceEmptyState
                    title="Choose a wrap first"
                    description="Start from the catalog or visualizer so we can carry your selected wrap into scheduling."
                    action={
                        <Button asChild>
                            <Link href="/catalog">Open Catalog</Link>
                        </Button>
                    }
                    className="border border-neutral-700 bg-neutral-950/80"
                />
            ) : null}

            {availabilityWindows.length === 0 ? (
                <WorkspaceEmptyState
                    title="No availability windows configured"
                    description="Configure scheduling windows before starting the booking flow."
                    action={
                        <Button asChild variant="outline">
                            <Link href="/scheduling">Review Calendar</Link>
                        </Button>
                    }
                    className="border border-neutral-700 bg-neutral-950/80"
                />
            ) : null}

            {draft && availabilityWindows.length > 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="p-6">
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
                    <CardContent className="py-10 text-center text-sm text-neutral-400">
                        The booking checkout becomes available once the missing setup is resolved.
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
