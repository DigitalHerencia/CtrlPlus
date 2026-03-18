import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { WrapImageDTO } from '../../lib/catalog/types'
import { WrapImageManager } from './WrapImageManager'

interface WrapListProps {
    wraps?: Array<{
        id: string
        name: string
        price: number
        installationMinutes?: number
        description?: string
        isHidden?: boolean
        images?: WrapImageDTO[]
    }>
    categories?: Array<{ id: string; name: string; slug: string }>
    isPending?: boolean
    handleWrapUpdate?: (wrapId: string, event: React.FormEvent) => void
    handleWrapDelete?: (wrapId: string) => void
    categorySelections?: Record<string, Set<string>>
    toggleWrapCategory?: (wrapId: string, categoryId: string) => void
    saveWrapCategories?: (wrapId: string) => void
    handleAddImage?: (wrapId: string, file: File, kind: string, isActive: boolean) => void
    handleRemoveImage?: (wrapId: string, imageId: string) => void
    handleReorderImages?: (wrapId: string, orderedIds: string[]) => void
    handleUpdateImageMetadata?: (
        wrapId: string,
        imageId: string,
        kind: string,
        isActive: boolean
    ) => void
}

export function WrapList({
    wraps,
    categories,
    isPending,
    handleWrapUpdate,
    handleWrapDelete,
    categorySelections,
    toggleWrapCategory,
    saveWrapCategories,
    handleAddImage,
    handleRemoveImage,
    handleReorderImages,
    handleUpdateImageMetadata,
}: WrapListProps) {
    const safeWraps = wraps ?? []
    const safeCategories = categories ?? []
    const safeIsPending = isPending ?? false
    const safeHandleWrapUpdate = handleWrapUpdate ?? (() => {})
    const safeHandleWrapDelete = handleWrapDelete ?? (() => {})
    const safeCategorySelections = categorySelections ?? {}
    const safeToggleWrapCategory = toggleWrapCategory ?? (() => {})
    const safeSaveWrapCategories = saveWrapCategories ?? (() => {})
    const safeHandleAddImage = handleAddImage ?? (() => {})
    const safeHandleRemoveImage = handleRemoveImage ?? (() => {})
    const safeHandleReorderImages = handleReorderImages ?? (() => {})
    const safeHandleUpdateImageMetadata = handleUpdateImageMetadata ?? (() => {})
    if (safeWraps.length === 0) {
        return (
            <Card className="border-neutral-700 bg-neutral-950/70 text-neutral-400">
                <CardContent className="p-6 text-sm">No wraps created yet.</CardContent>
            </Card>
        )
    }
    return (
        <div className="space-y-4">
            {safeWraps.map((wrap) => (
                <Card
                    key={wrap.id}
                    className="border-neutral-700 bg-neutral-950/80 text-neutral-100"
                >
                    <CardHeader>
                        <CardTitle>{wrap.name}</CardTitle>
                        {wrap.isHidden && (
                            <span className="ml-2 rounded bg-yellow-600 px-2 py-1 text-xs text-white">
                                Hidden
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form
                            className="grid gap-3 md:grid-cols-2"
                            onSubmit={(event) => safeHandleWrapUpdate(wrap.id, event)}
                        >
                            <input name="name" defaultValue={wrap.name} required />
                            <input
                                name="price"
                                type="number"
                                min={1}
                                defaultValue={String(wrap.price)}
                                required
                            />
                            <input
                                name="installationMinutes"
                                type="number"
                                min={1}
                                defaultValue={String(wrap.installationMinutes ?? '')}
                            />
                            <input name="description" defaultValue={wrap.description ?? ''} />
                            <label className="flex items-center gap-2 text-sm text-neutral-300 md:col-span-2">
                                <input
                                    name="isHidden"
                                    type="checkbox"
                                    defaultChecked={wrap.isHidden}
                                />
                                Hidden from customers
                            </label>
                            <div className="flex flex-wrap gap-2 md:col-span-2">
                                <Button type="submit" disabled={safeIsPending}>
                                    Save Wrap
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={safeIsPending}
                                    onClick={() => safeHandleWrapDelete(wrap.id)}
                                >
                                    Delete Wrap
                                </Button>
                            </div>
                        </form>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-neutral-100">
                                Category Mapping
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                                {safeCategories.map((category) => {
                                    const selected =
                                        safeCategorySelections[wrap.id]?.has(category.id) ?? false
                                    return (
                                        <label
                                            key={`${wrap.id}-${category.id}`}
                                            className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={() =>
                                                    safeToggleWrapCategory(wrap.id, category.id)
                                                }
                                            />
                                            {category.name}
                                        </label>
                                    )
                                })}
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={safeIsPending}
                                onClick={() => safeSaveWrapCategories(wrap.id)}
                            >
                                Save Categories
                            </Button>
                        </div>
                        <div className="mt-6">
                            <WrapImageManager
                                wrapId={wrap.id}
                                images={wrap.images ?? []}
                                onAddImage={(file, kind, isActive) =>
                                    safeHandleAddImage(wrap.id, file, kind, isActive)
                                }
                                onRemoveImage={(imageId) => safeHandleRemoveImage(wrap.id, imageId)}
                                onReorderImages={(orderedIds) =>
                                    safeHandleReorderImages(wrap.id, orderedIds)
                                }
                                onUpdateImageMetadata={(imageId, kind, isActive) =>
                                    safeHandleUpdateImageMetadata(wrap.id, imageId, kind, isActive)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
