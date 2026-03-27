'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ZodError } from 'zod'

import { WebsiteSettingsForm } from '@/components/settings/website-settings-form'
import { applyZodErrors } from '@/lib/forms/apply-zod-errors'
import { zodResolver } from '@/lib/forms/zod-resolver'
import { updateUserWebsiteSettings } from '@/lib/settings/actions/update-user-website-settings'
import { websiteSettingsSchema } from '@/schema/settings'
import {
    type WebsiteSettingsDTO,
    type WebsiteSettingsInput,
} from '@/lib/settings/types'

interface WebsiteSettingsFormClientProps {
    initialSettings: WebsiteSettingsDTO
}

function toFormValues(settings: WebsiteSettingsDTO): WebsiteSettingsInput {
    return {
        timezone: settings.timezone,
        preferredContact: settings.preferredContact,
        appointmentReminders: settings.appointmentReminders,
        marketingOptIn: settings.marketingOptIn,
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error && error.message.trim().length > 0
        ? error.message
        : 'Failed to save settings.'
}

export function WebsiteSettingsFormClient({ initialSettings }: WebsiteSettingsFormClientProps) {
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const form = useForm<WebsiteSettingsInput>({
        mode: 'onBlur',
        resolver: zodResolver(websiteSettingsSchema),
        defaultValues: toFormValues(initialSettings),
    })

    const values = useWatch({
        control: form.control,
    }) as WebsiteSettingsInput

    useEffect(() => {
        form.reset(toFormValues(initialSettings))
    }, [form, initialSettings])

    const handleSubmit = form.handleSubmit(async (values) => {
        setSuccessMessage(null)
        form.clearErrors()

        try {
            const updated = await updateUserWebsiteSettings(values)
            form.reset(toFormValues(updated))
            setSuccessMessage('Settings saved successfully.')
        } catch (error) {
            if (error instanceof ZodError) {
                applyZodErrors(error, form.setError, form.clearErrors)
                return
            }

            form.setError('root', {
                type: 'server',
                message: getErrorMessage(error),
            })
        }
    })

    return (
        <WebsiteSettingsForm
            values={values}
            errors={{
                timezone: form.formState.errors.timezone?.message,
                preferredContact: form.formState.errors.preferredContact?.message,
                appointmentReminders: form.formState.errors.appointmentReminders?.message,
                marketingOptIn: form.formState.errors.marketingOptIn?.message,
                root: form.formState.errors.root?.message,
            }}
            isSubmitting={form.formState.isSubmitting}
            successMessage={successMessage}
            onSubmit={handleSubmit}
            timezoneInputProps={form.register('timezone', {
                setValueAs: (value: string) => (typeof value === 'string' ? value.trim() : ''),
            })}
            preferredContactInputProps={{
                email: form.register('preferredContact'),
                sms: form.register('preferredContact'),
            }}
            toggleInputProps={{
                appointmentReminders: form.register('appointmentReminders'),
                marketingOptIn: form.register('marketingOptIn'),
            }}
        />
    )
}
