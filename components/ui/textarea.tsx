/**
 * @introduction Components — TODO: short one-line summary of textarea.tsx
 *
 * @description TODO: longer description for textarea.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import * as React from 'react'

import { cn } from '@/lib/utils/cn'

/**
 * TextareaProps — TODO: brief description of this type.
 */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                'flex min-h-20 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        />
    )
)
Textarea.displayName = 'Textarea'

export { Textarea }
