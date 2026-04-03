'use client'

import Link from 'next/link'

import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
    return (
        <footer className="bg-neutral-900">
            <Separator className="bg-neutral-700" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p className="text-sm text-neutral-100">© 2026 CTRL+ All rights reserved.</p>
                <div className="flex items-center gap-4 text-sm text-neutral-300">
                    <Link href="/docs" className="hover:text-blue-600">
                        Documentation
                    </Link>
                    <Link href="/docs/quick-start" className="hover:text-blue-600">
                        Quick Start
                    </Link>
                    <Link href="/docs/troubleshooting" className="hover:text-blue-600">
                        Troubleshooting
                    </Link>
                </div>
            </div>
        </footer>
    )
}
