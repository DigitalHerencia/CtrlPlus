import 'server-only'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import type { WrapDetailPageParams } from '@/types/catalog.types'

import {
    CatalogDetailPageFeature,
    generateCatalogWrapMetadata,
} from './catalog-detail-page-feature'

export async function generateCatalogDetailRouteMetadata({ params }: WrapDetailPageParams) {
    return generateCatalogWrapMetadata(params)
}

export async function CatalogDetailRouteFeature({ params }: WrapDetailPageParams) {
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
