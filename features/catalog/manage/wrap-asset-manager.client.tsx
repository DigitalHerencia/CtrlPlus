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
                                src={wrap.heroImage.url}
                                alt={wrap.heroImage.id}
                                width={1200}
                                height={675}
                                unoptimized
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
                                        src={image.url}
                                        alt={image.id}
                                        width={480}
                                        height={270}
                                        unoptimized
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
                    <CardTitle>Visualizer Texture</CardTitle>
                    <CardDescription>Texture used for AI preview generation</CardDescription>
                </CardHeader>
                <CardContent>
                    {wrap.visualizerTextureImage ? (
                        <WrapImageCard>
                            <Image
                                src={wrap.visualizerTextureImage.url}
                                alt={wrap.visualizerTextureImage.id}
                                width={1200}
                                height={675}
                                unoptimized
                                className="h-48 w-full rounded object-cover"
                            />
                            <p className="text-sm text-neutral-400">
                                UUID: {wrap.visualizerTextureImage.id}
                            </p>
                        </WrapImageCard>
                    ) : (
                        <p className="text-neutral-400">No visualizer texture assigned</p>
                    )}
                </CardContent>
            </Card>
        </WrapGalleryManager>
    )
}
