import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';

const signInHighlights = [
  'Resume saved wrap previews and continue booking where you left off.',
  'Review upcoming drop-off and pick-up windows in one dashboard.',
  'Track invoice and payment status without leaving your account.'
];

export const metadata: Metadata = {
  title: 'Sign In'
};

export default function SignInPage() {
  return (
    <PublicSiteShell activePath="/sign-in">
      <main className="auth-main" id="main-content">
        <section className="section-shell auth-section">
          <article className="card auth-card">
            <p className="eyebrow">Sign In</p>
            <h1 className="auth-card__title">Welcome back to CTRL+.</h1>
            <p className="auth-card__description">
              Continue with your email identity provider to access your account and move from
              design selection to confirmed booking.
            </p>

            <ul className="auth-card__list">
              {signInHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="auth-card__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/features">
                Explore Features
              </Link>
            </div>

            <p className="auth-card__support">
              Need an account?{' '}
              <Link className="inline-link" href="/sign-up">
                Sign up
              </Link>
            </p>
          </article>

          <aside className="card auth-panel">
            <div className="auth-panel__content">
              <p className="eyebrow">Secure Access</p>
              <h2>Sign in with Clerk to continue.</h2>
              <SignIn fallbackRedirectUrl="/wraps" path="/sign-in" routing="path" signUpUrl="/sign-up" />
            </div>
          </aside>
        </section>
      </main>
    </PublicSiteShell>
  );
}
