import 'server-only'

import { redirect } from 'next/navigation'

import { SchedulingBookPageView } from '@/components/scheduling/scheduling-book-page-view'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { createStandardAppointmentWindows } from '@/lib/constants/scheduling'
import { getUserSettingsView } from '@/lib/fetchers/settings.fetchers'

import { SchedulingBookingFormClient } from './scheduling-booking-form-client'

export async function SchedulingBookPageFeature() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (hasCapability(session.authz, 'scheduling.read.all')) {
        redirect('/scheduling/manage')
    }

    const settings = await getUserSettingsView()
    const availabilityWindows = createStandardAppointmentWindows()

    return (
        <SchedulingBookPageView
            bookingForm={
                <SchedulingBookingFormClient
                    availabilityWindows={availabilityWindows}
                    initialSettings={settings}
                    minDate={new Date()}
                />
            }
        />
    )
}
