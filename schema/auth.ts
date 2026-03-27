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
