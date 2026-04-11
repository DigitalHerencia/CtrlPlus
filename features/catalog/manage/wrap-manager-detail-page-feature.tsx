/**
 * @introduction Features — TODO: short one-line summary of wrap-manager-detail-page-feature.tsx
 *
 * @description TODO: longer description for wrap-manager-detail-page-feature.tsx. Keep it short — one or two sentences.
 * Domain: features
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { getCatalogWrapById } from '@/lib/fetchers/catalog.fetchers'
import { WrapManagerDetailPageClient } from './wrap-manager-detail-page.client'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'

/**
 * WrapManagerDetailPageProps — TODO: brief description of this type.
 */
export interface WrapManagerDetailPageProps {
    id: string
}

export async function WrapManagerDetailPage({ id }: WrapManagerDetailPageProps) {
    const wrap = await getCatalogWrapById(id, { includeHidden: true })
    if (!wrap) notFound()

    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                title={`Refine ${wrap.name}`}
                description="Keep this wrap listing polished with consistent visuals, pricing clarity, and preview-ready assets."
            />
            <WorkspacePageContextCard
                title="Manager Navigation"
                description="Return to inventory or continue editing this listing"
            >
                <Button variant="outline" asChild>
                    <Link href="/catalog/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>

            <WrapManagerDetailPageClient wrap={wrap} />
        </div>
    )
}
