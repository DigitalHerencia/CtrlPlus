import { PlatformRouteTabs } from '@/components/platform/platform-route-tabs'
import { getSession } from '@/lib/auth/session'
import { requirePlatformAdmin } from '@/lib/authz/policy'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'

interface PlatformLayoutProps {
    children: ReactNode
}

export default async function PlatformLayout({ children }: PlatformLayoutProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    try {
        requirePlatformAdmin(session.authz)
    } catch {
        redirect('/catalog')
    }

    return (
        <div className="space-y-5">
            <PlatformRouteTabs
                tabs={[
                    { href: '/platform', label: 'Dashboard' },
                    { href: '/platform/health', label: 'Health' },
                    { href: '/platform/webhooks', label: 'Webhooks' },
                    { href: '/platform/jobs', label: 'Jobs' },
                    { href: '/platform/db', label: 'DB' },
                    { href: '/platform/visualizer', label: 'Visualizer' },
                ]}
            />
            {children}
        </div>
    )
}
