import Link from 'next/link'

import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { getCatalogWrapById } from '@/lib/fetchers/catalog.fetchers'
import { WrapManagerDetailPageClient } from './wrap-manager-detail-page.client'

export interface WrapManagerDetailPageProps {
    id: string
}

export async function WrapManagerDetailPage({ id }: WrapManagerDetailPageProps) {
    const wrap = await getCatalogWrapById(id, { includeHidden: true })
    if (!wrap) notFound()

    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                total={1}
                actions={
                    <Button variant="outline" asChild>
                        <Link href="/catalog/manage">Back</Link>
                    </Button>
                }
            />

            <WrapManagerDetailPageClient wrap={wrap} />
        </div>
    )
}
