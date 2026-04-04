import { redirect } from 'next/navigation'

import { WrapManagerPageFeature } from '@/features/catalog/manage/wrap-manager-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { parseCatalogSearchParams } from '@/lib/utils/search-params'
import type { CatalogPageSearchParams } from '@/types/catalog.types'

export default async function CatalogManagerPage({ searchParams }: CatalogPageSearchParams) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    if (!hasCapability(session.authz, 'catalog.manage')) {
        redirect('/catalog')
    }

    const parsedSearch = parseCatalogSearchParams(await searchParams)

    return <WrapManagerPageFeature filters={parsedSearch.filters} />
}
