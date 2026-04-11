import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserSettingsFormShellProps {
    title?: string
    children: ReactNode
}

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
