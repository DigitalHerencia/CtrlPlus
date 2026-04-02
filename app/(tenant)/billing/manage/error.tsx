'use client'

import { useEffect } from 'react'

interface InvoiceManageErrorProps {
    error: Error
    reset: () => void
}

export default function InvoiceManageError({ error, reset }: InvoiceManageErrorProps) {
    useEffect(() => {
        console.error('Invoice manager error:', error)
    }, [error])

    return (
        <div className="mx-auto max-w-xl space-y-4 rounded-md border border-neutral-800 bg-neutral-950/50 p-6">
            <h1 className="text-xl font-semibold text-neutral-100">Invoice manager error</h1>
            <p className="text-sm text-neutral-400">Unable to load invoice manager data.</p>
            <button
                onClick={reset}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
                Try again
            </button>
        </div>
    )
}
