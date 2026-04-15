import Link from 'next/link'
import type { ReactNode } from 'react'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'

interface SchedulingBookPageViewProps {
    bookingForm: ReactNode
}

export function SchedulingBookPageView({ bookingForm }: SchedulingBookPageViewProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Scheduling"
                title="Book Appointment"
                description="Choose a weekday appointment slot between 8:00 AM and 6:00 PM. All appointments are one hour."
            />
            <WorkspacePageContextCard
                title="Booking"
                description="Set your appointment time and submit your request. Admin and owner staff will manage confirmations and updates."
            >
                <Button asChild variant="outline">
                    <Link href="/scheduling">My Appointments</Link>
                </Button>
            </WorkspacePageContextCard>

            {bookingForm}
        </div>
    )
}
