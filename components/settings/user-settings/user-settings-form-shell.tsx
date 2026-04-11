/**
 * @introduction Components — TODO: short one-line summary of user-settings-form-shell.tsx
 *
 * @description TODO: longer description for user-settings-form-shell.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserSettingsFormShellProps {
    title?: string
    children: ReactNode
}

/**
 * UserSettingsFormShell — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function UserSettingsFormShell({
    title = 'User Preferences',
    children,
}: UserSettingsFormShellProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    )
}
