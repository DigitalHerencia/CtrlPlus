import { WorkspacePageIntro } from '@/components/shared/tenant-elements'
import AdminMetrics from '@/components/admin/admin-metrics'
import AdminManagementTools from '@/components/admin/admin-management-tools'
import {
    getAdminManagementToolExamples,
    getOwnerDashboardStats,
} from '@/lib/fetchers/admin.fetchers'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { confirmAppointment, createInvoice } from '@/lib/actions/admin.actions'

export default async function AdminPageFeature() {
    const session = await getSession()
    if (!session.isAuthenticated || !session.userId) return null

    let stats: Awaited<ReturnType<typeof getOwnerDashboardStats>> | null = null
    let managementToolExamples: Awaited<ReturnType<typeof getAdminManagementToolExamples>> = {
        confirmAppointmentExample: null,
        createInvoiceExample: null,
    }
    let error: string | null = null

    try {
        ;[stats, managementToolExamples] = await Promise.all([
            getOwnerDashboardStats(),
            getAdminManagementToolExamples(),
        ])
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to load stats.'
    }

    const formattedRevenue = stats
        ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
          }).format(stats.totalRevenue / 100)
        : '$0.00'

    // capability flags - computed server-side and passed to UI (no client-only gating)
    const capabilityFlags = {
        canManageCatalog: hasCapability(session.authz, 'catalog.manage'),
        canManageScheduling: hasCapability(session.authz, 'scheduling.write.all'),
        canManageBilling: hasCapability(session.authz, 'billing.write.all'),
    }

    async function confirmExampleAppointmentAction() {
        'use server'

        if (!managementToolExamples.confirmAppointmentExample) return

        await confirmAppointment(managementToolExamples.confirmAppointmentExample)
    }

    async function createExampleInvoiceAction() {
        'use server'

        if (!managementToolExamples.createInvoiceExample) return

        await createInvoice(managementToolExamples.createInvoiceExample)
    }

    return (
        <div className="space-y-6">
            <WorkspacePageIntro
                label="Operations Dashboard"
                title="Store Management"
                description="Manage the catalog, scheduling flow, and customer billing from one place."
            />

            {/* Loading/Error/Empty States */}
            {!stats && !error && (
                <div className="py-12 text-center text-neutral-400">
                    Loading dashboard metrics...
                </div>
            )}
            {error && (
                <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                    {error}
                </div>
            )}

            {stats && <AdminMetrics stats={stats} formattedRevenue={formattedRevenue} />}

            <AdminManagementTools
                capabilityFlags={capabilityFlags}
                confirmAppointmentAction={confirmExampleAppointmentAction}
                canConfirmAppointment={managementToolExamples.confirmAppointmentExample !== null}
                createInvoiceAction={createExampleInvoiceAction}
                canCreateInvoice={managementToolExamples.createInvoiceExample !== null}
            />
        </div>
    )
}
