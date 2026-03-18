import { BookingForm } from '@/components/scheduling/booking-form'
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getWraps } from '@/lib/catalog/fetchers/get-wraps'
import { getAvailabilityWindows } from '@/lib/scheduling/fetchers/get-availability'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function BookPage() {
    const session = await getSession()

    if (!session.userId) {
        redirect('/sign-in') // Only redirect if not authenticated
    }

    let availabilityWindows: {
        id: string
        dayOfWeek: number
        startTime: string
        endTime: string
        capacity: number
    }[] = []

    try {
        const result = await getAvailabilityWindows()
        availabilityWindows = result.items.map((w) => ({
            id: w.id,
            dayOfWeek: w.dayOfWeek,
            startTime: w.startTime,
            endTime: w.endTime,
            capacity: w.capacitySlots,
        }))
    } catch {
        // Gracefully degrade
    }

    let wraps: { id: string; name: string; price: number }[] = []

    try {
        const result = await getWraps({
            includeHidden: hasCapability(session.authz, 'catalog.manage'),
        })
        wraps = result.map((w) => ({
            id: w.id,
            name: w.name,
            price: w.price,
        }))
    } catch {
        // Gracefully degrade
    }

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

            {wraps.length === 0 && (
                <div className="border border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-100">
                    No wraps are available yet. Please add wraps to the catalog before booking.
                </div>
            )}

            {availabilityWindows.length === 0 && (
                <div className="border border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-100">
                    No availability windows are configured. Please contact the shop to set up
                    booking availability.
                </div>
            )}

            <BookingForm availabilityWindows={availabilityWindows} wraps={wraps} />
        </div>
    )
}
