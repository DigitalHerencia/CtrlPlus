/**
 * @introduction Components — TODO: short one-line summary of docs-toc.tsx
 *
 * @description TODO: longer description for docs-toc.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { DocHeading } from '@/docs/types'

type DocsTocProps = {
    headings: DocHeading[]
}

/**
 * DocsToc — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function DocsToc({ headings }: DocsTocProps) {
    if (!headings.length) {
        return null
    }

    return (
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-64 overflow-y-auto border-l border-neutral-700 pl-6 xl:block">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300">
                On This Page
            </h2>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className="text-sm text-neutral-400 transition-colors hover:text-blue-600"
                        >
                            {heading.title}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
