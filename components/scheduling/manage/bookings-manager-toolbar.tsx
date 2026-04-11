/**
 * @introduction Components — TODO: short one-line summary of bookings-manager-toolbar.tsx
 *
 * @description TODO: longer description for bookings-manager-toolbar.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface BookingsManagerToolbarProps {
    children: ReactNode
}

/**
 * BookingsManagerToolbar — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerToolbar({ children }: BookingsManagerToolbarProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80">
            <CardContent className="flex flex-wrap items-center gap-2 p-4">{children}</CardContent>
        </Card>
    )
}
