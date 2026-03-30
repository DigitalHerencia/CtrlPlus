import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/currency'
import { formatInstallationTime } from '@/lib/utils/dates'
import type { CatalogBrowseCardDTO } from '@/types/catalog.types'

interface WrapCardProps {
    wrap: CatalogBrowseCardDTO
}

export function WrapCard({ wrap }: WrapCardProps) {
    const installationTime = formatInstallationTime(wrap.installationMinutes)
    const detailHref = `/catalog/${wrap.id}`
    const previewLabel =
        wrap.previewHref === detailHref ? 'Open Product Page' : 'Preview on Your Vehicle'

    return (
        <Card className="group flex h-full flex-col overflow-hidden border-neutral-800 bg-neutral-950/80 text-neutral-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-600/70">
            <Link
                href={detailHref}
                aria-label={`View ${wrap.name} product page`}
                className="relative block overflow-hidden border-b border-neutral-800 bg-neutral-900"
            >
                {wrap.displayImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={wrap.displayImage.cardUrl}
                        alt={wrap.name}
                        className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-56 items-center justify-center bg-neutral-900 text-sm text-neutral-500">
                        No display asset
                    </div>
                )}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <Badge
                        variant="secondary"
                        className="border border-neutral-800 bg-black/70 text-neutral-100"
                    >
                        {wrap.readiness.canPublish ? 'Ready' : 'Needs assets'}
                    </Badge>
                    {wrap.isHidden ? (
                        <Badge
                            variant="outline"
                            className="border-amber-500/50 bg-black/60 text-amber-200"
                        >
                            Hidden
                        </Badge>
                    ) : null}
                </div>
            </Link>

            <CardHeader className="gap-3 pb-3">
                <div className="space-y-2">
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
                    <CardTitle className="line-clamp-2 text-xl leading-tight">
                        {wrap.name}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4 pb-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
                    {wrap.description ??
                        'Premium wrap package prepared for browsing, booking, and visualization.'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    {installationTime ? (
                        <Badge variant="secondary" className="bg-neutral-900 text-neutral-200">
                            {installationTime} install
                        </Badge>
                    ) : null}
                    {wrap.readiness.missingRequiredAssetRoles.length > 0 ? (
                        <Badge variant="outline" className="border-red-500/40 text-red-200">
                            Missing {wrap.readiness.missingRequiredAssetRoles.join(', ')}
                        </Badge>
                    ) : null}
                </div>
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-800 pt-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Price</p>
                    <p className="text-2xl font-black tabular-nums text-neutral-100">
                        {formatPrice(wrap.price)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        size="sm"
                        className="transition-transform group-hover:translate-x-0.5"
                    >
                        <Link href={wrap.previewHref}>{previewLabel}</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href={detailHref}>View Details</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
