'use client'

import { useEffect, useEffectEvent } from 'react'

import {
    isPreviewProcessingStatus,
    isPreviewTerminalStatus,
    PreviewStatus,
} from '@/lib/constants/statuses'
import type { VisualizerPreviewDTO } from '@/types/visualizer.types'
import type { SerializedVisualizerPreview } from '@/types/visualizer.types'

interface PreviewPollResponse {
    preview: SerializedVisualizerPreview | null
}

interface VisualizerPreviewPollerClientProps {
    previewId: string | null
    enabled: boolean
    onPreviewUpdate: (preview: VisualizerPreviewDTO | null) => void
    onError: (message: string | null) => void
    intervalMs?: number
}

function deserializePreview(
    preview: SerializedVisualizerPreview | null
): VisualizerPreviewDTO | null {
    if (!preview) {
        return null
    }

    // Keep timestamp fields as ISO strings to match VisualizerPreviewDTO (Timestamp = string)
    return { ...preview }
}

export function VisualizerPreviewPollerClient({
    previewId,
    enabled,
    onPreviewUpdate,
    onError,
    intervalMs = 2000,
}: VisualizerPreviewPollerClientProps) {
    const handlePreviewUpdate = useEffectEvent(onPreviewUpdate)
    const handleError = useEffectEvent(onError)

    useEffect(() => {
        if (!previewId || !enabled) {
            return
        }

        let cancelled = false
        let timer: ReturnType<typeof setTimeout> | null = null
        let consecutiveErrors = 0
        const maxConsecutiveErrors = 3

        const poll = async () => {
            try {
                const response = await fetch(`/api/visualizer/previews/${previewId}`, {
                    cache: 'no-store',
                })

                if (!response.ok) {
                    if (response.status === 404) {
                        handlePreviewUpdate(null)
                        handleError('Preview no longer exists or has expired.')
                        return
                    }

                    throw new Error('Failed to refresh preview status.')
                }

                const payload = (await response.json()) as PreviewPollResponse
                if (cancelled) {
                    return
                }

                consecutiveErrors = 0

                const nextPreview = deserializePreview(payload.preview)
                handlePreviewUpdate(nextPreview)

                if (!nextPreview) {
                    handleError('Preview response was empty.')
                    return
                }

                if (isPreviewTerminalStatus(nextPreview.status)) {
                    if (nextPreview.status === PreviewStatus.EXPIRED) {
                        handleError('Preview expired before completion. Regenerate to continue.')
                    } else if (nextPreview.status === PreviewStatus.FAILED) {
                        handleError('Preview generation failed. Adjust the upload or regenerate.')
                    } else {
                        handleError(null)
                    }

                    return
                }

                if (!isPreviewProcessingStatus(nextPreview.status)) {
                    handleError('Preview entered an unsupported state and polling was stopped.')
                    return
                }

                timer = setTimeout(() => {
                    void poll()
                }, intervalMs)
            } catch (error) {
                if (cancelled) {
                    return
                }

                handleError(
                    error instanceof Error ? error.message : 'Failed to refresh preview status.'
                )

                consecutiveErrors += 1
                if (consecutiveErrors >= maxConsecutiveErrors) {
                    handleError(
                        'Preview status refresh failed repeatedly. Please refresh and try again.'
                    )
                    return
                }

                timer = setTimeout(() => {
                    void poll()
                }, intervalMs)
            }
        }

        void poll()

        return () => {
            cancelled = true
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [enabled, intervalMs, previewId])

    return null
}
