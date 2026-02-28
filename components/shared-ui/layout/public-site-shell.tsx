import type { ReactNode } from 'react';
import Link from 'next/link';

import { buttonVariants } from '../../ui';
import { PublicNav } from '../nav/public-nav';
import { AppProviders } from '../providers/app-providers';

type PublicSiteShellProps = {
  readonly activePath?: string;
  readonly children: ReactNode;
  readonly variant?: 'default' | 'auth';
};

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function PublicSiteShell({ activePath = '/', children, variant = 'default' }: PublicSiteShellProps) {
  const hidePrimaryNav = variant === 'auth';

  return (
    <AppProviders>
      <div className='flex min-h-screen flex-col bg-[color:var(--surface-background)]'>
        <a
          className='sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[color:var(--text)] focus:px-3 focus:py-2 focus:text-[color:var(--bg)]'
          href='#main-content'
        >
          Skip to content
        </a>

        <PublicNav activePath={activePath} hidePrimaryNav={hidePrimaryNav} />
        {children}

        <footer className='mt-auto border-t border-[color:var(--border)] bg-[color:var(--surface-card)]'>
          <div className='mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_auto_1fr] md:px-6'>
            <div className='grid gap-3'>
              <p className='text-lg font-semibold text-[color:var(--text)]'>CTRL+</p>
              <p className='max-w-sm text-sm text-[color:var(--text-muted)]'>
                Vehicle wraps, tint, and signage for El Paso businesses and drivers.
              </p>
            </div>

            <nav aria-label='Footer' className='grid content-start gap-2 text-sm'>
              {FOOTER_LINKS.map((link) => (
                <Link className='text-[color:var(--text-muted)] hover:text-[color:var(--text)]' href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className='grid gap-3'>
              <p className='text-sm text-[color:var(--text-muted)]'>Ready to start your project?</p>
              <div className='flex flex-wrap items-center gap-2'>
                <Link className={buttonVariants({ size: 'sm' })} href='/sign-up'>
                  Create Account
                </Link>
                <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href='/sign-in'>
                  Existing Customer
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppProviders>
  );
}