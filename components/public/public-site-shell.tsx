import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { CtrlLogoMark } from './ctrl-logo-mark';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

type PublicSiteShellProps = {
  readonly activePath: string;
  readonly children: ReactNode;
};

function getFooterLinkClassName(href: string, activePath: string): string {
  const isHomepage = href === '/';
  const isActive = isHomepage ? activePath === '/' : activePath.startsWith(href);

  return isActive ? 'site-footer__link site-footer__link--active' : 'site-footer__link';
}

export function PublicSiteShell({ activePath, children }: PublicSiteShellProps) {
  return (
    <div className="public-site">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-header__inner section-shell">
          <Link className="brand" href="/">
            <CtrlLogoMark size="lg" tone="light" />
          </Link>

          <div className="site-header__actions">
            <SignedOut>
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link className="button button--ghost" href="/wraps">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="site-footer__inner section-shell">
          <div className="site-footer__brand">
            <CtrlLogoMark size="lg" tone="light" />
            <p>Vehicle wraps, tint, and signage for El Paso drivers and business fleets.</p>
            <a className="inline-link" href="tel:+19159992191">
              (915) 999-2191
            </a>
          </div>

          <div className="site-footer__links" role="navigation" aria-label="Footer">
            {primaryLinks.map((navigationLink) => (
              <Link
                key={navigationLink.href}
                aria-current={
                  navigationLink.href === '/'
                    ? activePath === '/'
                      ? 'page'
                      : undefined
                    : activePath.startsWith(navigationLink.href)
                      ? 'page'
                      : undefined
                }
                className={getFooterLinkClassName(navigationLink.href, activePath)}
                href={navigationLink.href}
              >
                {navigationLink.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
