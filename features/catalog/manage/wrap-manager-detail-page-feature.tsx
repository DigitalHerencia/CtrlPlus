import { notFound } from 'next/navigation'

import { WrapManagerDetailPageView } from '@/components/catalog/manage/wrap-manager-detail-page-view'
import { getCatalogWrapById } from '@/lib/fetchers/catalog.fetchers'

import { WrapManagerDetailPageClient } from './wrap-manager-detail-page.client'

export interface WrapManagerDetailPageProps {
    id: string
}

export async function WrapManagerDetailPage({ id }: WrapManagerDetailPageProps) {
    const wrap = await getCatalogWrapById(id, { includeHidden: true })

    if (!wrap) {
        notFound()
    }

    return (
        <WrapManagerDetailPageView wrapName={wrap.name}>
            <WrapManagerDetailPageClient wrap={wrap} />
        </WrapManagerDetailPageView>
    )
}
