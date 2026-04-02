import { notFound, redirect } from 'next/navigation'

import { BookingDetailPageFeature } from '@/features/scheduling/booking-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

interface ManageBookingDetailPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function ManageBookingDetailPage({ params }: ManageBookingDetailPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'scheduling.read.all')) {
        redirect('/scheduling')
    }

    const { bookingId } = await params

    if (!bookingId) {
        notFound()
    }

    return <BookingDetailPageFeature bookingId={bookingId} userId={session.userId} isManageView />
}
