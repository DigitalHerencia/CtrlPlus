/**
 * @introduction Components — TODO: short one-line summary of bookings-manager-row-actions.tsx
 *
 * @description TODO: longer description for bookings-manager-row-actions.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface BookingsManagerRowActionsProps {
    bookingId: string
}

/**
 * BookingsManagerRowActions — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingsManagerRowActions({ bookingId }: BookingsManagerRowActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href={`/scheduling/manage/${bookingId}`}>View</Link>
            </Button>
            <Button asChild size="sm">
                <Link href={`/scheduling/manage/${bookingId}/edit`}>Edit</Link>
            </Button>
        </div>
    )
}
