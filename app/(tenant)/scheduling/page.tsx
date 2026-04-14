import { redirect } from 'next/navigation'

import { SchedulingDashboardPageFeature } from '@/features/scheduling/scheduling-dashboard-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

interface SchedulingPageProps {
    searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>
}

export default async function SchedulingPage({ searchParams }: SchedulingPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return (
        <SchedulingDashboardPageFeature
            searchParams={searchParams}
            userId={session.userId}
            canManageAppointments={hasCapability(session.authz, 'scheduling.read.all')}
        />
    )
}
