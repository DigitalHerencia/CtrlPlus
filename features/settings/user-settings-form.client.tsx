'use client'

import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { NotificationPreferencesFields } from '@/components/settings/user-settings/notification-preferences-fields'
import { PreferencesFields } from '@/components/settings/user-settings/preferences-fields'
import { SettingsFormActions } from '@/components/settings/user-settings/settings-form-actions'
import { UserSettingsFormFields } from '@/components/settings/user-settings/user-settings-form-fields'
import { UserSettingsFormShell } from '@/components/settings/user-settings/user-settings-form-shell'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        fullName: string | null
        email: string | null
        phone: string | null
        billingAddressLine1: string | null
        billingAddressLine2: string | null
        billingCity: string | null
        billingState: string | null
        billingPostalCode: string | null
        billingCountry: string | null
        vehicleMake: string | null
        vehicleModel: string | null
        vehicleYear: string | null
        vehicleTrim: string | null
    }) => Promise<unknown>
}

type FormValues = {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    fullName: string
    email: string
    phone: string
    billingAddressLine1: string
    billingAddressLine2: string
    billingCity: string
    billingState: string
    billingPostalCode: string
    billingCountry: string
    vehicleMake: string
    vehicleModel: string
    vehicleYear: string
    vehicleTrim: string
}

function textOrNull(value: string): string | null {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
}

