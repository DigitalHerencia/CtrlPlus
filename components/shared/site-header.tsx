'use client'

import Link from 'next/link'

import { LogoMark } from '@/components/shared/logo-mark'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-30 border-b border-neutral-700 bg-neutral-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
                    >
                        <LogoMark />
                    </Link>
                    <p className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-neutral-100 sm:inline-block sm:text-sm">
                        Tint | Wraps | Signage
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <Button
                        asChild
                        className="bg-blue-600 text-xs font-semibold text-neutral-100 transition-all duration-300 hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 sm:text-sm"
                    >
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-blue-600 text-xs font-semibold text-neutral-100 transition-all duration-300 hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600 sm:text-sm"
                    >
                        <Link href="/sign-up">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
