'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function VisualizerSettingsPanelClient() {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardHeader>
                <CardTitle>Preview Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-neutral-400">
                    Settings apply to AI concept previews and may change across retries.
                </p>
            </CardContent>
        </Card>
    )
}
