import { SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

import { UserMenu } from '@/components/auth/user-menu';
import { buttonVariants } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

type PublicNavProps = {
  readonly activePath: string;
  readonly hidePrimaryNav?: boolean;
};

function isActiveLink(href: string, activePath: string): boolean {
  if (href === '/') {
    return activePath === '/';
  }

  return activePath.startsWith(href);
}

export function PublicNav({ activePath, hidePrimaryNav = false }: PublicNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--surface-card)/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link className="text-lg font-semibold tracking-[0.03em] text-(--text)" href="/">
          CTRL+
        </Link>

        {!hidePrimaryNav ? (
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
            {NAV_LINKS.map((navigationLink) => (
              <Link
                className={
                  isActiveLink(navigationLink.href, activePath)
                    ? buttonVariants({ variant: 'secondary', size: 'sm' })
                    : buttonVariants({ variant: 'ghost', size: 'sm' })
                }
                href={navigationLink.href}
                key={navigationLink.href}
              >
                {navigationLink.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          <SignedOut>
            <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href="/sign-in">
              Sign In
            </Link>
            <Link className={buttonVariants({ size: 'sm' })} href="/sign-up">
              Create Account
            </Link>
          </SignedOut>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
