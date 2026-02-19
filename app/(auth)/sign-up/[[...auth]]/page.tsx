import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';

const signUpBenefits = [
  'Start with high-impact wrap discovery and visual previews.',
  'Save choices and continue through scheduling when ready.',
  'Complete secure checkout with clear booking confirmation.'
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
            <p className="eyebrow">Get Started</p>
            <h1 className="auth-card__title">Create your CTRL+ account and launch your first wrap flow.</h1>
            <p className="auth-card__description">
              Sign up once to unlock the full conversion journey from browse and visualize to
              schedule and secure payment.
            </p>

            <ul className="auth-card__list">
              {signUpBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <div className="auth-card__actions">
              <Link className="button button--primary" href="/features">
                Explore Features First
              </Link>
              <Link className="button button--ghost" href="/contact">
                Talk to the Team
              </Link>
            </div>

            <p className="auth-card__support">
              Already have an account?{' '}
              <Link className="inline-link" href="/sign-in">
                Sign in now
              </Link>
            </p>
          </article>

          <aside className="card auth-panel">
            <div className="auth-panel__content">
              <p className="eyebrow">Why Sign Up</p>
              <h2>Create your account with Clerk.</h2>
              <SignUp fallbackRedirectUrl="/wraps" path="/sign-up" routing="path" signInUrl="/sign-in" />
            </div>
          </aside>
        </section>
      </main>
    </PublicSiteShell>
  );
}
