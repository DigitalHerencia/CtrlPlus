/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { cn } from '@/lib/utils'
import { PreviewStatus, type VisualizerPreviewDTO } from '@/lib/visualizer/types'
import { ImageOff, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface PreviewCanvasProps {
    preview: VisualizerPreviewDTO | null
    isLoading?: boolean
    className?: string
    wrapOverlayUrl?: string | null
    error?: string | null
    permissionDenied?: boolean
}

export function PreviewCanvas({
    preview,
    isLoading = false,
    className,
    wrapOverlayUrl,
    error,
    permissionDenied,
}: PreviewCanvasProps) {
    if (isLoading) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center gap-3 border border-neutral-700 bg-neutral-900 p-12',
                    className
                )}
            >
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-neutral-300">Generating your preview…</p>
            </div>
        )
    }

    if (permissionDenied) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-dashed border-red-700 bg-red-900 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-red-500" />
                <p className="text-sm text-red-400">
                    You do not have permission to view this preview.
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-dashed border-red-700 bg-red-900 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-red-500" />
                <p className="text-sm text-red-400">{error}</p>
            </div>
        )
    }

    if (!preview) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-700 bg-neutral-900 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-neutral-500" />
                <p className="text-sm text-neutral-400">
                    Select a wrap and choose upload or template mode to see a preview here.
                </p>
            </div>
        )
    }

    if (preview.status === PreviewStatus.PENDING || preview.status === PreviewStatus.PROCESSING) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-neutral-700 bg-neutral-900 p-12',
                    className
                )}
            >
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-neutral-300">Processing your preview…</p>
            </div>
        )
    }

    if (preview.status === PreviewStatus.FAILED) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-neutral-700 bg-neutral-900 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-blue-600" />
                <p className="text-sm text-neutral-100">
                    Preview generation failed. Try template mode or continue to scheduling.
                </p>
            </div>
        )
    }

    const imageUrl = preview.processedImageUrl ?? preview.customerPhotoUrl
    const showOverlay = Boolean(wrapOverlayUrl && !preview.processedImageUrl)

    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })

    function handleZoomIn() {
        setZoom((z) => Math.min(z + 0.2, 2))
    }
    function handleZoomOut() {
        setZoom((z) => Math.max(z - 0.2, 0.5))
    }
    function handleReset() {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    // Download logic
    function handleDownload() {
        const url = imageUrl
        if (url) {
            const link = document.createElement('a')
            link.href = url
            link.download = 'visualizer-preview.png'
            link.click()
        }
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg',
                className
            )}
        >
            {/* Overlay actions */}
            <div className="absolute right-3 top-3 z-20 flex gap-2">
                <button
                    type="button"
                    className="rounded bg-blue-600 px-2 py-1 text-xs text-neutral-100 shadow hover:bg-blue-700"
                    onClick={handleDownload}
                >
                    Download
                </button>
                {/* TODO: Add share action */}
            </div>
            {/* Zoom/pan controls */}
            <div className="absolute bottom-3 left-3 z-20 flex gap-2 rounded bg-neutral-900/80 p-2">
                <button
                    type="button"
                    className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-100 shadow hover:bg-neutral-700"
                    onClick={handleZoomOut}
                >
                    -
                </button>
                <span className="text-xs text-neutral-200">{(zoom * 100).toFixed(0)}%</span>
                <button
                    type="button"
                    className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-100 shadow hover:bg-neutral-700"
                    onClick={handleZoomIn}
                >
                    +
                </button>
                <button
                    type="button"
                    className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-100 shadow hover:bg-neutral-700"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
            {/* Responsive canvas */}
            <div className="relative flex h-full min-h-72 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="Wrap preview on your vehicle"
                    style={{
                        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                        transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
                        maxHeight: '320px',
                        maxWidth: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.7)',
                    }}
                    className="object-contain"
                />
                {showOverlay && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={wrapOverlayUrl ?? undefined}
                        alt="Selected wrap overlay"
                        className="pointer-events-none absolute inset-[12%] h-[76%] w-[76%] object-contain opacity-35 mix-blend-screen"
                    />
                )}
            </div>
            {/* Status badge and expiry info */}
            <div className="flex items-center justify-between border-t border-neutral-700 bg-neutral-900 px-4 py-2">
                <span className="inline-block rounded bg-blue-600 px-2 py-1 text-xs text-neutral-100">
                    {preview.status}
                </span>
                <p className="text-xs text-neutral-400">
                    Preview result · expires{' '}
                    {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    }).format(preview.expiresAt)}
                </p>
            </div>
        </div>
    )
}
