import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function VisualizerSettingsCard({ children }: { children: ReactNode }) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/90 text-neutral-100">
            <CardHeader>
                <CardTitle>Wrap Settings</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
