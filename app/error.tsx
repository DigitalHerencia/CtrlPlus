'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <Card className="w-full max-w-2xl border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-black">Something went wrong</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-neutral-300">
                        An unexpected error occurred. You can retry or return to the home
                        page.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button type="button" onClick={unstable_retry}>
                            Try Again
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/">Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
