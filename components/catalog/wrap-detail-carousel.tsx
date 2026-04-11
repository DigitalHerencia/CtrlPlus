/**
 * @introduction Components — TODO: short one-line summary of wrap-detail-carousel.tsx
 *
 * @description TODO: longer description for wrap-detail-carousel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Image from 'next/image'

import type { CatalogAssetImageDTO } from '@/types/catalog.types'

interface WrapDetailCarouselProps {
    name: string
    images: CatalogAssetImageDTO[]
}

/**
 * WrapDetailCarousel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapDetailCarousel({ name, images }: WrapDetailCarouselProps) {
    if (images.length === 0) {
        return (
            <p className="text-sm text-neutral-400">
                No gallery-ready catalog imagery is available for this wrap yet.
            </p>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
                >
                    <Image
                        src={image.detailUrl}
                        alt={`${name} gallery asset`}
                        width={800}
                        height={560}
                        sizes="(min-width: 1280px) 26vw, (min-width: 768px) 50vw, 100vw"
                        className="h-56 w-full object-cover"
                    />
                </div>
            ))}
        </div>
    )
}
