import { notFound, redirect } from 'next/navigation'

import { EditBookingPageFeature } from '@/features/scheduling/edit-booking-page-feature'
import { getSession } from '@/lib/auth/session'

interface EditBookingPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const { bookingId } = await params

    if (!bookingId) {
        notFound()
    }

    return <EditBookingPageFeature bookingId={bookingId} userId={session.userId} />
}
