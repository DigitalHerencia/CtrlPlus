'use client'

import { useState } from 'react'

import { BookingNotificationPanel } from '@/components/scheduling/manage/booking-notification-panel'

export function BookingNotificationControlsClient() {
    const [enabled, setEnabled] = useState(true)

    return <BookingNotificationPanel enabled={enabled} onToggle={setEnabled} />
}
