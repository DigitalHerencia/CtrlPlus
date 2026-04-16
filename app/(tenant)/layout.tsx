import { TenantSidebar } from '@/components/shared/tenant-sidebar'
import { getSession } from '@/lib/auth/session'
import { hasCapability } from '@/lib/authz/policy'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'

export default async function TenantLayout({ children }: { children: ReactNode }) {
    const session = await getSession()
    if (!session.isAuthenticated) {
        redirect('/sign-in')
    }

    const canAccessOwnerDashboard = hasCapability(session.authz, 'dashboard.owner')
    const canAccessAdminConsole = hasCapability(session.authz, 'dashboard.platform')

    const needsSettingsOnboarding = Boolean(
        session.userId &&
        !(await prisma.websiteSettings.findFirst({
            where: {
                clerkUserId: session.userId,
                deletedAt: null,
            },
            select: {
                id: true,
            },
        }))
    )

    return (
        <TenantSidebar
            canAccessAdminConsole={canAccessAdminConsole}
            canAccessOwnerDashboard={canAccessOwnerDashboard}
            needsSettingsOnboarding={needsSettingsOnboarding}
        >
            {children}
        </TenantSidebar>
    )
}
