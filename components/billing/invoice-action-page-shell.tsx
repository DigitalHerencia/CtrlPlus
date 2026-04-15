import Link from 'next/link'
import { type ReactNode } from 'react'

import { WorkspacePageContextCard, WorkspacePageIntro } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'

interface InvoiceActionPageShellProps {
    title: string
    description: string
    backHref: string
    backLabel: string
    navTitle: string
    navDescription: string
    children: ReactNode
}

export function InvoiceActionPageShell({
    title,
    description,
    backHref,
    backLabel,
    navTitle,
    navDescription,
    children,
}: InvoiceActionPageShellProps) {
    return (
        <div className="space-y-6">
            <WorkspacePageIntro label="Billing" title={title} description={description} />
            <WorkspacePageContextCard title={navTitle} description={navDescription}>
                <Button asChild variant="outline">
                    <Link href={backHref}>{backLabel}</Link>
                </Button>
            </WorkspacePageContextCard>
            {children}
        </div>
    )
}
