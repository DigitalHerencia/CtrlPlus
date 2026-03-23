import { redirect } from 'next/navigation'

import { SchedulingPageFeature } from '@/features/scheduling/scheduling-page-feature'
import { getSession } from '@/lib/auth/session'

export default async function SchedulingPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return <SchedulingPageFeature />
}
