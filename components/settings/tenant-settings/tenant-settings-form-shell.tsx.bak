import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TenantSettingsFormShellProps {
    children: ReactNode
}

export function TenantSettingsFormShell({ children }: TenantSettingsFormShellProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
            <CardHeader>
                <CardTitle>Tenant Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    )
}
