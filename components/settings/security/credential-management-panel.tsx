/**
 * @introduction Components — TODO: short one-line summary of credential-management-panel.tsx
 *
 * @description TODO: longer description for credential-management-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CredentialManagementPanelProps {
    children: ReactNode
}

/**
 * CredentialManagementPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function CredentialManagementPanel({ children }: CredentialManagementPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/70 text-neutral-100">
            <CardHeader>
                <CardTitle>Credential Management</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
