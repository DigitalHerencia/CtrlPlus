import { AdminAuditPageFeature } from '@/features/admin/admin-audit-page-feature'

interface AdminAuditPageProps {
    searchParams: Promise<{ eventType?: string | string[]; resourceType?: string | string[] }>
}

function getSingleSearchParam(param: string | string[] | undefined): string | null {
    if (!param) return null
    return Array.isArray(param) ? (param[0] ?? null) : param
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
