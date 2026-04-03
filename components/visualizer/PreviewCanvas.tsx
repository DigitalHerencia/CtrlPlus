'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils/cn'
import { PreviewStatus } from '@/lib/constants/statuses'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { ImageOff, Loader2 } from 'lucide-react'

interface PreviewCanvasProps {
    preview: VisualizerPreviewDTO | null
    isLoading?: boolean
    className?: string
    error?: string | null
    permissionDenied?: boolean
}

export function PreviewCanvas({
    preview,
    isLoading = false,
    className,
    error,
    permissionDenied,
}: PreviewCanvasProps) {
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })

    function handleZoomIn() {
        setZoom((value) => Math.min(value + 0.2, 2))
    }

    function handleZoomOut() {
        setZoom((value) => Math.max(value - 0.2, 0.5))
    }

    function handleReset() {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    function handleDownload() {
        const imageUrl = preview?.processedImageUrl ?? preview?.customerPhotoUrl
        if (!imageUrl) {
            return
        }

        const link = document.createElement('a')
        link.href = imageUrl
        link.download = 'visualizer-preview.png'
        link.click()
    }

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
                    Upload a vehicle image and generate a preview to see the finished wrap here.
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
                <p className="text-sm text-neutral-300">
                    {preview.status === PreviewStatus.PENDING
                        ? 'Preparing your preview…'
                        : 'Processing your preview…'}
                </p>
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
                    Preview generation failed. Adjust the upload or regenerate the preview.
                </p>
            </div>
        )
    }

    if (preview.status === PreviewStatus.EXPIRED) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-amber-700 bg-amber-950 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-amber-500" />
                <p className="text-sm text-amber-200">
                    This preview expired. Regenerate it to create a fresh result.
                </p>
            </div>
        )
    }

    if (preview.status !== PreviewStatus.COMPLETE) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center gap-3 border border-dashed border-orange-700 bg-orange-950 p-12 text-center',
                    className
                )}
            >
                <ImageOff className="h-10 w-10 text-orange-400" />
                <p className="text-sm text-orange-200">
                    Preview status is unsupported. Please regenerate and try again.
                </p>
            </div>
        )
    }

    const imageUrl = preview.processedImageUrl ?? preview.customerPhotoUrl

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg',
                className
            )}
        >
            <div className="absolute right-3 top-3 z-20 flex gap-2">
                <button
                    type="button"
                    className="rounded bg-blue-600 px-2 py-1 text-xs text-neutral-100 shadow hover:bg-blue-700"
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>
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
            </div>
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
                    }).format(new Date(preview.expiresAt))}
                </p>
            </div>
        </div>
    )
}
