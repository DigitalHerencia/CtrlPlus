'use client'

import { Badge } from '@/components/ui/badge'

export function VisualizerGenerationToolbarClient() {
    return (
        <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/90 p-3">
            <span className="text-sm text-neutral-300">Generation mode</span>
            <Badge variant="outline" className="border-neutral-700 text-neutral-200">
                AI Concept Preview
            </Badge>
        </div>
    )
}
