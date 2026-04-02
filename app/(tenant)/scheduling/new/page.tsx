import { redirect } from 'next/navigation'

import { NewBookingPageFeature } from '@/features/scheduling/new-booking-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

export default async function NewSchedulingBookingPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return (
        <NewBookingPageFeature
            canViewHiddenWraps={hasCapability(session.authz, 'catalog.manage')}
        />
    )
}
