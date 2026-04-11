import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingFormShellProps {
    title?: string
    description?: string
    children: ReactNode
}

export function BookingFormShell({
    title = 'Create Booking',
    description = 'Pick slot, collect customer information, and submit booking.',
    children,
}: BookingFormShellProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-neutral-400">{description}</p>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    )
}
