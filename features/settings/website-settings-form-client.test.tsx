import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    updateUserWebsiteSettings: vi.fn(),
}))

vi.mock('@/lib/settings/actions/update-user-website-settings', () => ({
    updateUserWebsiteSettings: mocks.updateUserWebsiteSettings,
}))

import { WebsiteSettingsFormClient } from './website-settings-form-client'

const initialSettings = {
    preferredContact: 'email' as const,
    appointmentReminders: true,
    marketingOptIn: false,
    timezone: 'America/Denver',
    updatedAt: '2026-03-20T12:00:00.000Z',
}

describe('WebsiteSettingsFormClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the initial settings values', () => {
        render(<WebsiteSettingsFormClient initialSettings={initialSettings} />)

        expect(screen.getByPlaceholderText('America/Los_Angeles')).toHaveValue('America/Denver')
        expect(screen.getByLabelText('Email')).toBeChecked()
        expect(screen.getByLabelText('Appointment reminders')).toBeChecked()
        expect(screen.getByLabelText('Marketing updates')).not.toBeChecked()
    })

    it('shows shared schema validation errors before submit reaches the action', async () => {
        render(<WebsiteSettingsFormClient initialSettings={initialSettings} />)

        fireEvent.change(screen.getByPlaceholderText('America/Los_Angeles'), {
            target: { value: 'not-a-timezone' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

        await expect(
            screen.findByText('Use a valid IANA timezone identifier.')
        ).resolves.toBeVisible()
        expect(mocks.updateUserWebsiteSettings).not.toHaveBeenCalled()
    })

    it('surfaces server errors and keeps the user on the page', async () => {
        mocks.updateUserWebsiteSettings.mockRejectedValue(new Error('Failed to save settings.'))

        render(<WebsiteSettingsFormClient initialSettings={initialSettings} />)

        fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

        await expect(screen.findByText('Failed to save settings.')).resolves.toBeVisible()
    })

    it('shows success feedback and resets the form to the saved values', async () => {
        mocks.updateUserWebsiteSettings.mockResolvedValue({
            ...initialSettings,
            preferredContact: 'sms',
            appointmentReminders: false,
            marketingOptIn: true,
            timezone: 'America/New_York',
        })

        render(<WebsiteSettingsFormClient initialSettings={initialSettings} />)

        fireEvent.change(screen.getByPlaceholderText('America/Los_Angeles'), {
            target: { value: 'America/New_York' },
        })
        fireEvent.click(screen.getByLabelText('SMS'))
        fireEvent.click(screen.getByLabelText('Appointment reminders'))
        fireEvent.click(screen.getByLabelText('Marketing updates'))
        fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

        await waitFor(() =>
            expect(mocks.updateUserWebsiteSettings).toHaveBeenCalledWith({
                preferredContact: 'sms',
                appointmentReminders: false,
                marketingOptIn: true,
                timezone: 'America/New_York',
            })
        )
        await expect(screen.findByText('Settings saved successfully.')).resolves.toBeVisible()
        expect(screen.getByPlaceholderText('America/Los_Angeles')).toHaveValue('America/New_York')
        expect(screen.getByLabelText('SMS')).toBeChecked()
        expect(screen.getByLabelText('Appointment reminders')).not.toBeChecked()
        expect(screen.getByLabelText('Marketing updates')).toBeChecked()
    })
})
