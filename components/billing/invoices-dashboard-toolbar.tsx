/**
 * @introduction Components — TODO: short one-line summary of invoices-dashboard-toolbar.tsx
 *
 * @description TODO: longer description for invoices-dashboard-toolbar.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { type ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface InvoicesDashboardToolbarProps {
    children: ReactNode
}

/**
 * InvoicesDashboardToolbar — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function InvoicesDashboardToolbar({ children }: InvoicesDashboardToolbarProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardContent className="flex flex-wrap items-center gap-3 p-4">{children}</CardContent>
        </Card>
    )
}