export function UserSettingsFormClient({ initialSettings, onSave }: UserSettingsFormClientProps) {
    const [serverMessage, setServerMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormValues>({
        defaultValues: {
            theme: initialSettings.theme ?? 'system',
            language: initialSettings.language ?? 'en-US',
            timezone: initialSettings.timezone ?? 'America/Denver',
            emailNotifications: initialSettings.notifications.email,
            smsNotifications: initialSettings.notifications.sms,
            pushNotifications: initialSettings.notifications.push,
            fullName: initialSettings.fullName ?? '',
            email: initialSettings.email ?? '',
            phone: initialSettings.phone ?? '',
            billingAddressLine1: initialSettings.billingAddressLine1 ?? '',
            billingAddressLine2: initialSettings.billingAddressLine2 ?? '',
            billingCity: initialSettings.billingCity ?? '',
            billingState: initialSettings.billingState ?? '',
            billingPostalCode: initialSettings.billingPostalCode ?? '',
            billingCountry: initialSettings.billingCountry ?? 'US',
            vehicleMake: initialSettings.vehicleMake ?? '',
            vehicleModel: initialSettings.vehicleModel ?? '',
            vehicleYear: initialSettings.vehicleYear ?? '',
            vehicleTrim: initialSettings.vehicleTrim ?? '',
        },
    })

    const theme = useWatch({ control: form.control, name: 'theme' })
    const language = useWatch({ control: form.control, name: 'language' })
    const timezone = useWatch({ control: form.control, name: 'timezone' })
    const emailNotifications = useWatch({ control: form.control, name: 'emailNotifications' })
    const smsNotifications = useWatch({ control: form.control, name: 'smsNotifications' })
    const pushNotifications = useWatch({ control: form.control, name: 'pushNotifications' })
    const fullName = useWatch({ control: form.control, name: 'fullName' })
    const email = useWatch({ control: form.control, name: 'email' })
    const phone = useWatch({ control: form.control, name: 'phone' })
    const billingAddressLine1 = useWatch({ control: form.control, name: 'billingAddressLine1' })
    const billingAddressLine2 = useWatch({ control: form.control, name: 'billingAddressLine2' })
    const billingCity = useWatch({ control: form.control, name: 'billingCity' })
    const billingState = useWatch({ control: form.control, name: 'billingState' })
    const billingPostalCode = useWatch({ control: form.control, name: 'billingPostalCode' })
    const billingCountry = useWatch({ control: form.control, name: 'billingCountry' })
    const vehicleMake = useWatch({ control: form.control, name: 'vehicleMake' })
    const vehicleModel = useWatch({ control: form.control, name: 'vehicleModel' })
    const vehicleYear = useWatch({ control: form.control, name: 'vehicleYear' })
    const vehicleTrim = useWatch({ control: form.control, name: 'vehicleTrim' })

    async function onSubmit(values: FormValues) {
        setServerMessage(null)
        startTransition(async () => {
            try {
                await onSave({
                    theme: values.theme,
                    language: values.language,
                    timezone: values.timezone,
                    notifications: {
                        email: values.emailNotifications,
                        sms: values.smsNotifications,
                        push: values.pushNotifications,
                    },
                    preferredContact: values.smsNotifications ? 'sms' : 'email',
                    appointmentReminders: values.emailNotifications,
                    marketingOptIn: values.pushNotifications,
                    fullName: textOrNull(values.fullName),
                    email: textOrNull(values.email),
                    phone: textOrNull(values.phone),
                    billingAddressLine1: textOrNull(values.billingAddressLine1),
                    billingAddressLine2: textOrNull(values.billingAddressLine2),
                    billingCity: textOrNull(values.billingCity),
                    billingState: textOrNull(values.billingState),
                    billingPostalCode: textOrNull(values.billingPostalCode),
                    billingCountry: textOrNull(values.billingCountry),
                    vehicleMake: textOrNull(values.vehicleMake),
                    vehicleModel: textOrNull(values.vehicleModel),
                    vehicleYear: textOrNull(values.vehicleYear),
                    vehicleTrim: textOrNull(values.vehicleTrim),
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

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="settings-full-name">Contact name</Label>
                        <Input
                            id="settings-full-name"
                            value={fullName}
                            onChange={(event) =>
                                form.setValue('fullName', event.target.value, { shouldDirty: true })
                            }
                            placeholder="Jane Driver"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-email">Contact email</Label>
                        <Input
                            id="settings-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                form.setValue('email', event.target.value, { shouldDirty: true })
                            }
                            placeholder="jane@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-phone">Contact phone</Label>
                        <Input
                            id="settings-phone"
                            value={phone}
                            onChange={(event) =>
                                form.setValue('phone', event.target.value, { shouldDirty: true })
                            }
                            placeholder="(555) 555-5555"
                        />
                    </div>
                </div>

                <NotificationPreferencesFields
                    email={emailNotifications}
                    sms={smsNotifications}
                    push={pushNotifications}
                    onEmailChange={(value) =>
                        form.setValue('emailNotifications', value, { shouldDirty: true })
                    }
                    onSmsChange={(value) =>
                        form.setValue('smsNotifications', value, { shouldDirty: true })
                    }
                    onPushChange={(value) =>
                        form.setValue('pushNotifications', value, { shouldDirty: true })
                    }
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="settings-billing-address-line1">Billing address</Label>
                        <Input
                            id="settings-billing-address-line1"
                            value={billingAddressLine1}
                            onChange={(event) =>
                                form.setValue('billingAddressLine1', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="123 Main St"
                        />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="settings-billing-address-line2">Address line 2</Label>
                        <Input
                            id="settings-billing-address-line2"
                            value={billingAddressLine2}
                            onChange={(event) =>
                                form.setValue('billingAddressLine2', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="Suite 200"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-billing-city">City</Label>
                        <Input
                            id="settings-billing-city"
                            value={billingCity}
                            onChange={(event) =>
                                form.setValue('billingCity', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="Denver"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-billing-state">State</Label>
                        <Input
                            id="settings-billing-state"
                            value={billingState}
                            onChange={(event) =>
                                form.setValue('billingState', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="CO"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-billing-postal-code">Postal code</Label>
                        <Input
                            id="settings-billing-postal-code"
                            value={billingPostalCode}
                            onChange={(event) =>
                                form.setValue('billingPostalCode', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="80202"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-billing-country">Country</Label>
                        <Input
                            id="settings-billing-country"
                            value={billingCountry}
                            onChange={(event) =>
                                form.setValue('billingCountry', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="US"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="settings-vehicle-make">Default vehicle make</Label>
                        <Input
                            id="settings-vehicle-make"
                            value={vehicleMake}
                            onChange={(event) =>
                                form.setValue('vehicleMake', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="Ford"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-vehicle-model">Default vehicle model</Label>
                        <Input
                            id="settings-vehicle-model"
                            value={vehicleModel}
                            onChange={(event) =>
                                form.setValue('vehicleModel', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="Mustang"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-vehicle-year">Default vehicle year</Label>
                        <Input
                            id="settings-vehicle-year"
                            value={vehicleYear}
                            onChange={(event) =>
                                form.setValue('vehicleYear', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="2022"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="settings-vehicle-trim">Default vehicle trim</Label>
                        <Input
                            id="settings-vehicle-trim"
                            value={vehicleTrim}
                            onChange={(event) =>
                                form.setValue('vehicleTrim', event.target.value, {
                                    shouldDirty: true,
                                })
                            }
                            placeholder="GT Premium"
                        />
                    </div>
                </div>

                <div className="rounded-md border border-neutral-800 p-4">
                    <p className="text-sm font-medium text-neutral-100">Saved Stripe payment info</p>
                    <p className="mt-1 text-sm text-neutral-400">
                        {initialSettings.stripeDefaultPaymentMethodLast4
                            ? `${initialSettings.stripeDefaultPaymentMethodBrand ?? 'Card'} ending in ${initialSettings.stripeDefaultPaymentMethodLast4}`
                            : 'No saved payment method yet. It will appear here automatically after you complete invoice checkout.'}
                    </p>
                </div>

                {serverMessage ? <p className="text-sm text-neutral-300">{serverMessage}</p> : null}
                <SettingsFormActions isPending={isPending} />
            </UserSettingsFormShell>
        </form>
    )
}
