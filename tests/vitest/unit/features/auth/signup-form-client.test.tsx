import '@testing-library/jest-dom/vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    useSignUp: vi.fn(),
}))

vi.mock('@clerk/nextjs', () => ({
    useSignUp: mocks.useSignUp,
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
}))

describe('SignupForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('sends an email verification code when Clerk requires email verification', async () => {
        const signUp = {
            status: 'needs_identifier',
            unverifiedFields: [] as string[],
            createdSessionId: null as string | null,
            finalize: vi.fn().mockResolvedValue({ error: null }),
            password: vi.fn(async () => {
                signUp.status = 'missing_requirements'
                signUp.unverifiedFields = ['email_address']
                return {
                    error: null,
                    status: 'missing_requirements',
                    unverifiedFields: ['email_address'],
                }
            }),
            verifications: {
                sendEmailCode: vi.fn().mockResolvedValue({ error: null }),
                verifyEmailCode: vi.fn(),
            },
        }

        mocks.useSignUp.mockReturnValue({
            fetchStatus: 'loaded',
            signUp,
        })

        const { SignupForm } = await import('@/features/auth/signup-form-client')

        render(<SignupForm />)

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'owner@example.com' },
        })
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'Password123!' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

        await waitFor(() => expect(signUp.password).toHaveBeenCalled())
        await waitFor(() => expect(signUp.verifications.sendEmailCode).toHaveBeenCalledTimes(1))
        await expect(screen.findByLabelText('Verification code')).resolves.toBeVisible()
        expect(
            screen.getByText('We sent a verification code to your email address.')
        ).toBeVisible()
    })
})
