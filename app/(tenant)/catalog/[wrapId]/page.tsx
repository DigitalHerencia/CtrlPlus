import { redirect } from 'next/navigation'

import { CatalogDetailPageFeature } from '@/features/catalog/catalog-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { generateCatalogWrapMetadata } from '@/features/catalog/catalog-detail-page-feature'
import type { WrapDetailPageParams } from '@/types/catalog.types'

export async function generateMetadata({ params }: WrapDetailPageParams) {
    return generateCatalogWrapMetadata(params)
}

export default async function WrapDetailPage({ params }: WrapDetailPageParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const { wrapId } = await params

    return (
        <CatalogDetailPageFeature
            wrapId={wrapId}
            canManageCatalog={hasCapability(session.authz, 'catalog.manage')}
        />
    )
}
