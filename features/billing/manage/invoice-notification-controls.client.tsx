'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function InvoiceNotificationControlsClient() {
    const [message, setMessage] = useState('')

    return (
        <div className="space-y-3">
            <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Optional customer note"
            />
            <Button type="button" variant="outline" disabled>
                Send Notification (coming soon)
            </Button>
        </div>
    )
}
