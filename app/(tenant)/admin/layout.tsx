import { getSession } from '@/lib/auth/session'
import { requireOwnerOrAdmin } from '@/lib/authz/policy'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { type ReactNode } from 'react'

interface AdminLayoutProps {
    children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await getSession()

    if (!session.isAuthenticated || !session.userId) {
        redirect('/sign-in')
    }

    try {
        requireOwnerOrAdmin(session.authz)
    } catch {
        redirect('/catalog')
    }

    return (
        <div className="space-y-4">
            <nav className="flex flex-wrap items-center gap-2 rounded border border-neutral-800 bg-neutral-950/70 p-2">
                <Link
                    href="/admin"
                    className="rounded border border-neutral-800 px-3 py-1 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Dashboard
                </Link>
                <Link
                    href="/admin/analytics"
                    className="rounded border border-neutral-800 px-3 py-1 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Analytics
                </Link>
                <Link
                    href="/admin/audit"
                    className="rounded border border-neutral-800 px-3 py-1 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Audit
                </Link>
                <Link
                    href="/admin/moderation"
                    className="rounded border border-neutral-800 px-3 py-1 text-sm text-neutral-200 hover:border-blue-700"
                >
                    Moderation
                </Link>
            </nav>

            {children}
        </div>
    )
}
