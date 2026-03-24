import AdminPageFeature from '@/features/admin/admin-page-feature'

export default async function AdminDashboardPage() {
    // Keep this route thin: delegate orchestration to the server feature
    return <AdminPageFeature />
}
