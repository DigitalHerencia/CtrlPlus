import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';

const signUpBenefits = [
  'Browse wraps and save options in one place.',
  'Launch previews quickly with upload and template-based visualizer flows.',
  'Schedule installation and complete secure checkout with clear confirmation.'
];

export const metadata: Metadata = {
  title: 'Sign Up'
};

export default function SignUpPage() {
  return (
    <PublicSiteShell activePath="/sign-up">
      <main className="auth-main" id="main-content">
        <section className="section-shell auth-section auth-section--reverse">
          <article className="card auth-card">
            <p className="eyebrow">Sign Up</p>
            <h1 className="auth-card__title">Create your CTRL+ account.</h1>
            <p className="auth-card__description">
              Sign up once to unlock the complete journey from wrap discovery and visual previews to
              scheduling and payment.
            </p>

            <ul className="auth-card__list">
              {signUpBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <div className="auth-card__actions">
              <Link className="button button--primary" href="/features">
                Explore Features
              </Link>
              <Link className="button button--ghost" href="/contact">
                Contact Team
              </Link>
            </div>

            <p className="auth-card__support">
              Already have an account?{' '}
              <Link className="inline-link" href="/sign-in">
                Sign in
              </Link>
            </p>
          </article>

          <aside className="card auth-panel">
            <div className="auth-panel__content">
              <p className="eyebrow">Account Setup</p>
              <h2>Create your account with Clerk.</h2>
              <SignUp fallbackRedirectUrl="/wraps" path="/sign-up" routing="path" signInUrl="/sign-in" />
            </div>
          </aside>
        </section>
      </main>
    </PublicSiteShell>
  );
}
