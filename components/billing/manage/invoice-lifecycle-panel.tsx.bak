import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceLifecyclePanelProps {
    children: ReactNode
}

export function InvoiceLifecyclePanel({ children }: InvoiceLifecyclePanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader>
                <CardTitle className="text-neutral-100">Lifecycle Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">{children}</CardContent>
        </Card>
    )
}
