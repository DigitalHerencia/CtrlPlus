import Link from 'next/link'
import type { ReactNode } from 'react'

import type { BookingDetailViewDTO } from '@/types/scheduling.types'

import { BookingDetailHeader } from './booking-detail-header'
import { WorkspacePageContextCard } from '../shared/tenant-elements'
import { Button } from '../ui/button'

interface BookingDetailPageViewProps {
    booking: BookingDetailViewDTO
    isManageView: boolean
    detailTabs: ReactNode
}

export function BookingDetailPageView({
    booking,
    isManageView,
    detailTabs,
}: BookingDetailPageViewProps) {
    const basePath = isManageView ? `/scheduling/manage/${booking.id}` : `/scheduling/${booking.id}`

    return (
        <div className="space-y-6">
            <BookingDetailHeader booking={booking} isManageView={isManageView} />
            <WorkspacePageContextCard
                title={isManageView ? 'Appointment Actions' : 'My Appointment'}
                description="Navigate or edit this appointment"
            >
                <Button asChild variant="outline">
                    <Link href={isManageView ? '/scheduling/manage' : '/scheduling'}>Back</Link>
                </Button>
                <Button asChild>
                    <Link href={`${basePath}/edit`}>Edit Appointment</Link>
                </Button>
            </WorkspacePageContextCard>
            {detailTabs}
        </div>
    )
}
