import { type ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface InvoiceManagerToolbarProps {
    children: ReactNode
}

export function InvoiceManagerToolbar({ children }: InvoiceManagerToolbarProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900">
            <CardContent className="flex flex-wrap items-center gap-2 p-4">{children}</CardContent>
        </Card>
    )
}
