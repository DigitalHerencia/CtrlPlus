import { BookingsManagerPageFeature } from '@/features/scheduling/manage/bookings-manager-page-feature'

interface ManageSchedulingPageProps {
    searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>
}

export default async function ManageSchedulingPage({ searchParams }: ManageSchedulingPageProps) {
    return <BookingsManagerPageFeature searchParams={searchParams} />
}
