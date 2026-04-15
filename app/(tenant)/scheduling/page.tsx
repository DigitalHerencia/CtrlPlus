import { SchedulingBookingsPageFeature } from '@/features/scheduling/scheduling-bookings-page-feature'

interface SchedulingPageProps {
    searchParams: Promise<{ tab?: string | string[] }>
}

export default async function SchedulingPage({ searchParams }: SchedulingPageProps) {
    return <SchedulingBookingsPageFeature searchParams={searchParams} />
}
