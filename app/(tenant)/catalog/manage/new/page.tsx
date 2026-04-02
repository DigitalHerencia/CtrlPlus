import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { NewWrapPageFeature } from '@/features/catalog/manage/new-wrap-page-feature'

export const metadata = {
    title: 'Create Wrap',
    description: 'Create a new vehicle wrap product',
}

export default async function NewWrapPage() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    return <NewWrapPageFeature />
}
