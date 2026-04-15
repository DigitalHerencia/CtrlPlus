'use client'


import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { type FormEventHandler } from 'react'
import { type UseFormRegisterReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type WebsiteSettingsInput } from '@/types/settings.types'

interface WebsiteSettingsFormProps {
    values: WebsiteSettingsInput
    errors: Partial<Record<keyof WebsiteSettingsInput, string | undefined>> & {
        root?: string | undefined
    }
    isSubmitting: boolean
    successMessage: string | null
    onSubmit: FormEventHandler<HTMLFormElement>
    timezoneInputProps: UseFormRegisterReturn<'timezone'>
    preferredContactInputProps: {
        email: UseFormRegisterReturn<'preferredContact'>
        sms: UseFormRegisterReturn<'preferredContact'>
    }
    toggleInputProps: {
        appointmentReminders: UseFormRegisterReturn<'appointmentReminders'>
        marketingOptIn: UseFormRegisterReturn<'marketingOptIn'>
    }
}


export function WebsiteSettingsForm({
    values,
    errors,
    isSubmitting,
    successMessage,
    onSubmit,
    timezoneInputProps,
    preferredContactInputProps,
    toggleInputProps,
}: WebsiteSettingsFormProps) {
    return (
        <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-8">
            {errors.root ? (
                <div className="border border-red-950/60 bg-red-950/30 px-4 py-3 text-sm text-red-100">
                    {errors.root}
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
                    aria-label="Timezone"
                    id="timezone"
                    type="text"
                    placeholder="America/Los_Angeles"
                    className="border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-500"
                    disabled={isSubmitting}
                    {...timezoneInputProps}
                />
                <FieldDescription className="text-neutral-400">
                    Use an IANA timezone identifier so reminders and appointments stay consistent.
                </FieldDescription>
                <FieldError errors={errors.timezone ? [{ message: errors.timezone }] : undefined} />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-100">
                    Preferred contact method
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        {
                            value: 'email' as const,
                            title: 'Email',
                            description: 'Use email for booking and customer communication.',
                            inputProps: preferredContactInputProps.email,
                        },
                        {
                            value: 'sms' as const,
                            title: 'SMS',
                            description: 'Use text messages for shorter reminders and updates.',
                            inputProps: preferredContactInputProps.sms,
                        },
                    ].map((option) => {
                        const selected = values.preferredContact === option.value

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
                                    aria-label={option.title}
                                    type="radio"
                                    className="sr-only"
                                    disabled={isSubmitting}
                                    value={option.value}
                                    {...option.inputProps}
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
                <FieldError
                    errors={
                        errors.preferredContact ? [{ message: errors.preferredContact }] : undefined
                    }
                />
            </div>

            <div className="grid gap-3">
                {[
                    {
                        name: 'appointmentReminders' as const,
                        title: 'Appointment reminders',
                        description: 'Send reminder notices before confirmed appointments.',
                        inputProps: toggleInputProps.appointmentReminders,
                    },
                    {
                        name: 'marketingOptIn' as const,
                        title: 'Marketing updates',
                        description:
                            'Receive product updates, promotions, and launch announcements.',
                        inputProps: toggleInputProps.marketingOptIn,
                    },
                ].map((option) => {
                    const selected = values[option.name]

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
                                aria-label={option.title}
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-blue-600"
                                disabled={isSubmitting}
                                {...option.inputProps}
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
                disabled={isSubmitting}
                className="h-12 w-full bg-neutral-100 font-medium text-neutral-950 hover:bg-white sm:w-auto"
            >
                {isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save settings
            </Button>
        </form>
    )
}
