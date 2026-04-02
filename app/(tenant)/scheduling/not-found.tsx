import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SchedulingNotFound() {
    return (
        <div className="flex min-h-[55vh] items-center justify-center p-6">
            <Card className="w-full max-w-xl border-neutral-800 bg-neutral-950/90 text-neutral-100">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Booking not found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-neutral-300">
                    <p>
                        The scheduling resource you requested is unavailable or you do not have
                        access.
                    </p>
                    <Button asChild>
                        <Link href="/scheduling">Back to Scheduling</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
