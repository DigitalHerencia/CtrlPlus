import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EditManagedBookingPageViewProps {
    bookingForm: ReactNode
    lifecycleActions: ReactNode
}

export function EditManagedBookingPageView({
    bookingForm,
    lifecycleActions,
}: EditManagedBookingPageViewProps) {
    return (
        <div className="space-y-4">
            {bookingForm}

            <Card className="border-neutral-800 bg-neutral-950/80">
                <CardHeader>
                    <CardTitle>Lifecycle Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">{lifecycleActions}</CardContent>
            </Card>
        </div>
    )
}
