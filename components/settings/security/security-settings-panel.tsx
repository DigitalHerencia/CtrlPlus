
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SecuritySettingsPanelProps {
    children: ReactNode
}


export function SecuritySettingsPanel({ children }: SecuritySettingsPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
