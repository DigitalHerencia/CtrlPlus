/**
 * @introduction Components — TODO: short one-line summary of WrapDetail.tsx
 *
 * @description TODO: longer description for WrapDetail.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'
import Image from 'next/image'

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

/**
 * WrapDetail — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
                            <Image
                                src={wrap.displayImage.detailUrl}
                                alt={wrap.name}
                                width={1600}
                                height={1200}
                                sizes="(min-width: 1280px) 58vw, 100vw"
                                className="h-[26rem] w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-[26rem] items-center justify-center text-sm text-neutral-500">
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
