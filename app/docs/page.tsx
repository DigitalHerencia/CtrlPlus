import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DOC_SECTIONS, getDocsRoute } from '@/docs/content'

export default function DocsHomePage() {
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
                    Learn CTRL+ with a production-ready documentation experience designed for fast
                    onboarding, clear operations, and feature-level mastery.
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
                            <CardTitle className="text-neutral-100">Create an Account</CardTitle>
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
