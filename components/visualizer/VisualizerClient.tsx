'use client'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { formatPrice } from '@/lib/utils/currency'
import { formatInstallationTime } from '@/lib/utils/dates'
import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { PreviewCanvas } from './PreviewCanvas'
import { UploadForm } from './UploadForm'
import { WrapSelector } from './WrapSelector'

interface VisualizerClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    selectedWrap: VisualizerWrapSelectionDTO | null
    selectedWrapId: string | null
    searchQuery: string
    canManageCatalog: boolean
    preview: VisualizerPreviewDTO | null
    error: string | null
    isPending: boolean
    isProcessing: boolean
    selectedFile: File | null
    onSearchQueryChange: (query: string) => void
    onSelectWrap: (wrapId: string) => void
    onFileChange: (file: File | null) => void
    onCreatePreview: (file: File) => void
    onRegeneratePreview: () => void
}

export function VisualizerClient({
    wraps,
    selectedWrap,
    selectedWrapId,
    searchQuery,
    canManageCatalog,
    preview,
    error,
    isPending,
    isProcessing,
    selectedFile,
    onSearchQueryChange,
    onSelectWrap,
    onFileChange,
    onCreatePreview,
    onRegeneratePreview,
}: VisualizerClientProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Visualizer"
                title="Wrap Visualizer"
                description="Upload a vehicle photo, choose a premium wrap package, and generate customer-ready AI concept previews in minutes."
            />
            <WorkspacePageContextCard
                title="Preview Guidance"
                description="Use high-quality source photos for the most realistic concept output"
            >
                <p className="text-sm text-neutral-100">Accepted uploads: JPG, PNG, WebP</p>
                <p className="text-sm text-neutral-100">
                    Generation path: AI preview with resilient fallback
                </p>
            </WorkspacePageContextCard>

            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="space-y-6">
                    {selectedWrap ? (
                        <UploadForm
                            wrapId={selectedWrap.id}
                            selectedFile={selectedFile}
                            onFileChange={onFileChange}
                            onSubmit={onCreatePreview}
                            isSubmitting={isPending || isProcessing}
                            error={error}
                        />
                    ) : (
                        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                            <CardContent className="py-12 text-center text-sm text-neutral-400">
                                Select a wrap to start generating previews.
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-xl">Preview Workflow</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-neutral-300">
                            <div className="flex items-center justify-between gap-4">
                                <span>Preview source</span>
                                <span className="text-neutral-100">
                                    Vehicle upload + hero/gallery references
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Generation path</span>
                                <span className="text-neutral-100">
                                    Reference-guided edit / fallback
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Accepted uploads</span>
                                <span className="text-neutral-100">JPG, PNG, WebP</span>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedWrap ? (
                        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Selected Wrap</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <h2 className="text-3xl font-black">{selectedWrap.name}</h2>
                                        <p className="text-3xl font-black">
                                            {formatPrice(selectedWrap.price)}
                                        </p>
                                    </div>
                                    <p className="text-sm leading-7 text-neutral-300">
                                        {selectedWrap.description ?? 'Preview-ready wrap package.'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedWrap.categories.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant="outline"
                                            className="border-neutral-700 bg-neutral-900 text-neutral-200"
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                    {selectedWrap.installationMinutes ? (
                                        <Badge
                                            variant="secondary"
                                            className="bg-neutral-900 text-neutral-200"
                                        >
                                            {formatInstallationTime(
                                                selectedWrap.installationMinutes
                                            )}
                                        </Badge>
                                    ) : null}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        onClick={onRegeneratePreview}
                                        disabled={!preview || isPending || isProcessing}
                                    >
                                        Regenerate Preview
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={`/catalog/${selectedWrap.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>

                <div className="space-y-6">
                    <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <CardTitle className="text-xl">
                                    Browse Visualizer-Ready Wraps
                                </CardTitle>
                                {canManageCatalog ? (
                                    <Button asChild variant="outline">
                                        <Link href="/catalog/manage">Open Catalog Manager</Link>
                                    </Button>
                                ) : null}
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(event) => onSearchQueryChange(event.target.value)}
                                placeholder="Search wraps, finishes, or categories"
                                className="h-12 rounded-lg border border-neutral-800 bg-neutral-900 px-4 text-sm text-neutral-100 outline-none transition focus:border-blue-500"
                            />
                        </CardHeader>
                        <CardContent>
                            <WrapSelector
                                wraps={wraps}
                                selectedWrapId={selectedWrapId}
                                onSelect={onSelectWrap}
                                canManageCatalog={canManageCatalog}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
                        <CardHeader className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                                        Current Preview
                                    </p>
                                    <CardTitle className="mt-2 text-3xl font-black">
                                        {selectedWrap?.name ?? 'Choose a Wrap'}
                                    </CardTitle>
                                </div>
                                {selectedWrap ? (
                                    <p className="text-3xl font-black">
                                        {formatPrice(selectedWrap.price)}
                                    </p>
                                ) : null}
                            </div>
                            {selectedWrap ? (
                                <p className="text-sm leading-7 text-neutral-300">
                                    {selectedWrap.description ??
                                        'Generate a customer-facing preview on the selected vehicle image.'}
                                </p>
                            ) : null}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <PreviewCanvas
                                preview={preview}
                                isLoading={isPending && !preview}
                                error={error}
                                className="min-h-136"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
