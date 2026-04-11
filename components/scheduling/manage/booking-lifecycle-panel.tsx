/**
 * @introduction Components — TODO: short one-line summary of booking-lifecycle-panel.tsx
 *
 * @description TODO: longer description for booking-lifecycle-panel.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingLifecyclePanelProps {
    children: ReactNode
}

/**
 * BookingLifecyclePanel — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingLifecyclePanel({ children }: BookingLifecyclePanelProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardHeader>
                <CardTitle>Lifecycle Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">{children}</CardContent>
        </Card>
    )
}
