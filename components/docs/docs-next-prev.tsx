
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { getDocsRoute } from '@/docs/content'
import type { DocNavItem } from '@/docs/types'

type DocsNextPrevProps = {
    previous: DocNavItem | null
    next: DocNavItem | null
}


export function DocsNextPrev({ previous, next }: DocsNextPrevProps) {
    if (!previous && !next) {
        return null
    }

    return (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {previous ? (
                <Link href={getDocsRoute(previous.slug)}>
                    <Card className="border-neutral-700 bg-neutral-900 hover:border-blue-600/60">
                        <CardContent className="p-4">
                            <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-400">
                                <ArrowLeft className="h-3 w-3" />
                                Previous
                            </p>
                            <p className="font-medium text-neutral-100">{previous.title}</p>
                        </CardContent>
                    </Card>
                </Link>
            ) : (
                <div />
            )}

            {next ? (
                <Link href={getDocsRoute(next.slug)}>
                    <Card className="border-neutral-700 bg-neutral-900 hover:border-blue-600/60">
                        <CardContent className="p-4 text-right">
                            <p className="mb-1 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.18em] text-neutral-400">
                                Next
                                <ArrowRight className="h-3 w-3" />
                            </p>
                            <p className="font-medium text-neutral-100">{next.title}</p>
                        </CardContent>
                    </Card>
                </Link>
            ) : null}
        </div>
    )
}
