"use client"

import { useEffect } from "react"

interface BillingErrorProps {
  error: Error
  reset: () => void
}

export default function BillingError({ error, reset }: BillingErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Billing error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-md rounded-md border border-neutral-800 bg-neutral-950/60 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Billing error</h1>
        <p className="mb-4 text-sm text-neutral-300">We couldn't load billing information.</p>

        <div className="flex justify-center gap-3">
          <button onClick={() => reset()} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Try again
          </button>
          <a href="/catalog" className="inline-flex items-center rounded border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900">
            Browse catalog
          </a>
        </div>
      </div>
    </div>
  )
}
