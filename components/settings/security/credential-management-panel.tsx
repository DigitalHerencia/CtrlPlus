
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CredentialManagementPanelProps {
    children: ReactNode
}


export function CredentialManagementPanel({ children }: CredentialManagementPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Credential Management</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
