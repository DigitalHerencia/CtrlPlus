import 'server-only'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import type { WrapDetailPageParams } from '@/types/catalog.types'

import { WrapManagerDetailPage } from './wrap-manager-detail-page-feature'

export const wrapManagerDetailRouteMetadata = {
    title: 'Manage Wrap',
    description: 'Manage wrap metadata and assets',
}

export async function WrapManagerDetailRouteFeature({ params }: WrapDetailPageParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    const { wrapId } = await params

    return <WrapManagerDetailPage id={wrapId} />
}
