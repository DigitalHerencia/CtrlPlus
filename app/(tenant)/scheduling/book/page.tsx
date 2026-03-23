import { redirect } from 'next/navigation'

import { SchedulingBookPageFeature } from '@/features/scheduling/scheduling-book-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

export default async function BookPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return (
        <SchedulingBookPageFeature
            canViewHiddenWraps={hasCapability(session.authz, 'catalog.manage')}
        />
    )
}
