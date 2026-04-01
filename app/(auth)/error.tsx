'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface AuthErrorProps {
    error: Error
    reset: () => void
}

export default function AuthError({ error, reset }: AuthErrorProps) {
    useEffect(() => {
        // surface to server logs during development

        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-6 text-neutral-100">
            <div className="max-w-md rounded-md border border-neutral-800 bg-neutral-950/60 p-6 text-center">
                <h1 className="mb-2 text-2xl font-semibold">Authentication error</h1>
                <p className="mb-4 text-sm text-neutral-300">
                    Something went wrong while loading the authentication flow. You can try again or
                    return to the home page.
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center rounded border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
