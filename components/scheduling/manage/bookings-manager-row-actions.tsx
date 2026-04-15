
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface BookingsManagerRowActionsProps {
    bookingId: string
}


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
