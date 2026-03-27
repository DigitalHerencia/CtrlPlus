'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({ error, unstable_retry }: { error: Error; unstable_retry: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <Card className="w-full max-w-2xl border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-black">Catalog failed to load</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-neutral-300">
                        There was a problem loading the catalog. Retry to reload the
                        segment.
                    </p>
                    <Button type="button" onClick={unstable_retry}>
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
