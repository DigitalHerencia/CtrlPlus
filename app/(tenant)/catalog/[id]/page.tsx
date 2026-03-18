import { redirect } from 'next/navigation'

import { CatalogDetailPageFeature } from '@/features/catalog/catalog-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'

interface WrapDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function WrapDetailPage({ params }: WrapDetailPageProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const { id } = await params

    return (
        <CatalogDetailPageFeature
            wrapId={id}
            canManageCatalog={hasCapability(session.authz, 'catalog.manage')}
        />
    )
}
