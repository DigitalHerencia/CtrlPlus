import Link from 'next/link'

import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { Button } from '@/components/ui/button'
import type { CatalogDetailDTO } from '@/types/catalog.types'
import { WrapManagerDetailPageClient } from './wrap-manager-detail-page.client'

export interface WrapManagerDetailPageProps {
    wrap: CatalogDetailDTO
}

export function WrapManagerDetailPage({ wrap }: WrapManagerDetailPageProps) {
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
