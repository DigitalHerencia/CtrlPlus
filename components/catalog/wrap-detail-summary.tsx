/**
 * @introduction Components — TODO: short one-line summary of wrap-detail-summary.tsx
 *
 * @description TODO: longer description for wrap-detail-summary.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInstallationTime } from '@/lib/utils/dates'
import type { CatalogDetailDTO } from '@/types/catalog.types'
import Link from 'next/link'

interface WrapDetailSummaryProps {
    wrap: CatalogDetailDTO
    canManageCatalog: boolean
}

/**
 * WrapDetailSummary — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapDetailSummary({ wrap, canManageCatalog }: WrapDetailSummaryProps) {
    const installationTime = formatInstallationTime(wrap.installationMinutes)

    return (
        <>
            {canManageCatalog ? (
                <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Availability &amp; Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={wrap.readiness.canPublish ? 'secondary' : 'outline'}
                                className={
                                    wrap.readiness.canPublish
                                        ? 'bg-emerald-500/15 text-emerald-200'
                                        : 'border-red-500/40 text-red-200'
                                }
                            >
                                {wrap.readiness.canPublish
                                    ? 'Publish-ready'
                                    : 'Needs asset attention'}
                            </Badge>
                            {wrap.isHidden ? (
                                <Badge
                                    variant="outline"
                                    className="border-amber-500/40 text-amber-200"
                                >
                                    Hidden from customers
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-blue-500/15 text-blue-200">
                                    Visible in catalog
                                </Badge>
                            )}
                        </div>

                        <dl className="grid gap-3 text-sm text-neutral-300">
                            <div className="flex items-center justify-between gap-3">
                                <dt>Install time</dt>
                                <dd>{installationTime ?? 'Configured later'}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt>Gallery assets</dt>
                                <dd>{wrap.galleryImages.length}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt>Visualizer references</dt>
                                <dd>
                                    {wrap.heroImage
                                        ? `${wrap.galleryImages.length + 1} ready`
                                        : 'Missing hero'}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            ) : null}
            <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                    <Link href="/catalog">Back to Catalog</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href={`/visualizer?wrapId=${wrap.id}`}>Explore in Visualizer</Link>
                </Button>
            </div>
        </>
    )
}
