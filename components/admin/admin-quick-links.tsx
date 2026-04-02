import Link from 'next/link'
import type { AdminQuickLinkDTO } from '@/types/admin.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminQuickLinksProps {
    links: AdminQuickLinkDTO[]
}

export function AdminQuickLinks({ links }: AdminQuickLinksProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-950/80 text-neutral-100">
            <CardHeader>
                <CardTitle>Quick links</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="rounded border border-neutral-800 p-3 transition-colors hover:border-blue-700"
                    >
                        <p className="text-sm font-semibold text-neutral-100">{link.label}</p>
                        {link.description ? (
                            <p className="mt-1 text-xs text-neutral-400">{link.description}</p>
                        ) : null}
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
