import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DocsBreadcrumbs } from '@/components/docs/docs-breadcrumbs'
import { DocsMobileNav } from '@/components/docs/docs-mobile-nav'
import { DocsNextPrev } from '@/components/docs/docs-next-prev'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { DocsToc } from '@/components/docs/docs-toc'
import { DOC_SECTIONS, getAdjacentDocs, getDocBySegments, getDocsRoute } from '@/docs/content'

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

    // Landing page: empty slug
    if (!slug.length) {
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="mb-10 max-w-3xl space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                        CTRL+ Docs
                    </p>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-neutral-100 sm:text-5xl">
                        End-to-End Platform Walkthroughs
                    </h1>
                    <p className="text-base text-neutral-300 sm:text-lg">
                        Learn CTRL+ with a production-ready documentation experience designed for
                        fast onboarding, clear operations, and feature-level mastery.
                    </p>
                </div>

                <section className="mb-8 grid gap-4 md:grid-cols-3">
                    <Link href="/docs/quick-start">
                        <Card className="h-full border-blue-600/40 bg-neutral-900 hover:border-blue-600">
                            <CardHeader>
                                <CardTitle className="text-neutral-100">Quick Start</CardTitle>
                                <CardDescription className="text-neutral-300">
                                    Complete your first flow in minutes.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/docs/account/create-account">
                        <Card className="h-full border-neutral-700 bg-neutral-900 hover:border-blue-600/60">
                            <CardHeader>
                                <CardTitle className="text-neutral-100">
                                    Create an Account
                                </CardTitle>
                                <CardDescription className="text-neutral-300">
                                    Set up identity and verification securely.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/docs/onboarding/walkthrough">
                        <Card className="h-full border-neutral-700 bg-neutral-900 hover:border-blue-600/60">
                            <CardHeader>
                                <CardTitle className="text-neutral-100">
                                    Onboarding Walkthrough
                                </CardTitle>
                                <CardDescription className="text-neutral-300">
                                    Guided first-day operational setup.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {DOC_SECTIONS.map((section) => (
                        <Card key={section.id} className="border-neutral-700 bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-neutral-100">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {section.items.map((item) => (
                                        <li key={item.slug}>
                                            <Link
                                                href={getDocsRoute(item.slug)}
                                                className="group block space-y-1"
                                            >
                                                <p className="font-medium text-neutral-100 transition-colors group-hover:text-blue-600">
                                                    {item.title}
                                                </p>
                                                <p className="text-sm text-neutral-400">
                                                    {item.description}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // Article pages: populated slug
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
