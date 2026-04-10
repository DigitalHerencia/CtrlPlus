import type { Metadata } from 'next'

import { DocsHeader } from '@/components/shared/docs-header'
import { SiteFooter } from '@/components/shared/site-footer'

export const metadata: Metadata = {
    title: 'Documentation | CTRL+',
    description:
        'Official CTRL+ documentation for quick start, onboarding, and feature walkthroughs.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DocsHeader />
            <div className="min-h-screen bg-neutral-900 text-neutral-100">{children}</div>
            <SiteFooter />
        </>
    )
}
