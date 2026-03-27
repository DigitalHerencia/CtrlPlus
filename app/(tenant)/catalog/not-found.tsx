import Link from 'next/link'

export default function CatalogNotFound() {
    return (
        <div className="mx-auto max-w-3xl py-28 text-center">
            <h1 className="mb-4 text-3xl font-black text-neutral-100">Wrap not found</h1>
            <p className="mb-6 text-neutral-300">
                The requested wrap could not be located. It may have been removed or
                is not visible to your account.
            </p>
            <div className="flex items-center justify-center gap-3">
                <Link href="/catalog" className="rounded bg-blue-600 px-4 py-2 text-white">
                    Back to Catalog
                </Link>
                <Link href="/" className="rounded border border-neutral-700 px-4 py-2 text-neutral-100">
                    Home
                </Link>
            </div>
        </div>
    )
}
