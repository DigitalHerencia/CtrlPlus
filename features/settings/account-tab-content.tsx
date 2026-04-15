'use client'


import Link from 'next/link'
import { Button } from '@/components/ui/button'


export function AccountTabContent() {
    return (
        <div className="space-y-6">
            <section className="border border-neutral-700 bg-neutral-950/80 px-6 py-6">
                <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100">
                        Account Management
                    </p>

                    <p className="text-sm text-neutral-400">
                        Your account is managed by Clerk, our authentication provider. To update
                        your account details, email address, or password, visit your account
                        dashboard.
                    </p>

                    <div className="border border-neutral-700 bg-neutral-900 p-4">
                        <h4 className="mb-2 text-sm font-medium text-neutral-100">
                            Saved Payment Method
                        </h4>
                        <p className="text-sm text-neutral-400">
                            Your default Stripe payment method will appear here after you complete
                            your first invoice checkout. We never store full card details—only the
                            last 4 digits.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                            <Link href="https://accounts.clerk.com" target="_blank">
                                Go to Clerk Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
