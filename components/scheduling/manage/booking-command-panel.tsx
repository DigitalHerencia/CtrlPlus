/**
 * @introduction Components — TODO: short one-line summary of booking-command-panel.tsx
 *
 * @description TODO: longer description for booking-command-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingCommandPanelProps {
    children: ReactNode
}

/**
 * BookingCommandPanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingCommandPanel({ children }: BookingCommandPanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Command Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">{children}</CardContent>
        </Card>
    )
}
