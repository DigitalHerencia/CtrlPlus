import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';

const signInHighlights = [
  'Resume your saved wrap previews and booking progress.',
  'Review upcoming drop-off and pick-up windows in one place.',
  'Track invoice and payment status without leaving the flow.'
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
            <p className="eyebrow">Welcome Back</p>
            <h1 className="auth-card__title">Sign in to continue your CTRL+ wrap journey.</h1>
            <p className="auth-card__description">
              Use your email identity provider to access your account and continue from the exact
              point where you left the funnel.
            </p>

            <ul className="auth-card__list">
              {signInHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="auth-card__actions">
              <Link className="button button--primary" href="/sign-up">
                Need Access? Sign Up
              </Link>
              <Link className="button button--ghost" href="/features">
                Review Features
              </Link>
            </div>

            <p className="auth-card__support">
              New to CTRL+?{' '}
              <Link className="inline-link" href="/sign-up">
                Create your account
              </Link>
            </p>
          </article>

          <aside className="card auth-panel">
            <div className="auth-panel__content">
              <p className="eyebrow">Secure Session</p>
              <h2>Sign in with Clerk to continue.</h2>
              <SignIn fallbackRedirectUrl="/wraps" path="/sign-in" routing="path" signUpUrl="/sign-up" />
            </div>
          </aside>
        </section>
      </main>
    </PublicSiteShell>
  );
}
