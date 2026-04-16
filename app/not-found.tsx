import Link from 'next/link'

import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'

export default function NotFound() {
    return (
        <>
            <SiteHeader />
            <div className="mx-auto max-w-4xl py-32 text-center">
                <h1 className="mb-4 text-4xl font-black text-neutral-100">Wrap Not Found</h1>
                <p className="mb-6 text-neutral-300">
                    That design slipped through the cracks. Head back to our wrap gallery or home to
                    find your perfect match.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link href="/catalog" className="rounded bg-blue-600 px-4 py-2 text-white">
                        Explore WrapGallery™
                    </Link>
                    <Link
                        href="/"
                        className="rounded border border-neutral-700 px-4 py-2 text-neutral-100"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}
