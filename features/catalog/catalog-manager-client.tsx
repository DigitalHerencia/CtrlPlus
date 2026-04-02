'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { WorkspaceMetricCard } from '@/components/shared/tenant-elements'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    createWrap,
    deleteWrap,
    createWrapCategory,
    deleteWrapCategory,
    setWrapCategoryMappings,
    addWrapImage,
    removeWrapImage,
    reorderWrapImages,
    updateWrapImageMetadata,
    publishWrap,
    unpublishWrap,
    updateWrap,
} from '@/lib/actions/catalog.actions'
import { formatPrice } from '@/lib/utils/currency'
import { WrapImageManager } from '@/components/catalog/WrapImageManager'
import type { WrapImageKind } from '@/types/catalog/constants'
import type { CatalogManagerProps } from '@/types/catalog/route-types'
import { fileToDataUrl } from './file-key.client'

function slugifyCategory(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function formatPriceInput(priceInCents: number): string {
    return (priceInCents / 100).toFixed(2)
}

function parsePriceInput(value: string): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) throw new Error('Price must be a positive number.')
    return Math.round(parsed * 100)
}

export function CatalogManagerClient({ wraps, categories }: CatalogManagerProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedWrapId, setSelectedWrapId] = useState<string | null>(wraps[0]?.id ?? null)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [categorySelections, setCategorySelections] = useState<Record<string, string[]>>({})
    const defaultCategorySelections = useMemo(
        () =>
            Object.fromEntries(
                wraps.map((wrap) => [wrap.id, wrap.categories.map((category) => category.id)])
            ),
        [wraps]
    )
    const effectiveSelectedWrapId =
        selectedWrapId && wraps.some((wrap) => wrap.id === selectedWrapId)
            ? selectedWrapId
            : (wraps[0]?.id ?? null)
    const selectedWrap = useMemo(
        () => wraps.find((wrap) => wrap.id === effectiveSelectedWrapId) ?? null,
        [effectiveSelectedWrapId, wraps]
    )
    const visibleWrapCount = wraps.filter((wrap) => !wrap.isHidden).length
    const publishReadyCount = wraps.filter((wrap) => wrap.readiness.canPublish).length
    const totalAssetCount = wraps.reduce((total, wrap) => total + wrap.imageCount, 0)
    const selectedReadinessIssues = selectedWrap?.readiness.issues ?? []

    function runMutation(successMessage: string, action: () => Promise<void>) {
        setError(null)
        setStatus(null)
        startTransition(() => {
            void (async () => {
                try {
                    await action()
                    setCategorySelections({})
                    setStatus(successMessage)
                    router.refresh()
                } catch (mutationError) {
                    setError(
                        mutationError instanceof Error
                            ? mutationError.message
                            : 'Catalog update failed.'
                    )
                }
            })()
        })
    }

    function handleCreateWrap(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        runMutation('Wrap created.', async () => {
            await createWrap({
                name: String(formData.get('name') ?? ''),
                description: String(formData.get('description') ?? '') || undefined,
                price: parsePriceInput(String(formData.get('price') ?? '0')),
                installationMinutes: formData.get('installationMinutes')
                    ? Number(formData.get('installationMinutes'))
                    : undefined,
                aiPromptTemplate: String(formData.get('aiPromptTemplate') ?? '') || undefined,
                aiNegativePrompt: String(formData.get('aiNegativePrompt') ?? '') || undefined,
            })
            event.currentTarget.reset()
        })
    }

    function handleSaveWrap(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!selectedWrap) return
        const formData = new FormData(event.currentTarget)
        runMutation('Wrap updated.', async () => {
            await updateWrap(selectedWrap.id, {
                name: String(formData.get('name') ?? ''),
                description: String(formData.get('description') ?? '') || undefined,
                price: parsePriceInput(String(formData.get('price') ?? '0')),
                installationMinutes: formData.get('installationMinutes')
                    ? Number(formData.get('installationMinutes'))
                    : undefined,
                aiPromptTemplate: String(formData.get('aiPromptTemplate') ?? '') || undefined,
                aiNegativePrompt: String(formData.get('aiNegativePrompt') ?? '') || undefined,
            })
        })
    }

    function handleToggleVisibility() {
        if (!selectedWrap) return
        const nextHiddenState = !selectedWrap.isHidden
        runMutation(
            nextHiddenState
                ? 'Wrap hidden from the customer catalog.'
                : 'Wrap published to the catalog.',
            async () => {
                if (nextHiddenState) {
                    await unpublishWrap(selectedWrap.id)
                    return
                }

                await publishWrap(selectedWrap.id)
            }
        )
    }

    function handleDeleteSelectedWrap() {
        if (!selectedWrap || !window.confirm(`Delete ${selectedWrap.name}?`)) return
        runMutation('Wrap deleted.', async () => {
            await deleteWrap(selectedWrap.id)
            setSelectedWrapId(null)
        })
    }

    function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const name = String(formData.get('name') ?? '').trim()
        const slugInput = String(formData.get('slug') ?? '').trim()
        runMutation('Category created.', async () => {
            await createWrapCategory({ name, slug: slugInput || slugifyCategory(name) })
            event.currentTarget.reset()
        })
    }

    function handleDeleteCategory(categoryId: string) {
        runMutation('Category removed.', async () => {
            await deleteWrapCategory(categoryId)
        })
    }

    function handleSaveCategories() {
        if (!selectedWrap) return
        runMutation('Category mappings updated.', async () => {
            await setWrapCategoryMappings({
                wrapId: selectedWrap.id,
                categoryIds:
                    categorySelections[selectedWrap.id] ??
                    defaultCategorySelections[selectedWrap.id] ??
                    [],
            })
        })
    }

    function toggleCategory(categoryId: string) {
        if (!selectedWrap) return
        setCategorySelections((current) => {
            const next = new Set(
                current[selectedWrap.id] ?? defaultCategorySelections[selectedWrap.id] ?? []
            )
            if (next.has(categoryId)) {
                next.delete(categoryId)
            } else {
                next.add(categoryId)
            }
            return { ...current, [selectedWrap.id]: [...next] }
        })
    }

    function handleAddImage(file: File, kind: WrapImageKind, isActive: boolean) {
        if (!selectedWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset uploaded.', async () => {
                const fileKey = await fileToDataUrl(file)
                await addWrapImage({ wrapId: selectedWrap.id, fileKey, kind, isActive })
                resolve()
            })
        )
    }

    function handleRemoveImage(imageId: string) {
        if (!selectedWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset removed.', async () => {
                await removeWrapImage(selectedWrap.id, imageId)
                resolve()
            })
        )
    }

    function handleReorderImages(orderedIds: string[]) {
        if (!selectedWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset order updated.', async () => {
                await reorderWrapImages(selectedWrap.id, orderedIds)
                resolve()
            })
        )
    }

    function handleUpdateImageMetadata(imageId: string, kind: WrapImageKind, isActive: boolean) {
        if (!selectedWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset metadata updated.', async () => {
                await updateWrapImageMetadata({ wrapId: selectedWrap.id, imageId, kind, isActive })
                resolve()
            })
        )
    }

    return (
        <div className="space-y-6">
            <section className="grid gap-4 lg:grid-cols-3">
                <WorkspaceMetricCard
                    label="Visible Wraps"
                    value={visibleWrapCount}
                    description="Currently live in the customer catalog"
                />
                <WorkspaceMetricCard
                    label="Publish-ready"
                    value={publishReadyCount}
                    description="Wraps with required hero and visualizer assets"
                />
                <WorkspaceMetricCard
                    label="Assets"
                    value={totalAssetCount}
                    description="Total images under catalog management"
                />
            </section>
            {error || status ? (
                <Card
                    className={
                        error
                            ? 'border-red-500/30 bg-red-500/10 text-red-100'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                    }
                >
                    <CardContent className="py-4 text-sm">{error ?? status}</CardContent>
                </Card>
            ) : null}
            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div className="space-y-6">
                    <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-lg">Create Wrap</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateWrap} className="grid gap-4">
                                <input
                                    name="name"
                                    required
                                    placeholder="Wrap name"
                                    className="h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                />
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Short product description"
                                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100"
                                />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                        name="price"
                                        required
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Price (USD)"
                                        className="h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                    />
                                    <input
                                        name="installationMinutes"
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="Install minutes"
                                        className="h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isPending}>
                                        Create Wrap
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-lg">Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Wrap</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {wraps.map((wrap) => (
                                        <TableRow
                                            key={wrap.id}
                                            data-state={
                                                effectiveSelectedWrapId === wrap.id
                                                    ? 'selected'
                                                    : undefined
                                            }
                                            className="cursor-pointer"
                                            onClick={() => setSelectedWrapId(wrap.id)}
                                        >
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-neutral-100">
                                                        {wrap.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {wrap.categories
                                                            .map((category) => category.name)
                                                            .join(', ') || 'Uncategorized'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            wrap.readiness.canPublish
                                                                ? 'border-emerald-500/40 text-emerald-200'
                                                                : 'border-red-500/40 text-red-200'
                                                        }
                                                    >
                                                        {wrap.readiness.canPublish
                                                            ? 'Ready'
                                                            : 'Attention'}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            wrap.isHidden
                                                                ? 'border-amber-500/40 text-amber-200'
                                                                : 'border-blue-500/40 text-blue-200'
                                                        }
                                                    >
                                                        {wrap.isHidden ? 'Hidden' : 'Visible'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatPrice(wrap.price)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form
                                onSubmit={handleCreateCategory}
                                className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                            >
                                <input
                                    name="name"
                                    required
                                    placeholder="Category name"
                                    className="h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                />
                                <input
                                    name="slug"
                                    placeholder="category-slug"
                                    className="h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                />
                                <Button type="submit" disabled={isPending}>
                                    Add Category
                                </Button>
                            </form>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-neutral-100">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {category.slug}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isPending}
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    {selectedWrap ? (
                        <>
                            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                                <CardHeader className="gap-4">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-2xl">
                                                {selectedWrap.name}
                                            </CardTitle>
                                            <p className="mt-2 text-sm text-neutral-400">
                                                Maintain metadata, asset roles, category mapping,
                                                and publish state from one panel.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    selectedWrap.readiness.canPublish
                                                        ? 'border-emerald-500/40 text-emerald-200'
                                                        : 'border-red-500/40 text-red-200'
                                                }
                                            >
                                                {selectedWrap.readiness.canPublish
                                                    ? 'Publish-ready'
                                                    : 'Needs asset attention'}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    selectedWrap.isHidden
                                                        ? 'border-amber-500/40 text-amber-200'
                                                        : 'border-blue-500/40 text-blue-200'
                                                }
                                            >
                                                {selectedWrap.isHidden ? 'Hidden' : 'Visible'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleSaveWrap} className="grid gap-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">Wrap name</span>
                                                <input
                                                    name="name"
                                                    required
                                                    defaultValue={selectedWrap.name}
                                                    className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">Price (USD)</span>
                                                <input
                                                    name="price"
                                                    required
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    defaultValue={formatPriceInput(
                                                        selectedWrap.price
                                                    )}
                                                    className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">Description</span>
                                                <textarea
                                                    name="description"
                                                    rows={4}
                                                    defaultValue={selectedWrap.description ?? ''}
                                                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">Install minutes</span>
                                                <input
                                                    name="installationMinutes"
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    defaultValue={
                                                        selectedWrap.installationMinutes ?? ''
                                                    }
                                                    className="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">AI prompt template</span>
                                                <textarea
                                                    name="aiPromptTemplate"
                                                    rows={4}
                                                    defaultValue={
                                                        selectedWrap.aiPromptTemplate ?? ''
                                                    }
                                                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                            <label className="space-y-2 text-sm text-neutral-300">
                                                <span className="block">AI negative prompt</span>
                                                <textarea
                                                    name="aiNegativePrompt"
                                                    rows={4}
                                                    defaultValue={
                                                        selectedWrap.aiNegativePrompt ?? ''
                                                    }
                                                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100"
                                                />
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <Button type="submit" disabled={isPending}>
                                                Save Metadata
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={
                                                    isPending ||
                                                    (!selectedWrap.readiness.canPublish &&
                                                        selectedWrap.isHidden)
                                                }
                                                onClick={handleToggleVisibility}
                                            >
                                                {selectedWrap.isHidden
                                                    ? 'Publish Wrap'
                                                    : 'Hide Wrap'}
                                            </Button>
                                            <Button type="button" variant="outline" asChild>
                                                <a href={`/visualizer?wrapId=${selectedWrap.id}`}>
                                                    Preview Test
                                                </a>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={handleDeleteSelectedWrap}
                                            >
                                                Delete Wrap
                                            </Button>
                                        </div>
                                        {selectedWrap.readiness.missingRequiredAssetRoles.length >
                                        0 ? (
                                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                                                Missing required roles:{' '}
                                                {selectedWrap.readiness.missingRequiredAssetRoles.join(
                                                    ', '
                                                )}
                                            </div>
                                        ) : null}
                                        {selectedReadinessIssues.length > 0 ? (
                                            <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-200">
                                                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
                                                    Readiness issues
                                                </p>
                                                <ul className="space-y-2">
                                                    {selectedReadinessIssues.map((issue) => (
                                                        <li key={issue.code}>{issue.message}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </form>
                                </CardContent>
                            </Card>
                            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                                <CardHeader>
                                    <CardTitle className="text-lg">Category Mapping</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {categories.map((category) => {
                                            const selected = (
                                                categorySelections[selectedWrap.id] ??
                                                defaultCategorySelections[selectedWrap.id] ??
                                                []
                                            ).includes(category.id)
                                            return (
                                                <label
                                                    key={category.id}
                                                    className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-200"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected}
                                                        disabled={isPending}
                                                        onChange={() => toggleCategory(category.id)}
                                                    />
                                                    <span>{category.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={isPending}
                                            onClick={handleSaveCategories}
                                        >
                                            Save Categories
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <WrapImageManager
                                key={`${selectedWrap.id}:${selectedWrap.images.map((image) => `${image.id}:${image.version}:${image.kind}:${image.isActive}:${image.displayOrder}`).join('|')}`}
                                wrapId={selectedWrap.id}
                                images={selectedWrap.images}
                                readiness={selectedWrap.readiness}
                                isPending={isPending}
                                onAddImage={handleAddImage}
                                onRemoveImage={handleRemoveImage}
                                onReorderImages={handleReorderImages}
                                onUpdateImageMetadata={handleUpdateImageMetadata}
                            />
                        </>
                    ) : (
                        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                            <CardContent className="py-16 text-center text-sm text-neutral-400">
                                Select a wrap from the inventory to edit metadata, map categories,
                                and manage assets.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    )
}
