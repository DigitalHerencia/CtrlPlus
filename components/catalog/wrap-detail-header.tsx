
import { Badge } from '@/components/ui/badge'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils/currency'
import type { CatalogDetailDTO } from '@/types/catalog.types'

interface WrapDetailHeaderProps {
    wrap: CatalogDetailDTO
}


export function WrapDetailHeader({ wrap }: WrapDetailHeaderProps) {
    return (
        <CardHeader className="space-y-4">
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
                <div className="w-full space-y-2 text-left sm:w-auto sm:text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                        Package Price
                    </p>
                    <p className="text-4xl font-black tabular-nums text-neutral-100">
                        {formatPrice(wrap.price)}
                    </p>
                </div>
            </div>
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-neutral-300">
                {wrap.description ??
                    'This wrap package is ready for vehicle previewing, scheduling, and catalog operations.'}
            </p>
        </CardHeader>
    )
}
