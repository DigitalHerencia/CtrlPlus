'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

/**
 * DocsTabContent — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function DocsTabContent() {
    const docLinks = [
        {
            title: 'Getting Started',
            description: 'Learn the basics of using CtrlPlus for wrap operations',
            href: '/docs/getting-started',
        },
        {
            title: 'Account & Settings',
            description: 'Manage your profile, notifications, and preferences',
            href: '/docs/account-settings',
        },
        {
            title: 'Wrap Catalog',
            description: 'Browse and manage your vehicle wrap designs',
            href: '/docs/wrap-catalog',
        },
        {
            title: 'Scheduling',
            description: 'Book and manage wrap installation appointments',
            href: '/docs/scheduling',
        },
        {
            title: 'Billing',
            description: 'Understand invoices, payments, and pricing',
            href: '/docs/billing',
        },
        {
            title: 'API & Integrations',
            description: 'Connect CtrlPlus to your external systems',
            href: '/docs/api',
        },
    ]

    return (
        <div className="max-w-3xl space-y-6">
            <Card className="border-neutral-800 bg-neutral-900/50">
                <CardHeader>
                    <CardTitle className="text-base">Documentation & Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-400">
                        Browse our comprehensive documentation to learn how to use CtrlPlus
                        features, troubleshoot issues, and optimize your wrap operations.
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                        {docLinks.map((doc) => (
                            <Link
                                key={doc.href}
                                href={doc.href}
                                className="group rounded-lg border border-neutral-800 bg-neutral-950/50 p-4 transition-colors hover:border-blue-600/50 hover:bg-neutral-900/80"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-neutral-100 group-hover:text-blue-400">
                                            {doc.title}
                                        </h4>
                                        <p className="mt-1 text-xs text-neutral-500">
                                            {doc.description}
                                        </p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 shrink-0 text-neutral-600 group-hover:text-blue-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-800 bg-neutral-900/50">
                <CardHeader>
                    <CardTitle className="text-base">Need More Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-400">
                        Can&apos;t find what you&apos;re looking for? Reach out to our support team.
                    </p>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <a href="mailto:support@ctrlplus.com">Contact Support</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
