import { redirect } from 'next/navigation'

import { BookingsManagerPageFeature } from '@/features/scheduling/manage/bookings-manager-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

interface ManageSchedulingPageProps {
    searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>
}

export default async function ManageSchedulingPage({ searchParams }: ManageSchedulingPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'scheduling.read.all')) {
        redirect('/scheduling')
    }

    return <BookingsManagerPageFeature searchParams={searchParams} />
}
