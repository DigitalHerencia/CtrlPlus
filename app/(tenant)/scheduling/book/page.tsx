import { redirect } from 'next/navigation'

import { SchedulingBookPageFeature } from '@/features/scheduling/scheduling-book-page-feature'
import { getSession } from '@/lib/auth/session'

export default async function BookPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    return <SchedulingBookPageFeature />
}
