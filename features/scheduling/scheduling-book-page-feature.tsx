import 'server-only'

import Link from 'next/link'

import { WorkspaceEmptyState, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getWraps } from '@/lib/fetchers/catalog.fetchers'
import { getAvailabilityWindows } from '@/lib/fetchers/scheduling.fetchers'

import { SchedulingBookingFormClient } from './scheduling-booking-form-client'

interface SchedulingBookPageFeatureProps {
    canViewHiddenWraps: boolean
}

export async function SchedulingBookPageFeature({
    canViewHiddenWraps,
}: SchedulingBookPageFeatureProps) {
    const [availabilityResult, wrapsResult] = await Promise.all([
        getAvailabilityWindows(),
        getWraps({ includeHidden: canViewHiddenWraps }),
    ])

    const availabilityWindows = availabilityResult.items.map((window) => ({
        id: window.id,
        dayOfWeek: window.dayOfWeek,
        startTime: window.startTime,
        endTime: window.endTime,
        capacity: window.capacitySlots,
    }))

    const wraps = wrapsResult.map((wrap) => ({
        id: wrap.id,
        name: wrap.name,
        price: wrap.price,
    }))

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Booking"
                title="Book an Appointment"
                description="Select an available date, claim a time slot, and attach the right wrap package for the installation."
                actions={
                    <Button asChild variant="outline">
                        <Link href="/scheduling">Back to Calendar</Link>
                    </Button>
                }
            />

            {wraps.length === 0 ? (
                <WorkspaceEmptyState
                    title="No wraps are available yet"
                    description="Add wrap services to the catalog before customers can schedule an appointment."
                    action={
                        <Button asChild>
                            <Link href="/catalog/manage">Open Catalog</Link>
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

            {availabilityWindows.length > 0 && wraps.length > 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="p-6">
                        <SchedulingBookingFormClient
                            availabilityWindows={availabilityWindows}
                            wraps={wraps}
                            minDate={new Date()}
                        />
                    </CardContent>
                </Card>
            ) : null}

            {availabilityWindows.length === 0 || wraps.length === 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="py-10 text-center text-sm text-neutral-400">
                        The booking flow will become available once the missing setup is resolved.
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
