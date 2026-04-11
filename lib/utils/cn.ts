/**
 * @introduction Utils — TODO: short one-line summary of cn.ts
 *
 * @description TODO: longer description for cn.ts. Keep it short — one or two sentences.
 * Domain: utils
 * Public: TODO (yes/no)
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
