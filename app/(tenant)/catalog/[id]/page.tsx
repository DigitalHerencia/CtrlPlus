import { redirect } from 'next/navigation'

import { CatalogDetailPageFeature } from '@/features/catalog/catalog-detail-page-feature'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { getCatalogWrapById } from '@/lib/fetchers/catalog.fetchers'
import { type WrapDetailPageParams } from '@/types/catalog'

export async function generateMetadata({ params }: WrapDetailPageParams) {
    const { id } = await params
    const wrap = await getCatalogWrapById(id, { includeHidden: true })

    if (!wrap) {
        return { title: 'Wrap Not Found' }
    }

    return {
        title: wrap.name,
        description: wrap.description ?? undefined,
        openGraph: {
            title: wrap.name,
            description: wrap.description ?? undefined,
            images: wrap.heroImage ? [wrap.heroImage.detailUrl ?? wrap.heroImage.url] : undefined,
        },
    }
}

export default async function WrapDetailPage({ params }: WrapDetailPageParams) {
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
