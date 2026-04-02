'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { Loader2, UploadCloud } from 'lucide-react'

interface UploadFormProps {
    wrapId: string
    selectedFile: File | null
    onFileChange: (file: File | null) => void
    onSubmit: (file: File) => void
    isSubmitting?: boolean
    error?: string | null
    className?: string
}

export function UploadForm({
    wrapId,
    selectedFile,
    onFileChange,
    onSubmit,
    isSubmitting = false,
    error,
    className,
}: UploadFormProps) {
    const [localError, setLocalError] = useState<string | null>(null)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!selectedFile) {
            setLocalError('Select an image to continue.')
            return
        }

        setLocalError(null)
        onSubmit(selectedFile)
    }

    return (
        <form onSubmit={handleSubmit} className={cn('space-y-4', className)} data-wrap-id={wrapId}>
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/90 p-5">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-neutral-50">Upload Your Vehicle</h2>
                    <p className="text-sm text-neutral-400">
                        Use a clean side profile. JPEG, PNG, or WebP up to 10MB.
                    </p>
                </div>
                {error || localError ? (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                        {error ?? localError}
                    </div>
                ) : null}
                <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/80 px-6 py-8 text-center transition hover:border-blue-500/60 hover:bg-neutral-900">
                    <UploadCloud className="h-12 w-12 text-neutral-500" />
                    <div className="space-y-1">
                        <p className="text-base font-medium text-neutral-100">
                            Drag and drop or click to choose a vehicle image
                        </p>
                        <p className="text-sm text-neutral-500">
                            {selectedFile?.name || 'No file selected yet'}
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null
                            onFileChange(file)
                            setLocalError(null)
                        }}
                    />
                </label>
                <Button type="submit" className="w-full" disabled={isSubmitting || !selectedFile}>
                    {isSubmitting ? (
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
