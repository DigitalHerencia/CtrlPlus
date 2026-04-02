import { AdminAnalyticsPageFeature } from '@/features/admin/admin-analytics-page-feature'

interface AdminAnalyticsPageProps {
    searchParams: Promise<{ startDate?: string | string[]; endDate?: string | string[] }>
}

function getSingleSearchParam(param: string | string[] | undefined): string | null {
    if (!param) return null
    return Array.isArray(param) ? (param[0] ?? null) : param
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
