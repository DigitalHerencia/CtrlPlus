'use client'

import Image from 'next/image'

import { WrapGalleryManager } from '@/components/catalog/wrap-images/wrap-gallery-manager'
import { WrapImageCard } from '@/components/catalog/wrap-images/wrap-image-card'
import { WrapImageList } from '@/components/catalog/wrap-images/wrap-image-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CatalogDetailDTO } from '@/types/catalog.types'

export interface WrapAssetManagerProps {
    wrap: CatalogDetailDTO
}

export function WrapAssetManager({ wrap }: WrapAssetManagerProps) {
    return (
        <WrapGalleryManager>
            <Card>
                <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                    <CardDescription>Primary wrap display image</CardDescription>
                </CardHeader>
                <CardContent>
                    {wrap.heroImage ? (
                        <WrapImageCard>
                            <Image
                                src={wrap.heroImage.detailUrl}
                                alt={wrap.heroImage.id}
                                width={1200}
                                height={675}
                                sizes="(min-width: 1280px) 40vw, 100vw"
                                className="h-48 w-full rounded object-cover"
                            />
                            <p className="text-sm text-neutral-400">UUID: {wrap.heroImage.id}</p>
                        </WrapImageCard>
                    ) : (
                        <p className="text-neutral-400">No hero image assigned</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gallery Images</CardTitle>
                    <CardDescription>{wrap.galleryImages.length} gallery images</CardDescription>
                </CardHeader>
                <CardContent>
                    {wrap.galleryImages.length > 0 ? (
                        <WrapImageList>
                            {wrap.galleryImages.map((image) => (
                                <WrapImageCard key={image.id}>
                                    <Image
                                        src={image.detailUrl}
                                        alt={image.id}
                                        width={480}
                                        height={270}
                                        sizes="(min-width: 1280px) 20vw, 100vw"
                                        className="h-24 w-full rounded object-cover"
                                    />
                                </WrapImageCard>
                            ))}
                        </WrapImageList>
                    ) : (
                        <p className="text-neutral-400">No gallery images</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Visualizer References</CardTitle>
                    <CardDescription>
                        The visualizer now uses the active hero and gallery imagery as its
                        reference set.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-400">
                        Hero image plus {wrap.galleryImages.length} gallery image
                        {wrap.galleryImages.length === 1 ? '' : 's'} available for preview
                        generation.
                    </p>
                </CardContent>
            </Card>
        </WrapGalleryManager>
    )
}
