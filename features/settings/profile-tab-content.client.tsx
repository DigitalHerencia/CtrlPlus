'use client'


import { useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ProfileFormContact } from '@/components/settings/user-settings/profile-form-contact'
import { ProfileFormPreferences } from '@/components/settings/user-settings/profile-form-preferences'
import { ProfileFormNotifications } from '@/components/settings/user-settings/profile-form-notifications'
import { ProfileFormBilling } from '@/components/settings/user-settings/profile-form-billing'
import { ProfileFormVehicle } from '@/components/settings/user-settings/profile-form-vehicle'
import { type UserSettingsViewDTO } from '@/types/settings.types'

interface ProfileTabContentClientProps {
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


export function ProfileTabContentClient({ initialSettings, onSave }: ProfileTabContentClientProps) {
    const [serverMessage, setServerMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormValues>({
        defaultValues: {
            theme: initialSettings.theme ?? 'system',
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

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setServerMessage(null)
        startTransition(async () => {
            try {
                await onSave({
                    theme,
                    language: 'en-US',
                    timezone: textOrNull(timezone),
                    notifications: {
                        email: emailNotifications,
                        sms: smsNotifications,
                        push: pushNotifications,
                    },
                    preferredContact: emailNotifications ? 'email' : 'sms',
                    appointmentReminders: true,
                    marketingOptIn: false,
                    fullName: textOrNull(fullName),
                    email: textOrNull(email),
                    phone: textOrNull(phone),
                    billingAddressLine1: textOrNull(billingAddressLine1),
                    billingAddressLine2: textOrNull(billingAddressLine2),
                    billingCity: textOrNull(billingCity),
                    billingState: textOrNull(billingState),
                    billingPostalCode: textOrNull(billingPostalCode),
                    billingCountry: textOrNull(billingCountry),
                    vehicleMake: textOrNull(vehicleMake),
                    vehicleModel: textOrNull(vehicleModel),
                    vehicleYear: textOrNull(vehicleYear),
                    vehicleTrim: textOrNull(vehicleTrim),
                })
                setServerMessage('Settings saved successfully.')
                // Optional: Reset form dirty state
                form.reset(form.getValues())
            } catch (error) {
                setServerMessage(
                    error instanceof Error ? error.message : 'Unable to save settings.'
                )
            }
        })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {serverMessage && (
                <div
                    className={`rounded-md px-4 py-3 text-sm ${
                        serverMessage.includes('success')
                            ? 'border border-emerald-900/60 bg-emerald-950/30 text-emerald-100'
                            : 'border border-red-900/60 bg-red-950/30 text-red-100'
                    }`}
                >
                    {serverMessage}
                </div>
            )}

            <ProfileFormPreferences
                theme={theme}
                timezone={timezone}
                onThemeChange={(value) => form.setValue('theme', value, { shouldDirty: true })}
                onTimezoneChange={(value) =>
                    form.setValue('timezone', value, { shouldDirty: true })
                }
            />

            <ProfileFormContact
                fullName={fullName}
                email={email}
                phone={phone}
                onFullNameChange={(value) =>
                    form.setValue('fullName', value, { shouldDirty: true })
                }
                onEmailChange={(value) => form.setValue('email', value, { shouldDirty: true })}
                onPhoneChange={(value) => form.setValue('phone', value, { shouldDirty: true })}
            />

            <ProfileFormNotifications
                emailNotifications={emailNotifications}
                smsNotifications={smsNotifications}
                pushNotifications={pushNotifications}
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

            <ProfileFormBilling
                billingAddressLine1={billingAddressLine1}
                billingAddressLine2={billingAddressLine2}
                billingCity={billingCity}
                billingState={billingState}
                billingPostalCode={billingPostalCode}
                billingCountry={billingCountry}
                onAddressLine1Change={(value) =>
                    form.setValue('billingAddressLine1', value, { shouldDirty: true })
                }
                onAddressLine2Change={(value) =>
                    form.setValue('billingAddressLine2', value, { shouldDirty: true })
                }
                onCityChange={(value) => form.setValue('billingCity', value, { shouldDirty: true })}
                onStateChange={(value) =>
                    form.setValue('billingState', value, { shouldDirty: true })
                }
                onPostalCodeChange={(value) =>
                    form.setValue('billingPostalCode', value, { shouldDirty: true })
                }
                onCountryChange={(value) =>
                    form.setValue('billingCountry', value, { shouldDirty: true })
                }
            />

            <ProfileFormVehicle
                vehicleMake={vehicleMake}
                vehicleModel={vehicleModel}
                vehicleYear={vehicleYear}
                vehicleTrim={vehicleTrim}
                onMakeChange={(value) => form.setValue('vehicleMake', value, { shouldDirty: true })}
                onModelChange={(value) =>
                    form.setValue('vehicleModel', value, { shouldDirty: true })
                }
                onYearChange={(value) => form.setValue('vehicleYear', value, { shouldDirty: true })}
                onTrimChange={(value) => form.setValue('vehicleTrim', value, { shouldDirty: true })}
            />

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </form>
    )
}
