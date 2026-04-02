'use client'

import { NotificationPreferencesFields } from '@/components/settings/user-settings/notification-preferences-fields'

interface NotificationSettingsFormClientProps {
    email: boolean
    sms: boolean
    push: boolean
    onEmailChange: (value: boolean) => void
    onSmsChange: (value: boolean) => void
    onPushChange: (value: boolean) => void
}

export function NotificationSettingsFormClient(props: NotificationSettingsFormClientProps) {
    return <NotificationPreferencesFields {...props} />
}
