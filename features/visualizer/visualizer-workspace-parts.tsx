import {
    getVisualizerWrapSelectionById,
    listVisualizerWrapSelections,
} from '@/lib/fetchers/visualizer.fetchers'
import type { VisualizerPageFeatureProps } from '@/types/visualizer.types'

import { VisualizerWorkspaceShellClient } from './visualizer-workspace-shell.client'

export async function getVisualizerWorkspaceData({
    requestedWrapId,
    includeHidden,
}: Pick<VisualizerPageFeatureProps, 'requestedWrapId' | 'includeHidden'>) {
    const wraps = await listVisualizerWrapSelections({ includeHidden })
    const requestedWrap = requestedWrapId
        ? await getVisualizerWrapSelectionById(requestedWrapId, { includeHidden })
        : null

    return {
        wraps,
        initialWrapId: requestedWrap?.id ?? wraps[0]?.id ?? null,
    }
}

export async function VisualizerWorkspaceRegion({
    requestedWrapId,
    canManageCatalog,
    includeHidden,
}: VisualizerPageFeatureProps) {
    const { wraps, initialWrapId } = await getVisualizerWorkspaceData({
        requestedWrapId,
        includeHidden,
    })

    return (
        <VisualizerWorkspaceShellClient
            wraps={wraps}
            initialWrapId={initialWrapId}
            canManageCatalog={canManageCatalog}
        />
    )
}
