/**
 * @introduction Components — TODO: short one-line summary of data-export-panel.tsx
 *
 * @description TODO: longer description for data-export-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataExportPanelProps {
    children: ReactNode
}

/**
 * DataExportPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function DataExportPanel({ children }: DataExportPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
            <CardHeader>
                <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    )
}
