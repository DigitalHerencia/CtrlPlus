import { redirect } from 'next/navigation'

import { NewManagedBookingPageFeature } from '@/features/scheduling/manage/new-managed-booking-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

export default async function ManageNewBookingPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'scheduling.write.all')) {
        redirect('/scheduling')
    }

    return <NewManagedBookingPageFeature />
}
