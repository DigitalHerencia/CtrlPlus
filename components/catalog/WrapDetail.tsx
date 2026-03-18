import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInstallationTime, formatPrice } from '@/lib/catalog/formatters'
import { type WrapDTO } from '@/lib/catalog/types'

import { WrapImageManager } from './WrapImageManager'

interface WrapDetailProps {
    wrap: WrapDTO
    canManageCatalog: boolean
}

export function WrapDetail({ wrap, canManageCatalog }: WrapDetailProps) {
    const installationTime = formatInstallationTime(wrap.installationMinutes)

    return (
        <div className="max-w-4xl space-y-5">
            <div className="flex items-center justify-between gap-3">
                <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
                    <Link href="/catalog">Back to Catalog</Link>
                </Button>
                {canManageCatalog ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/catalog/manage">Manage Catalog</Link>
                    </Button>
                ) : null}
            </div>

            <Card className="overflow-hidden border-neutral-700 bg-neutral-900 text-neutral-100">
                {wrap.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={wrap.images[0].url}
                        alt={wrap.name}
                        className="h-72 w-full object-cover"
                    />
                )}
                <CardHeader className="gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
                        Wrap Detail
                    </p>
                    <CardTitle className="text-4xl font-black tracking-tight text-neutral-100">
                        {wrap.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-3xl font-black tabular-nums text-blue-300">
                            {formatPrice(wrap.price)}
                        </span>
                        {installationTime ? (
                            <Badge variant="secondary">{installationTime} installation</Badge>
                        ) : null}
                        {wrap.categories.map((category) => (
                            <Badge key={category.id} variant="outline">
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                </CardHeader>
            </Card>

            {wrap.description ? (
                <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-neutral-100">
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-neutral-300">
                            {wrap.description}
                        </p>
                    </CardContent>
                </Card>
            ) : null}

            <Card className="border-neutral-700 bg-neutral-900 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-neutral-100">
                        Wrap Images
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {canManageCatalog ? (
                        <WrapImageManager wrapId={wrap.id} images={wrap.images} />
                    ) : wrap.images.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {wrap.images.map((image) => (
                                <div
                                    key={image.id}
                                    className="overflow-hidden border border-neutral-700 bg-neutral-900"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image.url}
                                        alt={`${wrap.name} image`}
                                        className="h-40 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-400">
                            No gallery images are available for this wrap yet.
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                    <Link href="/scheduling">Book Installation</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/visualizer">Preview on Vehicle</Link>
                </Button>
            </div>
        </div>
    )
}
