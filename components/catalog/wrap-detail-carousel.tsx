/**
 * @introduction Components — TODO: short one-line summary of wrap-detail-carousel.tsx
 *
 * @description TODO: longer description for wrap-detail-carousel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Image from 'next/image'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

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
            <div className="h-104 flex items-center justify-center border-b border-neutral-800 bg-neutral-900 text-sm text-neutral-400">
                No catalog imagery is available for this wrap yet.
            </div>
        )
    }

    return (
        <div className="border-b border-neutral-800 bg-neutral-900">
            <Carousel
                opts={{ loop: images.length > 1 }}
                className="w-full"
                aria-label={`${name} image carousel`}
            >
                <CarouselContent className="ml-0">
                    {images.map((image, index) => (
                        <CarouselItem key={image.id} className="pl-0">
                            <Image
                                src={image.detailUrl}
                                alt={
                                    index === 0
                                        ? `${name} hero image`
                                        : `${name} gallery image ${index}`
                                }
                                width={1600}
                                height={1200}
                                sizes="(min-width: 1280px) 58vw, 100vw"
                                className="h-104 w-full object-contain"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {images.length > 1 ? (
                    <>
                        <CarouselPrevious className="left-4 top-1/2 h-9 w-9 -translate-y-1/2 rounded-none border-neutral-700 bg-neutral-950/80 text-neutral-100 transition-all duration-300 hover:border-blue-600 hover:bg-neutral-900 hover:text-blue-600" />
                        <CarouselNext className="right-4 top-1/2 h-9 w-9 -translate-y-1/2 rounded-none border-neutral-700 bg-neutral-950/80 text-neutral-100 transition-all duration-300 hover:border-blue-600 hover:bg-neutral-900 hover:text-blue-600" />
                    </>
                ) : null}
            </Carousel>
        </div>
    )
}
