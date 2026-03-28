import type { VisualizerWrapSelectionDTO } from '@/types/catalog/domain'
import type { VisualizerPreviewDTO } from './domain'

export interface VisualizerSearchParamsResult {
    requestedWrapId: string | null
}

export interface VisualizerPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export interface VisualizerPageFeatureProps {
    requestedWrapId: string | null
    canManageCatalog: boolean
    includeHidden: boolean
}

export interface VisualizerWorkspaceClientProps {
    wraps: VisualizerWrapSelectionDTO[]
    initialWrapId: string | null
    canManageCatalog: boolean
}

export interface SerializedVisualizerPreview extends Omit<
    VisualizerPreviewDTO,
    'expiresAt' | 'createdAt' | 'updatedAt'
> {
    expiresAt: string
    createdAt: string
    updatedAt: string
}
