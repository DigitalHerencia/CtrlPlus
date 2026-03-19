'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { createVisualizerPreview } from '@/lib/visualizer/actions/create-visualizer-preview'
import type { VisualizerPreviewDTO } from '@/lib/visualizer/types'
import { cn } from '@/lib/utils'
import { Loader2, UploadCloud } from 'lucide-react'

interface UploadFormProps {
    wrapId: string
    onPreviewReady: (preview: VisualizerPreviewDTO) => void
    onUploadingChange?: (isUploading: boolean) => void
    onError?: (message: string | null) => void
    className?: string
}

export function UploadForm({
    wrapId,
    onPreviewReady,
    onUploadingChange,
    onError,
    className,
}: UploadFormProps) {
    const [isPending, startTransition] = useTransition()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedFileName, setSelectedFileName] = useState<string>('')

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!selectedFile) {
            onError?.('Select an image to continue.')
            return
        }

        onError?.(null)
        onUploadingChange?.(true)

        startTransition(() => {
            void createVisualizerPreview({
                wrapId,
                file: selectedFile,
            })
                .then((preview) => {
                    onPreviewReady(preview)
                })
                .catch((error) => {
                    onError?.(
                        error instanceof Error ? error.message : 'Preview generation failed.'
                    )
                })
                .finally(() => {
                    onUploadingChange?.(false)
                })
        })
    }

    return (
        <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/90 p-5">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-neutral-50">Upload Your Vehicle</h2>
                    <p className="text-sm text-neutral-400">
                        Use a clean side profile. JPEG, PNG, WebP, or HEIC up to 10MB.
                    </p>
                </div>
                <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/80 px-6 py-8 text-center transition hover:border-blue-500/60 hover:bg-neutral-900">
                    <UploadCloud className="h-12 w-12 text-neutral-500" />
                    <div className="space-y-1">
                        <p className="text-base font-medium text-neutral-100">
                            Drag and drop or click to choose a vehicle image
                        </p>
                        <p className="text-sm text-neutral-500">
                            {selectedFileName || 'No file selected yet'}
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null
                            setSelectedFile(file)
                            setSelectedFileName(file?.name ?? '')
                        }}
                    />
                </label>
                <Button type="submit" className="w-full" disabled={isPending || !selectedFile}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Preview
                        </>
                    ) : (
                        'Generate Preview'
                    )}
                </Button>
            </div>
        </form>
    )
}
