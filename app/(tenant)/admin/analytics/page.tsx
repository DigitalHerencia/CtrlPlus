import { AdminAnalyticsPageFeature } from '@/features/admin/admin-analytics-page-feature'
import { getSingleSearchParam } from '@/lib/utils/search-params'

interface AdminAnalyticsPageProps {
    searchParams: Promise<{ startDate?: string | string[]; endDate?: string | string[] }>
}

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
    const params = await searchParams

    return (
        <AdminAnalyticsPageFeature
            startDate={getSingleSearchParam(params.startDate)}
            endDate={getSingleSearchParam(params.endDate)}
        />
    )
}
