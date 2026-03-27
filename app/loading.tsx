import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default function Loading() {
    return (
        <>
            <SiteHeader />
            <div className="mx-auto max-w-7xl p-8">
                <div className="animate-pulse">
                    <div className="mb-6 h-8 w-64 rounded bg-neutral-800" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-40 rounded bg-neutral-900/70" />
                        ))}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}
