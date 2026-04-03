'use client'

import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { NotificationPreferencesFields } from '@/components/settings/user-settings/notification-preferences-fields'
import { PreferencesFields } from '@/components/settings/user-settings/preferences-fields'
import { SettingsFormActions } from '@/components/settings/user-settings/settings-form-actions'
import { UserSettingsFormFields } from '@/components/settings/user-settings/user-settings-form-fields'
import { UserSettingsFormShell } from '@/components/settings/user-settings/user-settings-form-shell'
import { type UserSettingsViewDTO } from '@/types/settings.types'

interface UserSettingsFormClientProps {
    initialSettings: UserSettingsViewDTO
    onSave: (input: {
        theme: 'light' | 'dark' | 'system'
        language: string | null
        timezone: string | null
        notifications: { email: boolean; sms: boolean; push: boolean }
        preferredContact: 'email' | 'sms'
        appointmentReminders: boolean
        marketingOptIn: boolean
    }) => Promise<unknown>
}

type FormValues = {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    email: boolean
    sms: boolean
    push: boolean
}

export function UserSettingsFormClient({ initialSettings, onSave }: UserSettingsFormClientProps) {
    const [serverMessage, setServerMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormValues>({
        defaultValues: {
            theme: initialSettings.theme ?? 'system',
            language: initialSettings.language ?? 'en-US',
            timezone: initialSettings.timezone ?? 'America/Denver',
            email: initialSettings.notifications.email,
            sms: initialSettings.notifications.sms,
            push: initialSettings.notifications.push,
        },
    })

    const theme = useWatch({ control: form.control, name: 'theme' })
    const language = useWatch({ control: form.control, name: 'language' })
    const timezone = useWatch({ control: form.control, name: 'timezone' })
    const email = useWatch({ control: form.control, name: 'email' })
    const sms = useWatch({ control: form.control, name: 'sms' })
    const push = useWatch({ control: form.control, name: 'push' })

    async function onSubmit(values: FormValues) {
        setServerMessage(null)
        startTransition(async () => {
            try {
                await onSave({
                    theme: values.theme,
                    language: values.language,
                    timezone: values.timezone,
                    notifications: {
                        email: values.email,
                        sms: values.sms,
                        push: values.push,
                    },
                    preferredContact: values.sms ? 'sms' : 'email',
                    appointmentReminders: values.email,
                    marketingOptIn: values.push,
                })
                setServerMessage('Settings saved successfully.')
            } catch (error) {
                setServerMessage(
                    error instanceof Error ? error.message : 'Unable to save settings.'
                )
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserSettingsFormShell>
                <PreferencesFields
                    theme={theme}
                    onThemeChange={(value) => form.setValue('theme', value, { shouldDirty: true })}
                />
                <UserSettingsFormFields
                    language={language}
                    timezone={timezone}
                    onLanguageChange={(value) =>
                        form.setValue('language', value, { shouldDirty: true })
                    }
                    onTimezoneChange={(value) =>
                        form.setValue('timezone', value, { shouldDirty: true })
                    }
                />
                <NotificationPreferencesFields
                    email={email}
                    sms={sms}
                    push={push}
                    onEmailChange={(value) => form.setValue('email', value, { shouldDirty: true })}
                    onSmsChange={(value) => form.setValue('sms', value, { shouldDirty: true })}
                    onPushChange={(value) => form.setValue('push', value, { shouldDirty: true })}
                />
                {serverMessage ? <p className="text-sm text-neutral-300">{serverMessage}</p> : null}
                <SettingsFormActions isPending={isPending} />
            </UserSettingsFormShell>
        </form>
    )
}
