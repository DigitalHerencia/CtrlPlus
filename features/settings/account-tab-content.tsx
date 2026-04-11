'use client'
/**
 * Features — TODO: brief module description.
 * Domain: features
 * Public: TODO (yes/no)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * AccountTabContent — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function AccountTabContent() {
    return (
        <div className="max-w-3xl space-y-6">
            <Card className="border-neutral-800 bg-neutral-900/50">
                <CardHeader>
                    <CardTitle className="text-base">Account Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-400">
                        Your account is managed by Clerk, our authentication provider. To update
                        your account details, email address, or password, visit your account
                        dashboard.
                    </p>

                    <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
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
                </CardContent>
            </Card>
        </div>
    )
}
