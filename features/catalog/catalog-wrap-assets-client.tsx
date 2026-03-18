'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { WrapImageManager } from '@/components/catalog/WrapImageManager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    addWrapImage,
    removeWrapImage,
    reorderWrapImages,
    updateWrapImageMetadata,
} from '@/lib/catalog/actions/manage-wrap-images'
import { type CatalogDetailDTO, type WrapImageKind } from '@/lib/catalog/types'

interface CatalogWrapAssetsClientProps {
    wrap: CatalogDetailDTO
}

export function CatalogWrapAssetsClient({ wrap }: CatalogWrapAssetsClientProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function runMutation(action: () => Promise<void>) {
        setError(null)
        startTransition(() => {
            void (async () => {
                try {
                    await action()
                    router.refresh()
                } catch (mutationError) {
                    setError(
                        mutationError instanceof Error ? mutationError.message : 'Asset update failed.'
                    )
                }
            })()
        })
    }

    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle className="text-lg">Owner Asset Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error ? (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                        {error}
                    </div>
                ) : null}
                <WrapImageManager
                    wrapId={wrap.id}
                    images={wrap.images}
                    readiness={wrap.readiness}
                    isPending={isPending}
                    onAddImage={(file, kind, isActive) =>
                        new Promise<void>((resolve) => {
                            runMutation(async () => {
                                await addWrapImage({ wrapId: wrap.id, file, kind, isActive })
                                resolve()
                            })
                        })
                    }
                    onRemoveImage={(imageId) =>
                        new Promise<void>((resolve) => {
                            runMutation(async () => {
                                await removeWrapImage(wrap.id, imageId)
                                resolve()
                            })
                        })
                    }
                    onReorderImages={(orderedIds) =>
                        new Promise<void>((resolve) => {
                            runMutation(async () => {
                                await reorderWrapImages(wrap.id, orderedIds)
                                resolve()
                            })
                        })
                    }
                    onUpdateImageMetadata={(imageId, kind, isActive) =>
                        new Promise<void>((resolve) => {
                            runMutation(async () => {
                                await updateWrapImageMetadata({
                                    wrapId: wrap.id,
                                    imageId,
                                    kind: kind as WrapImageKind,
                                    isActive,
                                })
                                resolve()
                            })
                        })
                    }
                />
            </CardContent>
        </Card>
    )
}
