import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

const navigationLinks = [
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
            <span className="brand__mark">
              <Image
                src="/0001-762728619053843625.png"
                alt="CTRL+ logo"
                width={42}
                height={42}
              />
            </span>
            <span className="brand__copy">
              <span className="brand__name">CTRL+</span>
              <span className="brand__tagline">Command Your Brand</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="site-nav">
            {navigationLinks.map((navigationLink) => (
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
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
              <Link className="button button--primary" href="/sign-up">
                Sign Up
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
            <Image src="/0001-3757622370303829961.png" alt="CTRL+ mark" width={52} height={52} />
            <p>
              Premium vehicle wraps, tint, and signage for El Paso businesses and drivers ready to
              stand out.
            </p>
          </div>

          <div className="site-footer__links" role="navigation" aria-label="Footer">
            {navigationLinks.map((navigationLink) => (
              <Link key={navigationLink.href} href={navigationLink.href}>
                {navigationLink.label}
              </Link>
            ))}
          </div>

          <div className="site-footer__cta">
            <p>Ready to start your wrap project?</p>
            <div className="site-footer__cta-actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Existing Client
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
