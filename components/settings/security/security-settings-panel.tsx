/**
 * @introduction Components — TODO: short one-line summary of security-settings-panel.tsx
 *
 * @description TODO: longer description for security-settings-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SecuritySettingsPanelProps {
    children: ReactNode
}

/**
 * SecuritySettingsPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
