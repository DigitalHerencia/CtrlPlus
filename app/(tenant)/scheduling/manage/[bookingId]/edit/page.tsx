import { EditManagedBookingPageFeature } from '@/features/scheduling/manage/edit-managed-booking-page-feature'

interface ManageEditBookingPageProps {
    params: Promise<{ bookingId: string }>
}

export default async function ManageEditBookingPage({ params }: ManageEditBookingPageProps) {
    return <EditManagedBookingPageFeature params={params} />
}
