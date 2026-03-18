'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { WrapDTO } from '@/lib/catalog/types'
import {
    buildTemplatePreview,
    templateVehicleOptions,
    type TemplateVehicleOption,
} from '@/lib/visualizer/templates'
import type { VisualizerPreviewDTO } from '@/lib/visualizer/types'
import { PreviewCanvas } from './PreviewCanvas'
import { UploadForm } from './UploadForm'
import { WrapSelector } from './WrapSelector'

interface VisualizerClientProps {
    wraps: WrapDTO[]
    canManageCatalog?: boolean
}

type PreviewMode = 'upload' | 'template'

export function VisualizerClient({ wraps, canManageCatalog = false }: VisualizerClientProps) {
    // State
    const [selectedWrapId, setSelectedWrapId] = useState<string | null>(wraps[0]?.id ?? null)
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateVehicleOption>(
        templateVehicleOptions[0]
    )
    const [preview, setPreview] = useState<VisualizerPreviewDTO | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<PreviewMode>('upload')
    const [error, setError] = useState<string | null>(null)
    const [permissionDenied, setPermissionDenied] = useState(false)

    // Memo
    const selectedWrap = useMemo(
        () => wraps.find((wrap) => wrap.id === selectedWrapId) ?? null,
        [selectedWrapId, wraps]
    )

    // Handlers
    function handleWrapSelect(wrapId: string) {
        setSelectedWrapId(wrapId)
        setPreview(null)
    }
    function handlePreviewReady(newPreview: VisualizerPreviewDTO) {
        setPreview(newPreview)
        setError(null)
        setPermissionDenied(false)
    }
    function handleTemplatePreview(vehicle: TemplateVehicleOption) {
        if (!selectedWrapId) return
        setSelectedTemplate(vehicle)
        setPreview(buildTemplatePreview({ wrapId: selectedWrapId, imageUrl: vehicle.imageUrl }))
        setError(null)
        setPermissionDenied(false)
    }

    // Modern layout
    return (
        <div className="flex h-[70vh] w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-lg">
            {/* Sidebar */}
            <aside className="min-w-55 flex w-64 flex-col gap-6 border-r border-neutral-800 bg-neutral-900/90 p-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-neutral-100">Wraps</h2>
                    <WrapSelector
                        wraps={wraps}
                        selectedWrapId={selectedWrapId}
                        onSelect={handleWrapSelect}
                        canManageCatalog={canManageCatalog}
                        className="max-h-60 overflow-y-auto"
                    />
                </div>
                <div className="mt-auto">
                    <Tabs
                        value={mode}
                        onValueChange={(value: string) => setMode(value as PreviewMode)}
                        className="w-full"
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                            <TabsTrigger value="template">Template Preview</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </aside>

            {/* Main canvas area */}
            <main className="relative flex flex-1 flex-col items-center justify-center bg-neutral-950 p-8">
                {/* Top bar */}
                <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-4">
                    <span className="text-sm text-neutral-400">
                        {selectedWrap?.name ?? 'Select a wrap'}
                    </span>
                    <div className="flex gap-2">
                        {/* Download/share actions */}
                        {preview && !isLoading && !error && !permissionDenied && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Use preview.url or preview.resultUrl depending on DTO
                                    const url =
                                        preview.processedImageUrl ||
                                        preview.customerPhotoUrl ||
                                        undefined
                                    if (url) {
                                        const link = document.createElement('a')
                                        link.href = url
                                        link.download = 'visualizer-preview.png'
                                        link.click()
                                    }
                                }}
                            >
                                Download
                            </Button>
                        )}
                        {/* TODO: Add share action */}
                    </div>
                </div>

                {/* Canvas and controls */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-6">
                    {/* Mode controls */}
                    <div className="w-full max-w-md">
                        <Tabs
                            value={mode}
                            onValueChange={(value: string) => setMode(value as PreviewMode)}
                            className="w-full"
                        >
                            <TabsList className="w-full">
                                <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                                <TabsTrigger value="template">Template Preview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload">
                                {selectedWrap && (
                                    <UploadForm
                                        wrapId={selectedWrap.id}
                                        onPreviewReady={handlePreviewReady}
                                        onUploadingChange={setIsLoading}
                                        className="mt-4"
                                    />
                                )}
                            </TabsContent>
                            <TabsContent value="template">
                                {selectedWrap && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex gap-2">
                                            {templateVehicleOptions.map((vehicle) => (
                                                <Button
                                                    key={vehicle.id}
                                                    variant={
                                                        selectedTemplate.id === vehicle.id
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    onClick={() => handleTemplatePreview(vehicle)}
                                                >
                                                    {vehicle.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Preview canvas */}
                    <div className="h-105 flex w-full max-w-2xl items-center justify-center">
                        <PreviewCanvas
                            preview={preview}
                            isLoading={isLoading}
                            error={error}
                            permissionDenied={permissionDenied}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
