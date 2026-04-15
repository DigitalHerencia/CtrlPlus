import { EditBookingPageFeature } from '@/features/scheduling/edit-booking-page-feature'

interface EditBookingPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
    return <EditBookingPageFeature params={params} />
}
