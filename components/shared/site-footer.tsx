'use client'


import Link from 'next/link'

import { Separator } from '@/components/ui/separator'


export function SiteFooter() {
    return (
        <footer className="bg-neutral-950/80">
            <Separator className="bg-neutral-700" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <p className="text-xs text-neutral-300 sm:text-sm">
                    © 2026 CTRL+ All rights reserved.
                </p>
                <div className="flex flex-col gap-3 text-xs text-neutral-400 sm:flex-row sm:gap-6 sm:text-sm">
                    <Link
                        href="/docs"
                        className="transition-colors duration-300 hover:text-blue-600"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="/docs/quick-start"
                        className="transition-colors duration-300 hover:text-blue-600"
                    >
                        Quick Start
                    </Link>
                    <Link
                        href="/docs/troubleshooting"
                        className="transition-colors duration-300 hover:text-blue-600"
                    >
                        Troubleshooting
                    </Link>
                </div>
            </div>
        </footer>
    )
}
