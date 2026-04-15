import 'server-only'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

import { NewWrapPageFeature } from './new-wrap-page-feature'

export const newWrapRouteMetadata = {
    title: 'Create Wrap',
    description: 'Create a new vehicle wrap product',
}

export async function NewWrapRouteFeature() {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    return <NewWrapPageFeature />
}
