/**
 * @introduction Components — TODO: short one-line summary of booking-form-shell.tsx
 *
 * @description TODO: longer description for booking-form-shell.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingFormShellProps {
    title?: string
    description?: string
    children: ReactNode
}

/**
 * BookingFormShell — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
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
