import Link from 'next/link'
import type { ReactNode } from 'react'

import { CatalogManagerHeader } from '@/components/catalog/manage/catalog-manager-header'
import { WorkspacePageContextCard } from '@/components/shared/tenant-elements'
import { Button } from '@/components/ui/button'

interface WrapManagerDetailPageViewProps {
    wrapName: string
    children: ReactNode
}

export function WrapManagerDetailPageView({ wrapName, children }: WrapManagerDetailPageViewProps) {
    return (
        <div className="space-y-6">
            <CatalogManagerHeader
                title={`Refine ${wrapName}`}
                description="Keep this wrap listing polished with consistent visuals, pricing clarity, and preview-ready assets."
            />
            <WorkspacePageContextCard
                title="Manager Navigation"
                description="Return to inventory or continue editing this listing"
            >
                <Button variant="outline" asChild>
                    <Link href="/catalog/manage">Back to Manager</Link>
                </Button>
            </WorkspacePageContextCard>

            {children}
        </div>
    )
}
