import { cn } from '@/lib/utils'

interface LogoMarkProps {
    className?: string
}

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
