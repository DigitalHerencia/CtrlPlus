import Link from 'next/link'

import { DOC_SECTIONS, getDocsRoute } from '@/docs/content'
import { cn } from '@/lib/utils/cn'

type DocsSidebarProps = {
    currentSlug?: string
}

export function DocsSidebar({ currentSlug }: DocsSidebarProps) {
    return (
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-72 overflow-y-auto border-r border-neutral-700 pr-6 lg:block">
            <div className="space-y-8 pb-12">
                {DOC_SECTIONS.map((section) => (
                    <section key={section.id} className="space-y-2">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-100">
                            {section.title}
                        </h2>
                        <ul className="space-y-1.5">
                            {section.items.map((item) => {
                                const isActive = currentSlug === item.slug
                                return (
                                    <li key={item.slug}>
                                        <Link
                                            href={getDocsRoute(item.slug)}
                                            className={cn(
                                                'block border-l-2 px-3 py-2 text-sm transition-colors',
                                                isActive
                                                    ? 'border-blue-600 bg-blue-600/10 font-medium text-blue-600'
                                                    : 'border-transparent text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-100'
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
        </aside>
    )
}
