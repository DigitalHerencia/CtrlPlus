'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils/cn'

interface PlatformRouteTab {
    href: string
    label: string
}

interface PlatformRouteTabsProps {
    tabs: PlatformRouteTab[]
}

export function PlatformRouteTabs({ tabs }: PlatformRouteTabsProps) {
    const currentPathname = usePathname()

    return (
        <nav aria-label="Platform sections" className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
                const isActive = currentPathname === tab.href

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            'border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition',
                            isActive
                                ? 'border-neutral-500 bg-neutral-800 text-neutral-100'
                                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                        )}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </nav>
    )
}
