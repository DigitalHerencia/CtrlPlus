import Link from 'next/link'

export default function BillingNotFound() {
    return (
        <div className="mx-auto max-w-3xl py-28 text-center">
            <h1 className="mb-4 text-3xl font-black text-neutral-100">Invoice not found</h1>
            <p className="mb-6 text-neutral-300">
                We couldn't find the invoice you were looking for. It may no longer be
                available.
            </p>
            <div className="flex items-center justify-center gap-3">
                <Link href="/billing" className="rounded bg-blue-600 px-4 py-2 text-white">
                    Billing Home
                </Link>
                <Link href="/" className="rounded border border-neutral-700 px-4 py-2 text-neutral-100">
                    Home
                </Link>
            </div>
        </div>
    )
}
