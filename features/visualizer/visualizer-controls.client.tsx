'use client'

import { Button } from '@/components/ui/button'

interface VisualizerControlsClientProps {
    onGenerate?: () => void
    onRegenerate?: () => void
    disabled?: boolean
}

export function VisualizerControlsClient({
    onGenerate,
    onRegenerate,
    disabled = false,
}: VisualizerControlsClientProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onGenerate} disabled={disabled}>
                Generate Preview
            </Button>
            <Button type="button" variant="outline" onClick={onRegenerate} disabled={disabled}>
                Regenerate
            </Button>
        </div>
    )
}
