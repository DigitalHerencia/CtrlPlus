import type { CatalogAssetImageDTO } from '@/types/catalog.types'

interface WrapDetailCarouselProps {
    name: string
    images: CatalogAssetImageDTO[]
}

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
                    <img
                        src={image.detailUrl}
                        alt={`${name} gallery asset`}
                        className="h-56 w-full object-cover"
                    />
                </div>
            ))}
        </div>
    )
}
