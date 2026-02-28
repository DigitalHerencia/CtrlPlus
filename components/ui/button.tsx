import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/shared/cn';

const BASE_BUTTON_CLASS_NAME =
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] disabled:pointer-events-none disabled:opacity-60';

const VARIANT_CLASS_NAMES = {
  default:
    'bg-[color:var(--accent)] text-[color:var(--color-accent-foreground)] hover:bg-[color:var(--accent-strong)]',
  secondary:
    'bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface-elevated)]',
  outline:
    'border border-[color:var(--border)] bg-transparent text-[color:var(--text)] hover:bg-[color:var(--surface-muted)]',
  ghost: 'text-[color:var(--text)] hover:bg-[color:var(--surface-muted)]',
  link: 'h-auto px-0 py-0 text-[color:var(--accent)] underline-offset-4 hover:underline',
} as const;

const SIZE_CLASS_NAMES = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-xs',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASS_NAMES;
type ButtonSize = keyof typeof SIZE_CLASS_NAMES;

type ButtonOptions = {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonOptions;

export function buttonVariants({ variant = 'default', size = 'default', className }: ButtonOptions = {}): string {
  return cn(BASE_BUTTON_CLASS_NAME, VARIANT_CLASS_NAMES[variant], SIZE_CLASS_NAMES[size], className);
}

export function Button({ className, type = 'button', variant, size, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, size, className })} type={type} {...props} />;
}