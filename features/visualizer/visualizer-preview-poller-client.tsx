'use client'

import { useEffect, useEffectEvent } from 'react'

import { PreviewStatus } from '@/lib/constants/statuses'
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

        const poll = async () => {
            try {
                const response = await fetch(`/visualizer/previews/${previewId}`, {
                    cache: 'no-store',
                })

                if (!response.ok) {
                    throw new Error('Failed to refresh preview status.')
                }

                const payload = (await response.json()) as PreviewPollResponse
                if (cancelled) {
                    return
                }

                const nextPreview = deserializePreview(payload.preview)
                handlePreviewUpdate(nextPreview)

                if (
                    !nextPreview ||
                    nextPreview.status === PreviewStatus.COMPLETE ||
                    nextPreview.status === PreviewStatus.FAILED
                ) {
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
