/**
 * @introduction Types — TODO: short one-line summary of auth.types.ts
 *
 * @description TODO: longer description for auth.types.ts. Keep it short — one or two sentences.
 * Domain: types
 * Public: TODO (yes/no)
 */
import type { ComponentProps } from 'react'

import { CAPABILITY_VALUES, GLOBAL_ROLE_VALUES } from '@/lib/constants/permissions'

/**
 * GlobalRole — TODO: brief description of this type.
 */
/**
 * GlobalRole — TODO: brief description of this type.
 */
/**
 * GlobalRole — TODO: brief description of this type.
 */
export type GlobalRole = (typeof GLOBAL_ROLE_VALUES)[number]

/**
 * Capability — TODO: brief description of this type.
 */
/**
 * Capability — TODO: brief description of this type.
 */
/**
 * Capability — TODO: brief description of this type.
 */
export type Capability = (typeof CAPABILITY_VALUES)[number]

/**
 * AuthzContext — TODO: brief description of this type.
 */
/**
 * AuthzContext — TODO: brief description of this type.
 */
/**
 * AuthzContext — TODO: brief description of this type.
 */
export interface AuthzContext {
    userId: string | null
    role: GlobalRole
    isAuthenticated: boolean
    isOwner: boolean
    isPlatformAdmin: boolean
}

/**
 * SessionContext — TODO: brief description of this type.
 */
/**
 * SessionContext — TODO: brief description of this type.
 */
/**
 * SessionContext — TODO: brief description of this type.
 */
export interface SessionContext {
    userId: string | null
    isAuthenticated: boolean
    authz: AuthzContext
    role: AuthzContext['role']
    isOwner: boolean
    isPlatformAdmin: boolean
}

/**
 * SessionUser — TODO: brief description of this type.
 */
/**
 * SessionUser — TODO: brief description of this type.
 */
/**
 * SessionUser — TODO: brief description of this type.
 */
export interface SessionUser {
    id: string
    clerkUserId: string
    email: string
}

/**
 * Session — TODO: brief description of this type.
 */
/**
 * Session — TODO: brief description of this type.
 */
/**
 * Session — TODO: brief description of this type.
 */
export interface Session {
    user: SessionUser | null
    isAuthenticated: boolean
    userId: string
}

/**
 * AuthRedirectSearchParams — TODO: brief description of this type.
 */
/**
 * AuthRedirectSearchParams — TODO: brief description of this type.
 */
/**
 * AuthRedirectSearchParams — TODO: brief description of this type.
 */
export interface AuthRedirectSearchParams {
    redirect_url?: string
}

/**
 * LoginPageProps — TODO: brief description of this type.
 */
/**
 * LoginPageProps — TODO: brief description of this type.
 */
/**
 * LoginPageProps — TODO: brief description of this type.
 */
export interface LoginPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

/**
 * SignupPageProps — TODO: brief description of this type.
 */
/**
 * SignupPageProps — TODO: brief description of this type.
 */
/**
 * SignupPageProps — TODO: brief description of this type.
 */
export interface SignupPageProps {
    searchParams: Promise<AuthRedirectSearchParams>
}

/**
 * LoginFormValues — TODO: brief description of this type.
 */
/**
 * LoginFormValues — TODO: brief description of this type.
 */
/**
 * LoginFormValues — TODO: brief description of this type.
 */
export interface LoginFormValues {
    email: string
    password: string
    verificationCode: string
}

/**
 * SignupFormValues — TODO: brief description of this type.
 */
/**
 * SignupFormValues — TODO: brief description of this type.
 */
/**
 * SignupFormValues — TODO: brief description of this type.
 */
export interface SignupFormValues {
    email: string
    password: string
    verificationCode: string
}

/**
 * LoginFormProps — TODO: brief description of this type.
 */
/**
 * LoginFormProps — TODO: brief description of this type.
 */
/**
 * LoginFormProps — TODO: brief description of this type.
 */
export interface LoginFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}

/**
 * SignupFormProps — TODO: brief description of this type.
 */
/**
 * SignupFormProps — TODO: brief description of this type.
 */
/**
 * SignupFormProps — TODO: brief description of this type.
 */
export interface SignupFormProps extends ComponentProps<'form'> {
    redirectUrl?: string
}
