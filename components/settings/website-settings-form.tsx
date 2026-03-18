/* eslint-disable react-hooks/incompatible-library */
'use client'

import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { updateUserWebsiteSettings } from '@/lib/settings/actions/update-user-website-settings'
import {
    websiteSettingsSchema,
    type WebsiteSettingsDTO,
    type WebsiteSettingsInput,
} from '@/lib/settings/types'

const websiteSettingsFormSchema = websiteSettingsSchema.extend({
    timezone: z.string().trim().min(1, 'Timezone is required.').max(100),
})

type WebsiteSettingsFormValues = WebsiteSettingsInput

interface WebsiteSettingsFormProps {
    settings: WebsiteSettingsDTO
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error && error.message.trim().length > 0
        ? error.message
        : 'Failed to save settings.'
}

export function WebsiteSettingsForm({ settings }: WebsiteSettingsFormProps) {
    const router = useRouter()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const form = useForm<WebsiteSettingsFormValues>({
        mode: 'onBlur',
        defaultValues: {
            timezone: settings.timezone,
            preferredContact: settings.preferredContact,
            appointmentReminders: settings.appointmentReminders,
            marketingOptIn: settings.marketingOptIn,
        },
    })

    useEffect(() => {
        form.reset({
            timezone: settings.timezone,
            preferredContact: settings.preferredContact,
            appointmentReminders: settings.appointmentReminders,
            marketingOptIn: settings.marketingOptIn,
        })
    }, [form, settings])

    const handleSubmit = form.handleSubmit(async (values) => {
        form.clearErrors()
        setSuccessMessage(null)

        const parsed = websiteSettingsFormSchema.safeParse(values)
        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                const field = issue.path[0]
                if (typeof field === 'string') {
                    form.setError(field as keyof WebsiteSettingsFormValues, {
                        message: issue.message,
                    })
                }
            }
            return
        }

        try {
            await updateUserWebsiteSettings(parsed.data)
            setSuccessMessage('Settings saved successfully.')
            router.refresh()
        } catch (error) {
            form.setError('root', {
                message: getErrorMessage(error),
            })
        }
    })

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl space-y-8">
            {form.formState.errors.root?.message ? (
                <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                    {form.formState.errors.root.message}
                </div>
            ) : null}

            {successMessage ? (
                <div className="flex items-center gap-2 border border-emerald-900/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {successMessage}
                </div>
            ) : null}

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-50">Timezone</h2>
                <Input
                    id="timezone"
                    type="text"
                    placeholder="America/Los_Angeles"
                    className="border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
                    disabled={form.formState.isSubmitting}
                    {...form.register('timezone', {
                        setValueAs: (value: string) =>
                            typeof value === 'string' ? value.trim() : '',
                    })}
                />
                <FieldDescription className="text-neutral-400">
                    Use an IANA timezone identifier so reminders and appointments stay consistent.
                </FieldDescription>
                <FieldError
                    errors={
                        form.formState.errors.timezone?.message
                            ? [{ message: form.formState.errors.timezone.message }]
                            : undefined
                    }
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                    Preferred contact method
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        {
                            value: 'email',
                            title: 'Email',
                            description: 'Use email for booking and customer communication.',
                        },
                        {
                            value: 'sms',
                            title: 'SMS',
                            description: 'Use text messages for shorter reminders and updates.',
                        },
                    ].map((option) => {
                        const selected = form.watch('preferredContact') === option.value
                        return (
                            <label
                                key={option.value}
                                className={
                                    selected
                                        ? 'cursor-pointer rounded-2xl border border-blue-600 bg-blue-950/20 p-4'
                                        : 'cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 transition hover:border-neutral-700'
                                }
                            >
                                <input
                                    type="radio"
                                    value={option.value}
                                    className="sr-only"
                                    disabled={form.formState.isSubmitting}
                                    {...form.register('preferredContact')}
                                />
                                <p className="text-sm font-medium text-neutral-50">
                                    {option.title}
                                </p>
                                <p className="mt-1 text-sm text-neutral-400">
                                    {option.description}
                                </p>
                            </label>
                        )
                    })}
                </div>
            </div>

            <div className="grid gap-3">
                {[
                    {
                        name: 'appointmentReminders' as const,
                        title: 'Appointment reminders',
                        description: 'Send reminder notices before confirmed appointments.',
                    },
                    {
                        name: 'marketingOptIn' as const,
                        title: 'Marketing updates',
                        description:
                            'Receive product updates, promotions, and launch announcements.',
                    },
                ].map((option) => {
                    const selected = form.watch(option.name)
                    return (
                        <label
                            key={option.name}
                            className={
                                selected
                                    ? 'flex cursor-pointer items-start gap-3 rounded-2xl border border-blue-600 bg-blue-950/20 p-4'
                                    : 'flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 transition hover:border-neutral-700'
                            }
                        >
                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-blue-600"
                                disabled={form.formState.isSubmitting}
                                {...form.register(option.name)}
                            />
                            <div>
                                <p className="text-sm font-medium text-neutral-100">
                                    {option.title}
                                </p>
                                <p className="mt-1 text-sm text-neutral-400">
                                    {option.description}
                                </p>
                            </div>
                        </label>
                    )
                })}
            </div>

            <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-12 w-full bg-neutral-100 font-medium text-neutral-950 hover:bg-white sm:w-auto"
            >
                {form.formState.isSubmitting ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save settings
            </Button>
        </form>
    )
}
