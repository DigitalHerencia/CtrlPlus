import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

import { PublicSiteShell } from '../../../../components/public/public-site-shell';
import { AuthFormPanel, AuthMarketingPanel, AuthShell } from '../../../../features/auth/presentation/auth-shell';

const signUpContent = {
  eyebrow: 'Sign Up',
  title: 'Create your CTRL+ account.',
  description:
    'Sign up once to unlock the complete journey from wrap discovery and visual previews to scheduling and payment.',
  highlights: [
    'Browse wraps and save options in one place.',
    'Launch previews quickly with upload and template-based visualizer flows.',
    'Schedule installation and complete secure checkout with clear confirmation.'
  ]
};

export const metadata: Metadata = {
  title: 'Sign Up'
};

export default function SignUpPage() {
  return (
    <PublicSiteShell activePath="/sign-up" variant="auth">
      <AuthShell reverse>
        <AuthMarketingPanel
          actions={
            <>
              <Link className="button button--primary" href="/features">
                Explore Features
              </Link>
              <Link className="button button--ghost" href="/contact">
                Contact Team
              </Link>
            </>
          }
          description={signUpContent.description}
          eyebrow={signUpContent.eyebrow}
          highlights={signUpContent.highlights}
          support={
            <>
              Already have an account?{' '}
              <Link className="inline-link" href="/sign-in">
                Sign in
              </Link>
            </>
          }
          title={signUpContent.title}
        />

        <AuthFormPanel eyebrow="Account Setup" title="Create your account with Clerk.">
          <SignUp fallbackRedirectUrl="/wraps" path="/sign-up" routing="path" signInUrl="/sign-in" />
        </AuthFormPanel>
      </AuthShell>
    </PublicSiteShell>
  );
}
