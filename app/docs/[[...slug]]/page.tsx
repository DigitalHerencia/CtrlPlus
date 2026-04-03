import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { DocsBreadcrumbs } from '@/components/docs/docs-breadcrumbs'
import { DocsMobileNav } from '@/components/docs/docs-mobile-nav'
import { DocsNextPrev } from '@/components/docs/docs-next-prev'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { DocsToc } from '@/components/docs/docs-toc'
import { getAdjacentDocs, getDocBySegments } from '@/docs/content'

type DocsCatchAllPageProps = {
    params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: DocsCatchAllPageProps): Promise<Metadata> {
    const { slug = [] } = await params

    if (!slug.length) {
        return {
            title: 'Documentation | CTRL+',
            description: 'Official CTRL+ product documentation.',
        }
    }

    const page = getDocBySegments(slug)

    if (!page) {
        return {
            title: 'Not Found | CTRL+ Docs',
            description: 'The requested documentation page does not exist.',
        }
    }

    return {
        title: `${page.title} | CTRL+ Docs`,
        description: page.description,
    }
}

export default async function DocsCatchAllPage({ params }: DocsCatchAllPageProps) {
    const { slug = [] } = await params

    if (!slug.length) {
        redirect('/docs')
    }

    const page = getDocBySegments(slug)

    if (!page) {
        notFound()
    }

    const { previous, next } = getAdjacentDocs(page.slug)

    return (
        <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <DocsSidebar currentSlug={page.slug} />

            <article className="min-w-0 flex-1">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <DocsBreadcrumbs title={page.title} />
                    <DocsMobileNav currentSlug={page.slug} />
                </div>

                <header className="mb-8 border-b border-neutral-700 pb-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        CTRL+ Documentation
                    </p>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-100 sm:text-4xl">
                        {page.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-neutral-300">{page.description}</p>
                    <p className="mt-3 text-sm text-neutral-400">
                        Updated {page.updatedAt} · {page.readTime} read
                    </p>
                </header>

                <div className="prose prose-invert prose-headings:scroll-mt-28 prose-a:text-blue-600 prose-strong:text-neutral-100 max-w-none">
                    {page.content}
                </div>

                <DocsNextPrev previous={previous} next={next} />
            </article>

            <DocsToc headings={page.headings} />
        </div>
    )
}
