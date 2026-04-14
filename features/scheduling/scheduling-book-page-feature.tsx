import 'server-only'

import Link from 'next/link'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAvailabilityWindows } from '@/lib/fetchers/scheduling.fetchers'
import { getUserSettingsView } from '@/lib/fetchers/settings.fetchers'

import { SchedulingBookingFormClient } from './scheduling-booking-form-client'

export async function SchedulingBookPageFeature() {
    const [availabilityResult, settings] = await Promise.all([
        getAvailabilityWindows(),
        getUserSettingsView(),
    ])

    const availabilityWindows = availabilityResult.items.map((window) => ({
        id: window.id,
        dayOfWeek: window.dayOfWeek,
        startTime: window.startTime,
        endTime: window.endTime,
        capacity: window.capacitySlots,
    }))

    const fallbackTimeRanges = [
        ['09:00', '10:00'],
        ['10:00', '11:00'],
        ['11:00', '12:00'],
        ['12:00', '13:00'],
        ['13:00', '14:00'],
        ['14:00', '15:00'],
        ['15:00', '16:00'],
        ['16:00', '17:00'],
    ] as const

    const effectiveAvailabilityWindows =
        availabilityWindows.length > 0
            ? availabilityWindows
            : [0, 1, 2, 3, 4, 5, 6].flatMap((dayOfWeek) =>
                  fallbackTimeRanges.map(([startTime, endTime], index) => ({
                      id: `fallback-${dayOfWeek}-${index}`,
                      dayOfWeek,
                      startTime,
                      endTime,
                      capacity: 4,
                  }))
              )

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Book Appointment"
                description="Choose a consultation or install time, confirm your details, and submit your appointment in one place."
            />
            <WorkspacePageContextCard
                title="Booking"
                description="Set your appointment time and submit your request. Admin and owner staff will manage confirmations and updates."
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling/bookings">My Appointments</Link>
                </Button>
            </WorkspacePageContextCard>

            <SchedulingBookingFormClient
                availabilityWindows={effectiveAvailabilityWindows}
                initialSettings={settings}
                minDate={new Date()}
            />

            {availabilityWindows.length === 0 ? (
                <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
                    <CardContent className="py-6 text-center text-sm text-neutral-400">
                        Availability windows are not configured yet, so appointment requests use
                        temporary hourly slots from 9:00 AM to 5:00 PM while admin sets the full
                        schedule.
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
