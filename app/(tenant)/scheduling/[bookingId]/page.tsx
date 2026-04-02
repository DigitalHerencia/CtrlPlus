import { notFound, redirect } from 'next/navigation'

import { BookingDetailPageFeature } from '@/features/scheduling/booking-detail-page-feature'
import { getSession } from '@/lib/auth/session'

interface BookingDetailPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const { bookingId } = await params

    if (!bookingId) {
        notFound()
    }

    return <BookingDetailPageFeature bookingId={bookingId} userId={session.userId} />
}
