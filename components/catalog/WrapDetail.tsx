import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { CatalogDetailDTO } from '@/types/catalog.types'
import { WrapDetailCarousel } from './wrap-detail-carousel'
import { WrapDetailHeader } from './wrap-detail-header'
import { WrapDetailSpecs } from './wrap-detail-specs'
import { WrapDetailSummary } from './wrap-detail-summary'

interface WrapDetailProps {
    wrap: CatalogDetailDTO
    canManageCatalog: boolean
}

export function WrapDetail({ wrap, canManageCatalog }: WrapDetailProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/catalog">Back to Catalog</Link>
                </Button>
                {canManageCatalog ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/catalog/manage">Open Manager</Link>
                    </Button>
                ) : null}
            </div>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                <Card className="overflow-hidden border-neutral-800 bg-neutral-950/80 text-neutral-100">
                    <div className="border-b border-neutral-800 bg-neutral-900">
                        {wrap.displayImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={wrap.displayImage.detailUrl}
                                alt={wrap.name}
                                className="h-104 w-full object-cover"
                            />
                        ) : (
                            <div className="h-104 flex items-center justify-center text-sm text-neutral-500">
                                No display asset available
                            </div>
                        )}
                    </div>
                    <WrapDetailHeader wrap={wrap} />
                </Card>

                <div className="space-y-4">
                    <WrapDetailSummary wrap={wrap} canManageCatalog={canManageCatalog} />
                    <WrapDetailSpecs wrap={wrap} canManageCatalog={canManageCatalog} />
                </div>
            </section>

            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                <CardContent>
                    <WrapDetailCarousel name={wrap.name} images={wrap.galleryImages} />
                </CardContent>
            </Card>
        </div>
    )
}
