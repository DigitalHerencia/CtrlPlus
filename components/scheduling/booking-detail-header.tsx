
import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import type { BookingDetailViewDTO } from '@/types/scheduling.types'

interface BookingDetailHeaderProps {
    booking: BookingDetailViewDTO
    isManageView?: boolean
}


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
