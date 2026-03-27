import Link from 'next/link'

import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default function NotFound() {
    return (
        <>
            <SiteHeader />
            <div className="mx-auto max-w-4xl py-32 text-center">
                <h1 className="mb-4 text-4xl font-black text-neutral-100">Page not found</h1>
                <p className="mb-6 text-neutral-300">
                    The page you were looking for does not exist. Try going back to the
                    catalog or home.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link href="/catalog" className="rounded bg-blue-600 px-4 py-2 text-white">
                        Browse Catalog
                    </Link>
                    <Link href="/" className="rounded border border-neutral-700 px-4 py-2 text-neutral-100">
                        Home
                    </Link>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}
