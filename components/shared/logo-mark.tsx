/**
 * @introduction Components — TODO: short one-line summary of logo-mark.tsx
 *
 * @description TODO: longer description for logo-mark.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import { cn } from '@/lib/utils/cn'

interface LogoMarkProps {
    className?: string
}

/**
 * LogoMark — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function LogoMark({ className }: LogoMarkProps) {
    return (
        <span
            className={cn(
                'inline-flex border-2 border-white px-3 py-1.5 text-lg font-black leading-none tracking-tight text-neutral-100 sm:text-xl',
                className
            )}
        >
            CTRL+
        </span>
    )
}
