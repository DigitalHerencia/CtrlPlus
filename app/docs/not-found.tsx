import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function DocsNotFoundPage() {
    return (
        <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                CTRL+ Docs
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-100 sm:text-4xl">
                Documentation Page Not Found
            </h1>
            <p className="max-w-2xl text-neutral-300">
                The documentation page you requested does not exist or may have moved. Start from
                the docs home page to continue.
            </p>
            <Button asChild className="bg-blue-600 text-neutral-100 hover:bg-blue-700">
                <Link href="/docs">Go to Docs Home</Link>
            </Button>
        </div>
    )
}
