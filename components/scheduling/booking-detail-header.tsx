/**
 * @introduction Components — TODO: short one-line summary of booking-detail-header.tsx
 *
 * @description TODO: longer description for booking-detail-header.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import type { BookingDetailViewDTO } from '@/types/scheduling.types'

interface BookingDetailHeaderProps {
    booking: BookingDetailViewDTO
    isManageView?: boolean
}

/**
 * BookingDetailHeader — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function BookingDetailHeader({ booking, isManageView = false }: BookingDetailHeaderProps) {
    const label = isManageView ? 'Scheduling Manager' : 'Scheduling'

    return (
        <WorkspacePageIntro
            label={label}
            title={`Booking ${booking.id.slice(0, 10)}`}
            description={`Scheduled ${new Date(booking.scheduledAt).toLocaleString()}`}
        />
    )
}
