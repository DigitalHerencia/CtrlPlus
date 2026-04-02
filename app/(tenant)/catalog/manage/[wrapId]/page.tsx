import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { WrapManagerDetailPage } from '@/features/catalog/manage/wrap-manager-detail-page-feature'
import type { WrapDetailPageParams } from '@/types/catalog.types'

export const metadata = {
    title: 'Manage Wrap',
    description: 'Manage wrap metadata and assets',
}

export default async function WrapManagerPage({ params }: WrapDetailPageParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    const { id } = await params

    return <WrapManagerDetailPage id={id} />
}
