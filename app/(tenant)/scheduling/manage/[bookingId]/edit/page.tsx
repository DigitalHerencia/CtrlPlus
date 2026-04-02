import { notFound, redirect } from 'next/navigation'

import { EditManagedBookingPageFeature } from '@/features/scheduling/manage/edit-managed-booking-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

interface ManageEditBookingPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function ManageEditBookingPage({ params }: ManageEditBookingPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'scheduling.write.all')) {
        redirect('/scheduling')
    }

    const { bookingId } = await params

    if (!bookingId) {
        notFound()
    }

    return <EditManagedBookingPageFeature bookingId={bookingId} userId={session.userId} />
}
