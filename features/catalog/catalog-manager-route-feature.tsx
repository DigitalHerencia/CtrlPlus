import 'server-only'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { parseCatalogSearchParams } from '@/lib/utils/search-params'
import type { CatalogPageSearchParams } from '@/types/catalog.types'

import { CatalogManagerPageFeature } from './catalog-manager-page-feature'

export async function CatalogManagerRouteFeature({ searchParams }: CatalogPageSearchParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    const parsedSearch = parseCatalogSearchParams(await searchParams)

    return <CatalogManagerPageFeature filters={parsedSearch.filters} />
}
