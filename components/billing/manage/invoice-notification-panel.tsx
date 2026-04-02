import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceNotificationPanelProps {
    children: ReactNode
}

export function InvoiceNotificationPanel({ children }: InvoiceNotificationPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardHeader>
                <CardTitle className="text-neutral-100">Notification Controls</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
