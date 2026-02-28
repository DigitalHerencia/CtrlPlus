import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/shared/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-card)] text-[color:var(--text)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('grid gap-2 p-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h2 className={cn('text-2xl font-semibold tracking-[0.01em]', className)} {...props} />;
}

export function CardDescription({ className, ...props }: CardProps) {
  return <p className={cn('text-sm text-[color:var(--text-muted)]', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('grid gap-3 px-5 pb-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn('flex flex-wrap items-center gap-2 px-5 pb-5', className)} {...props} />;
}