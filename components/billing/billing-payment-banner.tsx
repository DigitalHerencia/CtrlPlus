import { Card, CardContent } from '@/components/ui/card'

interface BillingPaymentBannerProps {
    variant: 'success' | 'cancelled'
}

export function BillingPaymentBanner({ variant }: BillingPaymentBannerProps) {
    if (variant === 'success') {
        return (
            <Card className="border-blue-600 bg-neutral-900">
                <CardContent className="py-4 text-center text-sm font-medium text-neutral-100">
                    Payment received. The invoice has been updated from the latest Stripe result.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-neutral-700 bg-neutral-900">
            <CardContent className="py-4 text-center text-sm font-medium text-neutral-100">
                Checkout was cancelled. You can retry payment whenever you are ready.
            </CardContent>
        </Card>
    )
}
