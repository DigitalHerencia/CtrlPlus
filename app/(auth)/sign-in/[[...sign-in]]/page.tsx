import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';
import { AuthFormPanel, AuthMarketingPanel, AuthShell } from '../../../../features/auth/presentation/auth-shell';

const signInContent = {
  eyebrow: 'Sign In',
  title: 'Welcome back to CTRL+.',
  description:
    'Continue with your email identity provider to access your account and move from design selection to confirmed booking.',
  highlights: [
    'Resume saved wrap previews and continue booking where you left off.',
    'Review upcoming drop-off and pick-up windows in one dashboard.',
    'Track invoice and payment status without leaving your account.'
  ]
};

export const metadata: Metadata = {
  title: 'Sign In'
};

export default function SignInPage() {
  return (
    <PublicSiteShell activePath="/sign-in">
      <AuthShell>
        <AuthMarketingPanel
          actions={
            <>
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/features">
                Explore Features
              </Link>
            </>
          }
          description={signInContent.description}
          eyebrow={signInContent.eyebrow}
          highlights={signInContent.highlights}
          support={
            <>
              Need an account to continue?{' '}
              <Link className="inline-link" href="/sign-up">
                Sign up
              </Link>
            </>
          }
          title={signInContent.title}
        />

        <AuthFormPanel eyebrow="Secure Access" title="Sign in with Clerk to continue.">
          <SignIn fallbackRedirectUrl="/wraps" path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </AuthFormPanel>
      </AuthShell>
    </PublicSiteShell>
  );
}
