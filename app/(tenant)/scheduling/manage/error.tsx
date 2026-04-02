'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SchedulingManageError({
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
        <div className="flex min-h-[55vh] items-center justify-center p-6">
            <Card className="w-full max-w-xl border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Scheduling manager unavailable
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-neutral-300">
                    <p>We could not load booking operations. Retry this segment.</p>
                    <Button type="button" onClick={unstable_retry}>
                        Retry
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
