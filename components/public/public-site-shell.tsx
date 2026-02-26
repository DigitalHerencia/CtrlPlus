import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

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

function getNavigationLinkClassName(href: string, activePath: string): string {
  const isHomepage = href === '/';
  const isActive = isHomepage ? activePath === '/' : activePath.startsWith(href);

  return isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link';
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
            <Image src="/logo_blue_spec.png" alt="CTRL+ logo" width={44} height={44} />
            <span className="brand__copy">
              <span className="brand__name">CTRL+</span>
              <span className="brand__tagline">Command Your Brand</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="site-nav">
            {primaryLinks.map((navigationLink) => (
              <Link
                key={navigationLink.href}
                className={getNavigationLinkClassName(navigationLink.href, activePath)}
                href={navigationLink.href}
              >
                {navigationLink.label}
              </Link>
            ))}
          </nav>

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
            <Image src="/logo_white_spec.png" alt="CTRL+ mark" width={56} height={56} />
            <p>Vehicle wraps, tint, and signage for El Paso drivers and business fleets.</p>
            <a className="inline-link" href="tel:+19159992191">
              (915) 999-2191
            </a>
          </div>

          <div className="site-footer__links" role="navigation" aria-label="Footer">
            {primaryLinks.map((navigationLink) => (
              <Link key={navigationLink.href} href={navigationLink.href}>
                {navigationLink.label}
              </Link>
            ))}
          </div>

          <div className="site-footer__cta">
            <p>Start with account setup, then move through browse, preview, schedule, and pay.</p>
            <div className="site-footer__cta-actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Existing Customer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
