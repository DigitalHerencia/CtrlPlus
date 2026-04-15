import { BookingDetailPageFeature } from '@/features/scheduling/booking-detail-page-feature'

interface BookingDetailPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
    return <BookingDetailPageFeature params={params} />
}
