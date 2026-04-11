/**
 * @introduction Components — TODO: short one-line summary of wrap-asset-readiness-panel.tsx
 *
 * @description TODO: longer description for wrap-asset-readiness-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { CatalogAssetReadinessDTO } from '@/types/catalog.types'

interface WrapAssetReadinessPanelProps {
    readiness: CatalogAssetReadinessDTO
}

/**
 * WrapAssetReadinessPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function WrapAssetReadinessPanel({ readiness }: WrapAssetReadinessPanelProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {readiness.canPublish ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                )}
                <span className="text-sm font-medium">
                    {readiness.canPublish ? 'Ready to Publish' : 'Not Ready'}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neutral-400">Hero</span>
                <Badge variant="outline">{readiness.activeHeroCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neutral-400">Gallery</span>
                <Badge variant="outline">{readiness.activeGalleryCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-neutral-400">Reference Set</span>
                <Badge variant="outline">
                    {readiness.activeHeroCount + readiness.activeGalleryCount}
                </Badge>
            </div>
        </div>
    )
}
