/**
 * @introduction Components — TODO: short one-line summary of tenant-settings-form-shell.tsx
 *
 * @description TODO: longer description for tenant-settings-form-shell.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TenantSettingsFormShellProps {
    children: ReactNode
}

/**
 * TenantSettingsFormShell — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
