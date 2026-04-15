
import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceFormShellProps {
    title: string
    description?: string
    children: ReactNode
}


export function InvoiceFormShell({ title, description, children }: InvoiceFormShellProps) {
    return (
        <Card className="border-neutral-700 bg-neutral-950/80">
            <CardHeader>
                <CardTitle className="text-neutral-100">{title}</CardTitle>
                {description ? <p className="text-sm text-neutral-400">{description}</p> : null}
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    )
}
