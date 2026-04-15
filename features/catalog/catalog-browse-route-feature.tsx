import 'server-only'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { parseCatalogSearchParams } from '@/lib/utils/search-params'
import type { CatalogPageSearchParams } from '@/types/catalog.types'

import { CatalogBrowsePageFeature } from './catalog-browse-page-feature'

export async function CatalogBrowseRouteFeature({ searchParams }: CatalogPageSearchParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    const parsedSearch = parseCatalogSearchParams(await searchParams)

    return (
        <CatalogBrowsePageFeature
            filters={parsedSearch.filters}
            canManageCatalog={hasCapability(session.authz, 'catalog.manage')}
        />
    )
}
