'use client'
/**
 * Components — TODO: brief module description.
 * Domain: components
 * Public: TODO (yes/no)
 */

import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toCatalogAssetImage } from '@/lib/utils/catalog-assets'
import type { CatalogAssetReadinessDTO, WrapImageDTO } from '@/types/catalog.types'
import { WrapImageKind as WrapImageKindConst } from '@/lib/constants/statuses'
import type { WrapImageKind as WrapImageKindType } from '@/lib/constants/statuses'

interface WrapImageManagerProps {
    wrapId: string
    images: WrapImageDTO[]
    readiness?: CatalogAssetReadinessDTO
    isPending?: boolean
    onAddImage: (file: File, kind: WrapImageKindType, isActive: boolean) => Promise<void> | void
    onRemoveImage: (imageId: string) => Promise<void> | void
    onReorderImages: (orderedIds: string[]) => Promise<void> | void
    onUpdateImageMetadata: (
        imageId: string,
        kind: WrapImageKindType,
        isActive: boolean
    ) => Promise<void> | void
}

const kindOptions: Array<{ value: WrapImageKindType; label: string }> = [
    { value: WrapImageKindConst.HERO, label: 'Hero / display' },
    { value: WrapImageKindConst.GALLERY, label: 'Gallery' },
]

/**
 * WrapImageManager — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapImageManager({
    wrapId,
    images,
    readiness,
    isPending = false,
    onAddImage,
    onRemoveImage,
    onReorderImages,
    onUpdateImageMetadata,
}: WrapImageManagerProps) {
    const orderedImages = useMemo(
        () => [...images].sort((left, right) => left.displayOrder - right.displayOrder),
        [images]
    )
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadKind, setUploadKind] = useState<WrapImageKindType>(WrapImageKindConst.GALLERY)
    const [uploadIsActive, setUploadIsActive] = useState(true)
    const [drafts, setDrafts] = useState<
        Record<string, { kind: WrapImageKindType; isActive: boolean }>
    >(() =>
        Object.fromEntries(
            orderedImages.map((image) => [image.id, { kind: image.kind, isActive: image.isActive }])
        )
    )

    function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!selectedFile) {
            return
        }

        void onAddImage(selectedFile, uploadKind, uploadIsActive)
        setSelectedFile(null)
        setUploadKind(WrapImageKindConst.GALLERY)
        setUploadIsActive(true)
        event.currentTarget.reset()
    }

    function handleMove(imageId: string, direction: -1 | 1) {
        const currentIndex = orderedImages.findIndex((image) => image.id === imageId)
        const targetIndex = currentIndex + direction

        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedImages.length) {
            return
        }

        const reordered = [...orderedImages]
        const [movedImage] = reordered.splice(currentIndex, 1)
        reordered.splice(targetIndex, 0, movedImage)
        void onReorderImages(reordered.map((image) => image.id))
    }

    return (
        <div className="space-y-4">
            <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-100">
                <CardHeader className="gap-3">
                    <CardTitle className="text-lg">Catalog Assets</CardTitle>
                    {readiness ? (
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={readiness.canPublish ? 'secondary' : 'outline'}
                                className={
                                    readiness.canPublish
                                        ? 'bg-emerald-500/15 text-emerald-200'
                                        : 'border-red-500/40 text-red-200'
                                }
                            >
                                {readiness.canPublish ? 'Publish-ready' : 'Missing required roles'}
                            </Badge>
                            {readiness.missingRequiredAssetRoles.map((role) => (
                                <Badge
                                    key={role}
                                    variant="outline"
                                    className="border-red-500/30 bg-red-500/10 text-red-200"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    ) : null}
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleUploadSubmit}
                        className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_0.8fr_0.5fr_auto]"
                    >
                        <label className="space-y-2 text-sm text-neutral-300">
                            <span className="block">Upload asset</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={isPending}
                                onChange={(event) =>
                                    setSelectedFile(event.target.files?.[0] ?? null)
                                }
                                className="block w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-neutral-300">
                            <span className="block">Asset role</span>
                            <select
                                value={uploadKind}
                                disabled={isPending}
                                onChange={(event) =>
                                    setUploadKind(event.target.value as WrapImageKindType)
                                }
                                className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                            >
                                {kindOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex items-end gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-200">
                            <input
                                type="checkbox"
                                checked={uploadIsActive}
                                disabled={isPending}
                                onChange={(event) => setUploadIsActive(event.target.checked)}
                            />
                            Active
                        </label>
                        <div className="flex items-end">
                            <Button type="submit" disabled={isPending || !selectedFile}>
                                Add Asset
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {orderedImages.length === 0 ? (
                <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-300">
                    <CardContent className="py-8 text-sm">
                        No assets uploaded for wrap <span className="font-semibold">{wrapId}</span>{' '}
                        yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {orderedImages.map((image, index) => {
                        const asset = toCatalogAssetImage(image)
                        const draft = drafts[image.id] ?? {
                            kind: image.kind,
                            isActive: image.isActive,
                        }
                        const hasChanges =
                            draft.kind !== image.kind || draft.isActive !== image.isActive

                        return (
                            <Card
                                key={image.id}
                                className="border-neutral-800 bg-neutral-950/70 text-neutral-100"
                            >
                                <CardContent className="grid gap-4 p-4 xl:grid-cols-[180px_minmax(0,1fr)_auto]">
                                    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={asset.thumbnailUrl}
                                            alt={`Catalog asset ${image.id}`}
                                            className="h-32 w-full object-cover"
                                        />
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                                        <label className="space-y-2 text-sm text-neutral-300">
                                            <span className="block">Asset role</span>
                                            <select
                                                value={draft.kind}
                                                disabled={isPending}
                                                onChange={(event) =>
                                                    setDrafts((current) => ({
                                                        ...current,
                                                        [image.id]: {
                                                            ...draft,
                                                            kind: event.target
                                                                .value as WrapImageKindType,
                                                        },
                                                    }))
                                                }
                                                className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                            >
                                                {kindOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="flex items-end gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-200">
                                            <input
                                                type="checkbox"
                                                checked={draft.isActive}
                                                disabled={isPending}
                                                onChange={(event) =>
                                                    setDrafts((current) => ({
                                                        ...current,
                                                        [image.id]: {
                                                            ...draft,
                                                            isActive: event.target.checked,
                                                        },
                                                    }))
                                                }
                                            />
                                            Active
                                        </label>

                                        <div className="flex flex-wrap items-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending || index === 0}
                                                onClick={() => handleMove(image.id, -1)}
                                            >
                                                Move Up
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    isPending || index === orderedImages.length - 1
                                                }
                                                onClick={() => handleMove(image.id, 1)}
                                            >
                                                Move Down
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={isPending || !hasChanges}
                                                onClick={() =>
                                                    void onUpdateImageMetadata(
                                                        image.id,
                                                        draft.kind,
                                                        draft.isActive
                                                    )
                                                }
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={() => void onRemoveImage(image.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right text-xs uppercase tracking-[0.18em] text-neutral-500">
                                        <p>Order #{index + 1}</p>
                                        <p>v{image.version}</p>
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Badge
                                                variant="outline"
                                                className="border-neutral-700 text-neutral-200"
                                            >
                                                {image.kind}
                                            </Badge>
                                            {!image.isActive ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-neutral-700 text-neutral-400"
                                                >
                                                    Inactive
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
