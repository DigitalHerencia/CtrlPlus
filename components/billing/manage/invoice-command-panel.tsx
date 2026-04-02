import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceCommandPanelProps {
    children: ReactNode
}

export function InvoiceCommandPanel({ children }: InvoiceCommandPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader>
                <CardTitle className="text-neutral-100">Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">{children}</CardContent>
        </Card>
    )
}
