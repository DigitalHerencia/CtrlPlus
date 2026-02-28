import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/shared/cn';

const VARIANT_CLASS_NAMES = {
  default: 'bg-[color:var(--surface-muted)] text-[color:var(--text)]',
  outline: 'border border-[color:var(--border)] bg-transparent text-[color:var(--text-muted)]',
  accent: 'bg-[color:var(--accent-soft)] text-[color:var(--text)]',
} as const;

type BadgeVariant = keyof typeof VARIANT_CLASS_NAMES;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  readonly variant?: BadgeVariant;
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em]',
        VARIANT_CLASS_NAMES[variant],
        className,
      )}
      {...props}
    />
  );
}