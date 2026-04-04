'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, PencilLine, Plus, Tags } from 'lucide-react'

import { WorkspaceMetricCard } from '@/components/shared/tenant-elements'
import { CatalogManagerRowActions } from '@/components/catalog/manage/catalog-manager-row-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import type { WrapImageKind } from '@/lib/constants/statuses'
import type { CatalogManagerProps } from '@/types/catalog.types'
import { CatalogFiltersClient } from './catalog-filters-client'
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

type ManagerSheet =
    | 'create-wrap'
    | 'categories'
    | 'metadata'
    | 'category-mapping'
    | 'catalog-assets'

export function CatalogManagerClient({ wraps, categories }: CatalogManagerProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedWrapId, setSelectedWrapId] = useState<string | null>(wraps[0]?.id ?? null)
    const [openSheet, setOpenSheet] = useState<ManagerSheet | null>(null)
    const [sheetWrapId, setSheetWrapId] = useState<string | null>(null)
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
    const sheetWrap = useMemo(
        () => wraps.find((wrap) => wrap.id === sheetWrapId) ?? null,
        [sheetWrapId, wraps]
    )
    const metadataWrap = sheetWrap ?? selectedWrap
    const visibleWrapCount = wraps.filter((wrap) => !wrap.isHidden).length
    const publishReadyCount = wraps.filter((wrap) => wrap.readiness.canPublish).length
    const totalAssetCount = wraps.reduce((total, wrap) => total + wrap.imageCount, 0)
    const selectedReadinessIssues = metadataWrap?.readiness.issues ?? []

    const inputClassName =
        'h-11 rounded-md border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100'
    const textareaClassName =
        'rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm text-neutral-100'
    const iconButtonClassName =
        'h-8 w-8 border-neutral-800 text-neutral-300 hover:bg-neutral-800/70 hover:text-neutral-100'

    function runMutation(successMessage: string, action: () => Promise<void>) {
        setError(null)
        setStatus(null)
        startTransition(() => {
            void (async () => {
                try {
                    await action()
                    setCategorySelections({})
                    setStatus(successMessage)
                    if (openSheet) {
                        setOpenSheet(null)
                    }
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
        const form = event.currentTarget
        const formData = new FormData(form)
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
            form.reset()
        })
    }

    function handleSaveWrap(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!metadataWrap) return
        const formData = new FormData(event.currentTarget)
        runMutation('Wrap updated.', async () => {
            await updateWrap(metadataWrap.id, {
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
        if (!metadataWrap) return
        const nextHiddenState = !metadataWrap.isHidden
        runMutation(
            nextHiddenState
                ? 'Wrap hidden from the customer catalog.'
                : 'Wrap published to the catalog.',
            async () => {
                if (nextHiddenState) {
                    await unpublishWrap(metadataWrap.id)
                    return
                }

                await publishWrap(metadataWrap.id)
            }
        )
    }

    function handleDeleteSelectedWrap() {
        if (!metadataWrap || !window.confirm(`Delete ${metadataWrap.name}?`)) return
        runMutation('Wrap deleted.', async () => {
            await deleteWrap(metadataWrap.id)
            setSelectedWrapId(null)
            setSheetWrapId(null)
        })
    }

    function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const name = String(formData.get('name') ?? '').trim()
        const slugInput = String(formData.get('slug') ?? '').trim()
        runMutation('Category created.', async () => {
            await createWrapCategory({ name, slug: slugInput || slugifyCategory(name) })
            form.reset()
        })
    }

    function handleDeleteCategory(categoryId: string) {
        runMutation('Category removed.', async () => {
            await deleteWrapCategory(categoryId)
        })
    }

    function handleSaveCategories() {
        if (!metadataWrap) return
        runMutation('Category mappings updated.', async () => {
            await setWrapCategoryMappings({
                wrapId: metadataWrap.id,
                categoryIds:
                    categorySelections[metadataWrap.id] ??
                    defaultCategorySelections[metadataWrap.id] ??
                    [],
            })
        })
    }

    function toggleCategory(categoryId: string) {
        if (!metadataWrap) return
        setCategorySelections((current) => {
            const next = new Set(
                current[metadataWrap.id] ?? defaultCategorySelections[metadataWrap.id] ?? []
            )
            if (next.has(categoryId)) {
                next.delete(categoryId)
            } else {
                next.add(categoryId)
            }
            return { ...current, [metadataWrap.id]: [...next] }
        })
    }

    function handleAddImage(file: File, kind: WrapImageKind, isActive: boolean) {
        if (!metadataWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset uploaded.', async () => {
                const fileKey = await fileToDataUrl(file)
                await addWrapImage({ wrapId: metadataWrap.id, fileKey, kind, isActive })
                resolve()
            })
        )
    }

    function handleRemoveImage(imageId: string) {
        if (!metadataWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset removed.', async () => {
                await removeWrapImage(metadataWrap.id, imageId)
                resolve()
            })
        )
    }

    function handleReorderImages(orderedIds: string[]) {
        if (!metadataWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset order updated.', async () => {
                await reorderWrapImages(metadataWrap.id, orderedIds)
                resolve()
            })
        )
    }

    function handleUpdateImageMetadata(imageId: string, kind: WrapImageKind, isActive: boolean) {
        if (!metadataWrap) return Promise.resolve()
        return new Promise<void>((resolve) =>
            runMutation('Asset metadata updated.', async () => {
                await updateWrapImageMetadata({ wrapId: metadataWrap.id, imageId, kind, isActive })
                resolve()
            })
        )
    }

    function openWrapSheet(
        wrapId: string,
        sheet: Extract<ManagerSheet, 'metadata' | 'category-mapping' | 'catalog-assets'>
    ) {
        setSelectedWrapId(wrapId)
        setSheetWrapId(wrapId)
        setOpenSheet(sheet)
    }

    function handleSheetOpenChange(sheet: ManagerSheet, open: boolean) {
        if (open) {
            setOpenSheet(sheet)
            return
        }

        setOpenSheet((current) => (current === sheet ? null : current))
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
            <CatalogFiltersClient categories={categories} />
            <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">Inventory</CardTitle>
                        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                            Select a wrap row, then edit metadata, category mapping, or assets.
                        </p>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className={iconButtonClassName}
                                    aria-label="Manage categories"
                                    onClick={() => setOpenSheet('categories')}
                                >
                                    <Tags className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Categories</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Wrap</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="w-41 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {wraps.map((wrap) => (
                                <TableRow
                                    key={wrap.id}
                                    data-state={
                                        effectiveSelectedWrapId === wrap.id ? 'selected' : undefined
                                    }
                                    className="cursor-pointer transition-colors hover:bg-neutral-900/70"
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
                                                {wrap.readiness.canPublish ? 'Ready' : 'Attention'}
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
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <CatalogManagerRowActions>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className={iconButtonClassName}
                                                            aria-label={`Edit metadata for ${wrap.name}`}
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                openWrapSheet(wrap.id, 'metadata')
                                                            }}
                                                        >
                                                            <PencilLine className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Wrap metadata</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className={iconButtonClassName}
                                                            aria-label={`Edit category mapping for ${wrap.name}`}
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                openWrapSheet(
                                                                    wrap.id,
                                                                    'category-mapping'
                                                                )
                                                            }}
                                                        >
                                                            <Tags className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Category mapping
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className={iconButtonClassName}
                                                            aria-label={`Manage catalog assets for ${wrap.name}`}
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                openWrapSheet(
                                                                    wrap.id,
                                                                    'catalog-assets'
                                                                )
                                                            }}
                                                        >
                                                            <ImageIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Catalog assets</TooltipContent>
                                                </Tooltip>
                                            </CatalogManagerRowActions>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                    Manager actions
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline">
                        <Link href="/catalog">Back to Gallery</Link>
                    </Button>
                    <Button type="button" onClick={() => setOpenSheet('create-wrap')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Wrap
                    </Button>
                </div>
            </div>

            <Sheet
                open={openSheet === 'create-wrap'}
                onOpenChange={(open) => handleSheetOpenChange('create-wrap', open)}
            >
                <SheetContent
                    side="right"
                    className="sm:max-w-190 w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100"
                >
                    <SheetHeader>
                        <SheetTitle>Create Wrap</SheetTitle>
                        <SheetDescription>
                            Add a new catalog item and complete metadata before publishing.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleCreateWrap} className="mt-6 grid gap-4">
                        <input
                            name="name"
                            required
                            placeholder="Wrap name"
                            className={inputClassName}
                        />
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Short product description"
                            className={textareaClassName}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                name="price"
                                required
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Price (USD)"
                                className={inputClassName}
                            />
                            <input
                                name="installationMinutes"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Install minutes"
                                className={inputClassName}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                Create Wrap
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            <Sheet
                open={openSheet === 'categories'}
                onOpenChange={(open) => handleSheetOpenChange('categories', open)}
            >
                <SheetContent
                    side="right"
                    className="sm:max-w-190 w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100"
                >
                    <SheetHeader>
                        <SheetTitle>Categories</SheetTitle>
                        <SheetDescription>
                            Manage category taxonomy used by inventory and storefront filters.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <form
                            onSubmit={handleCreateCategory}
                            className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                            <input
                                name="name"
                                required
                                placeholder="Category name"
                                className={inputClassName}
                            />
                            <input
                                name="slug"
                                placeholder="category-slug"
                                className={inputClassName}
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
                                        <p className="text-xs text-neutral-500">{category.slug}</p>
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
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet
                open={openSheet === 'metadata'}
                onOpenChange={(open) => handleSheetOpenChange('metadata', open)}
            >
                <SheetContent
                    side="right"
                    className="sm:max-w-225 w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100"
                >
                    <SheetHeader>
                        <SheetTitle>Wrap Metadata</SheetTitle>
                        <SheetDescription>
                            Update pricing, copy, AI prompts, and publish visibility.
                        </SheetDescription>
                    </SheetHeader>
                    {metadataWrap ? (
                        <form
                            key={metadataWrap.id}
                            onSubmit={handleSaveWrap}
                            className="mt-6 grid gap-4"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-neutral-300">
                                    <span className="block">Wrap name</span>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={metadataWrap.name}
                                        className={inputClassName}
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
                                        defaultValue={formatPriceInput(metadataWrap.price)}
                                        className={inputClassName}
                                    />
                                </label>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-neutral-300">
                                    <span className="block">Description</span>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={metadataWrap.description ?? ''}
                                        className={textareaClassName}
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-neutral-300">
                                    <span className="block">Install minutes</span>
                                    <input
                                        name="installationMinutes"
                                        type="number"
                                        min="1"
                                        step="1"
                                        defaultValue={metadataWrap.installationMinutes ?? ''}
                                        className={inputClassName}
                                    />
                                </label>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-neutral-300">
                                    <span className="block">AI prompt template</span>
                                    <textarea
                                        name="aiPromptTemplate"
                                        rows={4}
                                        defaultValue={metadataWrap.aiPromptTemplate ?? ''}
                                        className={textareaClassName}
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-neutral-300">
                                    <span className="block">AI negative prompt</span>
                                    <textarea
                                        name="aiNegativePrompt"
                                        rows={4}
                                        defaultValue={metadataWrap.aiNegativePrompt ?? ''}
                                        className={textareaClassName}
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
                                <Button type="submit" disabled={isPending}>
                                    Save Metadata
                                </Button>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={
                                            isPending ||
                                            (!metadataWrap.readiness.canPublish &&
                                                metadataWrap.isHidden)
                                        }
                                        onClick={handleToggleVisibility}
                                    >
                                        {metadataWrap.isHidden ? 'Publish Wrap' : 'Hide Wrap'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <a href={`/visualizer?wrapId=${metadataWrap.id}`}>
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
                            </div>
                            {metadataWrap.readiness.missingRequiredAssetRoles.length > 0 ? (
                                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                                    Missing required roles:{' '}
                                    {metadataWrap.readiness.missingRequiredAssetRoles.join(', ')}
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
                    ) : (
                        <p className="mt-6 text-sm text-neutral-400">
                            Select a wrap from inventory first.
                        </p>
                    )}
                </SheetContent>
            </Sheet>

            <Sheet
                open={openSheet === 'category-mapping'}
                onOpenChange={(open) => handleSheetOpenChange('category-mapping', open)}
            >
                <SheetContent
                    side="right"
                    className="sm:max-w-190 w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100"
                >
                    <SheetHeader>
                        <SheetTitle>Category Mapping</SheetTitle>
                        <SheetDescription>
                            Assign the selected wrap to the right discovery categories.
                        </SheetDescription>
                    </SheetHeader>
                    {metadataWrap ? (
                        <div className="mt-6 space-y-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                {categories.map((category) => {
                                    const selected = (
                                        categorySelections[metadataWrap.id] ??
                                        defaultCategorySelections[metadataWrap.id] ??
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
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-neutral-400">
                            Select a wrap from inventory first.
                        </p>
                    )}
                </SheetContent>
            </Sheet>

            <Sheet
                open={openSheet === 'catalog-assets'}
                onOpenChange={(open) => handleSheetOpenChange('catalog-assets', open)}
            >
                <SheetContent
                    side="right"
                    className="sm:max-w-280 w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100"
                >
                    <SheetHeader>
                        <SheetTitle>Catalog Assets</SheetTitle>
                        <SheetDescription>
                            Upload, reorder, and set active state for display and visualizer assets.
                        </SheetDescription>
                    </SheetHeader>
                    {metadataWrap ? (
                        <div className="mt-6">
                            <WrapImageManager
                                key={`${metadataWrap.id}:${metadataWrap.images.map((image) => `${image.id}:${image.version}:${image.kind}:${image.isActive}:${image.displayOrder}`).join('|')}`}
                                wrapId={metadataWrap.id}
                                images={metadataWrap.images}
                                readiness={metadataWrap.readiness}
                                isPending={isPending}
                                onAddImage={handleAddImage}
                                onRemoveImage={handleRemoveImage}
                                onReorderImages={handleReorderImages}
                                onUpdateImageMetadata={handleUpdateImageMetadata}
                            />
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-neutral-400">
                            Select a wrap from inventory first.
                        </p>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
