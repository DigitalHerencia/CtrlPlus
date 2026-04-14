/**
 * @introduction Components — TODO: short one-line summary of invoice-command-panel.tsx
 *
 * @description TODO: longer description for invoice-command-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceCommandPanelProps {
    children: ReactNode
}

/**
 * InvoiceCommandPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoiceCommandPanel({ children }: InvoiceCommandPanelProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader>
                <CardTitle className="text-neutral-100">Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">{children}</CardContent>
        </Card>
    )
}
