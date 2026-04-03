'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { DOC_SECTIONS, getDocsRoute } from '@/docs/content'
import { cn } from '@/lib/utils/cn'

type DocsMobileNavProps = {
    currentSlug?: string
}

export function DocsMobileNav({ currentSlug }: DocsMobileNavProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="border-neutral-700 text-neutral-100 lg:hidden">
                    <Menu className="mr-2 h-4 w-4" />
                    Browse Docs
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="border-neutral-700 bg-neutral-900 text-neutral-100"
            >
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="text-neutral-100">CTRL+ Docs</SheetTitle>
                    <SheetDescription className="text-neutral-300">
                        Jump to any guide in the documentation suite.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {DOC_SECTIONS.map((section) => (
                        <section key={section.id} className="space-y-2">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                                {section.title}
                            </h2>
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = currentSlug === item.slug
                                    return (
                                        <li key={item.slug}>
                                            <Link
                                                href={getDocsRoute(item.slug)}
                                                className={cn(
                                                    'block border-l-2 px-3 py-2 text-sm',
                                                    isActive
                                                        ? 'border-blue-600 bg-blue-600/10 font-medium text-blue-600'
                                                        : 'border-transparent text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800'
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
