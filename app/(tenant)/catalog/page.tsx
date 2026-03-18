import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { parseCatalogSearchParams } from '@/lib/catalog/search-params'
import { CatalogBrowsePageFeature } from '@/features/catalog/catalog-browse-page-feature'

interface CatalogPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
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
