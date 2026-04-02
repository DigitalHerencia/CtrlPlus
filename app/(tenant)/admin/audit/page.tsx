import { AdminAuditPageFeature } from '@/features/admin/admin-audit-page-feature'
import { getSingleSearchParam } from '@/lib/utils/search-params'

interface AdminAuditPageProps {
    searchParams: Promise<{ eventType?: string | string[]; resourceType?: string | string[] }>
}

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
    const params = await searchParams

    return (
        <AdminAuditPageFeature
            eventType={getSingleSearchParam(params.eventType)}
            resourceType={getSingleSearchParam(params.resourceType)}
        />
    )
}
