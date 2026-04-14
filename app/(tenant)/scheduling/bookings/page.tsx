import { redirect } from 'next/navigation'

import { SchedulingBookingsPageFeature } from '@/features/scheduling/scheduling-bookings-page-feature'
import { getSession } from '@/lib/auth/session'

interface BookingsPageProps {
    searchParams: Promise<{ tab?: string | string[] }>
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const { tab } = await searchParams
    const normalizedTab = (Array.isArray(tab) ? tab[0] : tab) === 'past' ? 'past' : 'upcoming'

    return <SchedulingBookingsPageFeature tab={normalizedTab} userId={session.userId} />
}
