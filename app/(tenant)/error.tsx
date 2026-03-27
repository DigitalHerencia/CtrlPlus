"use client"

import { useEffect } from "react"

interface TenantErrorProps {
  error: Error
  reset: () => void
}

export default function TenantError({ error, reset }: TenantErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Tenant error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-2xl rounded-md border border-neutral-800 bg-neutral-950/60 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
        <p className="mb-4 text-sm text-neutral-300">An unexpected error occurred while loading the tenant area.</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try again
          </button>

          <a href="/" className="inline-flex items-center rounded border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900">
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
