/**
 * @introduction Components — TODO: short one-line summary of logo-icon.tsx
 *
 * @description TODO: longer description for logo-icon.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { cn } from '@/lib/utils/cn'

interface LogoIconProps {
    className?: string
}

/**
 * LogoIcon — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function LogoIcon({ className }: LogoIconProps) {
    return (
        <span
            className={cn(
                'border-2 border-white px-2 pb-2 pt-1 text-2xl font-black leading-none tracking-tight text-neutral-100',
                className
            )}
        >
            +
        </span>
    )
}
