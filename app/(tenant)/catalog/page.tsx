import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { parseCatalogSearchParams } from '@/lib/catalog/search-params'
import { CatalogBrowsePageFeature } from '@/features/catalog/catalog-browse-page-feature'
import type { CatalogPageSearchParams } from '@/types/catalog/route-types'

export default async function CatalogPage({ searchParams }: CatalogPageSearchParams) {
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
