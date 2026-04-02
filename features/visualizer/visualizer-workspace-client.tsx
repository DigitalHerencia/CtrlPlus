'use client'

import { useMemo, useRef, useState, useTransition } from 'react'

import { VisualizerClient } from '@/components/visualizer/VisualizerClient'
import type { VisualizerWrapSelectionDTO } from '@/types/catalog.types'
import {
    createVisualizerPreview,
    processVisualizerPreview,
    regenerateVisualizerPreview,
} from '@/lib/actions/visualizer.actions'
import { PreviewStatus } from '@/lib/constants/statuses'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import { VisualizerPreviewPollerClient } from './visualizer-preview-poller-client'

interface VisualizerWorkspaceClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    initialWrapId: string | null
    canManageCatalog: boolean
}

function isPreviewRunning(preview: VisualizerPreviewDTO | null) {
    return preview?.status === PreviewStatus.PENDING || preview?.status === PreviewStatus.PROCESSING
}

export function VisualizerWorkspaceClient({
    wraps,
    initialWrapId,
    canManageCatalog,
}: VisualizerWorkspaceClientProps) {
    const [isSubmitting, startTransition] = useTransition()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedWrapId, setSelectedWrapId] = useState<string | null>(initialWrapId)
    const [preview, setPreview] = useState<VisualizerPreviewDTO | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const activePreviewIdRef = useRef<string | null>(null)

    const filteredWraps = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        if (!query) {
            return wraps
        }

        return wraps.filter((wrap) =>
            [wrap.name, wrap.description ?? '', ...wrap.categories.map((category) => category.name)]
                .join(' ')
                .toLowerCase()
                .includes(query)
        )
    }, [searchQuery, wraps])

    const selectedWrap =
        filteredWraps.find((wrap) => wrap.id === selectedWrapId) ??
        wraps.find((wrap) => wrap.id === selectedWrapId) ??
        null

    function beginProcessing(nextPreview: VisualizerPreviewDTO) {
        if (
            nextPreview.status !== PreviewStatus.PENDING &&
            nextPreview.status !== PreviewStatus.PROCESSING
        ) {
            return
        }

        const previewId = nextPreview.id
        void processVisualizerPreview({ previewId: nextPreview.id })
            .then((processedPreview) => {
                if (activePreviewIdRef.current !== previewId) {
                    return
                }

                setPreview(processedPreview)
                setError(null)
            })
            .catch((previewError) => {
                if (activePreviewIdRef.current !== previewId) {
                    return
                }

                setError(
                    previewError instanceof Error
                        ? previewError.message
                        : 'Preview processing failed.'
                )
            })
    }

    function handleSelectWrap(wrapId: string) {
        setSelectedWrapId(wrapId)
        setPreview(null)
        setError(null)
        setSelectedFile(null)
        activePreviewIdRef.current = null
    }

    function handleFileChange(file: File | null) {
        setSelectedFile(file)
        setError(null)
    }

    function handleCreatePreview(file: File) {
        if (!selectedWrap) {
            setError('Select a wrap before generating a preview.')
            return
        }

        setError(null)
        startTransition(() => {
            void createVisualizerPreview({
                wrapId: selectedWrap.id,
                file,
            })
                .then((nextPreview) => {
                    activePreviewIdRef.current = nextPreview.id
                    setPreview(nextPreview)
                    setSelectedFile(null)

                    if (nextPreview.status === PreviewStatus.COMPLETE) {
                        setError(null)
                        return
                    }

                    beginProcessing(nextPreview)
                })
                .catch((previewError) => {
                    setError(
                        previewError instanceof Error
                            ? previewError.message
                            : 'Preview creation failed.'
                    )
                })
        })
    }

    function handleRegeneratePreview() {
        if (!preview) {
            return
        }

        setError(null)
        startTransition(() => {
            void regenerateVisualizerPreview({ previewId: preview.id })
                .then((nextPreview) => {
                    activePreviewIdRef.current = nextPreview.id
                    setPreview(nextPreview)
                    beginProcessing(nextPreview)
                })
                .catch((previewError) => {
                    setError(
                        previewError instanceof Error
                            ? previewError.message
                            : 'Preview regeneration failed.'
                    )
                })
        })
    }

    const previewIsRunning = isPreviewRunning(preview)

    return (
        <>
            <VisualizerPreviewPollerClient
                previewId={preview?.id ?? null}
                enabled={previewIsRunning}
                onPreviewUpdate={(nextPreview) => {
                    if (nextPreview && activePreviewIdRef.current !== nextPreview.id) {
                        return
                    }

                    setPreview(nextPreview)
                    if (nextPreview?.status === PreviewStatus.COMPLETE) {
                        setError(null)
                    }
                }}
                onError={setError}
            />
            <VisualizerClient
                wraps={filteredWraps}
                selectedWrap={selectedWrap}
                selectedWrapId={selectedWrapId}
                searchQuery={searchQuery}
                canManageCatalog={canManageCatalog}
                preview={preview}
                error={error}
                isPending={isSubmitting}
                isProcessing={previewIsRunning}
                selectedFile={selectedFile}
                onSearchQueryChange={setSearchQuery}
                onSelectWrap={handleSelectWrap}
                onFileChange={handleFileChange}
                onCreatePreview={handleCreatePreview}
                onRegeneratePreview={handleRegeneratePreview}
            />
        </>
    )
}
