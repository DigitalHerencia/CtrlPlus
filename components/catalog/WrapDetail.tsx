import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/currency'
import { formatInstallationTime } from '@/lib/utils/dates'
import type { CatalogDetailDTO } from '@/types/catalog/domain'

interface WrapDetailProps {
    wrap: CatalogDetailDTO
    canManageCatalog: boolean
}

export function WrapDetail({ wrap, canManageCatalog }: WrapDetailProps) {
    const installationTime = formatInstallationTime(wrap.installationMinutes)

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
                    <CardHeader className="gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {wrap.categories.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant="outline"
                                            className="border-neutral-700 bg-neutral-900/70 text-neutral-200"
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                                <CardTitle className="text-4xl font-black tracking-tight">
                                    {wrap.name}
                                </CardTitle>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                                    Package Price
                                </p>
                                <p className="text-4xl font-black tabular-nums text-neutral-100">
                                    {formatPrice(wrap.price)}
                                </p>
                            </div>
                        </div>
                        <p className="max-w-3xl text-sm leading-relaxed text-neutral-300">
                            {wrap.description ??
                                'This wrap package is ready for vehicle previewing, scheduling, and catalog operations.'}
                        </p>
                    </CardHeader>
                </Card>

                <div className="space-y-4">
                    <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-lg">Availability & Readiness</CardTitle>
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
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-500/15 text-blue-200"
                                    >
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
                                    <dt>Visualizer texture</dt>
                                    <dd>{wrap.visualizerTextureImage ? 'Available' : 'Missing'}</dd>
                                </div>
                            </dl>

                            {wrap.readiness.missingRequiredAssetRoles.length > 0 ? (
                                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                                    Missing required roles:{' '}
                                    {wrap.readiness.missingRequiredAssetRoles.join(', ')}
                                </div>
                            ) : null}
                            {wrap.readiness.issues.length > 0 ? (
                                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-3 text-sm text-neutral-200">
                                    <ul className="space-y-2">
                                        {wrap.readiness.issues.map((issue) => (
                                            <li key={issue.code}>{issue.message}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/scheduling">Book Installation</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={`/visualizer?wrapId=${wrap.id}`}>Preview on Vehicle</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-lg">Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    {wrap.galleryImages.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {wrap.galleryImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image.detailUrl}
                                        alt={`${wrap.name} gallery asset`}
                                        className="h-56 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-400">
                            No gallery-ready catalog imagery is available for this wrap yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
