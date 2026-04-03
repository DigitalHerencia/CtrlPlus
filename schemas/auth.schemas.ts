import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(1, 'Enter your password.').max(128, 'Password is too long.'),
})

export const signupSchema = z.object({
    email: z.string().trim().email('Enter a valid email address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(128, 'Password is too long.'),
})

export const verificationCodeSchema = z
    .string()
    .trim()
    .min(4, 'Enter the verification code.')
    .max(12, 'Verification code is too long.')

export const verificationSchema = z.object({
    verificationCode: verificationCodeSchema,
})

export const upsertUserFromClerkSchema = z
    .object({
        clerkUserId: z.string().trim().min(1),
        email: z.string().trim().email(),
        firstName: z.string().trim().min(1).nullable().optional(),
        lastName: z.string().trim().min(1).nullable().optional(),
        imageUrl: z.url().trim().nullable().optional(),
        globalRole: z.enum(['owner', 'admin', 'employee', 'customer']).nullable().optional(),
    })
    .strict()
