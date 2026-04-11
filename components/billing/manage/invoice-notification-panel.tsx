/**
 * @introduction Components — TODO: short one-line summary of invoice-notification-panel.tsx
 *
 * @description TODO: longer description for invoice-notification-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceNotificationPanelProps {
    children: ReactNode
}

/**
 * InvoiceNotificationPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
