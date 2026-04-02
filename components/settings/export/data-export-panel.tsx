import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataExportPanelProps {
    children: ReactNode
}

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
