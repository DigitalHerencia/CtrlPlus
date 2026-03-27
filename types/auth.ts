import type { ComponentProps } from 'react'

import type { AuthzContext } from '@/types/authz'

export interface SessionContext {
    userId: string | null
    isAuthenticated: boolean
    authz: AuthzContext
    role: AuthzContext['role']
    isOwner: boolean
    isPlatformAdmin: boolean
}

export interface SessionUser {
    id: string
    clerkUserId: string
    email: string
}

export interface Session {
    user: SessionUser | null
    isAuthenticated: boolean
    userId: string
}

export interface AuthRedirectSearchParams {
    redirect_url?: string
}

export interface LoginPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

export interface SignupPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

export interface LoginFormValues {
    email: string
    password: string
    verificationCode: string
}

export interface SignupFormValues {
    email: string
    password: string
    verificationCode: string
}

export interface LoginFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}

export interface SignupFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}
