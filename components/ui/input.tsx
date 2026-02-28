import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/shared/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]',
        className,
      )}
      {...props}
    />
  );
}