import { BookingDetailPageFeature } from '@/features/scheduling/booking-detail-page-feature'

interface ManageBookingDetailPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function ManageBookingDetailPage({ params }: ManageBookingDetailPageProps) {
    return <BookingDetailPageFeature params={params} isManageView />
}
