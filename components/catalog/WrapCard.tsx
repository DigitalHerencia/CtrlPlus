'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInstallationTime, formatPrice } from '@/lib/catalog/formatters'
import Link from 'next/link'

export interface WrapCardData {
    id: string
    name: string
    description: string | null
    price: number
    installationMinutes: number | null
    images: Array<{ id: string; url: string; displayOrder: number }>
}

interface WrapCardProps {
    wrap: WrapCardData
}

export function WrapCard({ wrap }: WrapCardProps) {
    const installationTime = formatInstallationTime(wrap.installationMinutes)
    const image = wrap.images[0]

    return (
        <Card className="group flex h-full flex-col overflow-hidden border-neutral-700 bg-neutral-900 text-neutral-100 transition duration-200 hover:-translate-y-1 hover:border-blue-600">
            {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.url} alt={wrap.name} className="h-44 w-full object-cover" />
            )}

            <CardHeader className="gap-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-lg leading-tight text-neutral-100">
                        {wrap.name}
                    </CardTitle>
                    <span className="border border-blue-600/20 bg-blue-600/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
                        Wrap
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                {wrap.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-neutral-400">{wrap.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {installationTime && (
                        <Badge variant="secondary" className="text-[10px]">
                            {installationTime}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-neutral-800 pt-3">
                <span className="text-xl font-black tabular-nums text-neutral-100">
                    {formatPrice(wrap.price)}
                </span>
                <Button
                    asChild
                    size="sm"
                    className="transition-transform group-hover:translate-x-0.5"
                >
                    <Link href={`/catalog/${wrap.id}`}>View details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
