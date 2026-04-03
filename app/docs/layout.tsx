import type { Metadata } from 'next'

import { SiteFooter } from '@/components/shared/site-footer'
import { SiteHeader } from '@/components/shared/site-header'

export const metadata: Metadata = {
    title: 'Documentation | CTRL+',
    description:
        'Official CTRL+ documentation for quick start, onboarding, and feature walkthroughs.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-neutral-900 text-neutral-100">{children}</div>
            <SiteFooter />
        </>
    )
}
