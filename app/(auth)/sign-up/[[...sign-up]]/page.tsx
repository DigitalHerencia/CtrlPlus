import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

import { buttonVariants } from '../../../../components/ui/button';
import {
  AuthFormPanel,
  AuthMarketingPanel,
  AuthPageFrame,
} from '../../../../components/auth/auth-panels';

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
    <AuthPageFrame reverse>
      <AuthMarketingPanel
        actions={
          <>
            <Link className={buttonVariants()} href='/features'>
              Explore Features
            </Link>
            <Link className={buttonVariants({ variant: 'outline' })} href='/contact'>
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
            <Link className={buttonVariants({ variant: 'link' })} href='/sign-in'>
              Sign in
            </Link>
          </>
        }
        title={signUpContent.title}
      />

      <AuthFormPanel eyebrow='Account Setup' title='Create your account with Clerk.'>
        <SignUp fallbackRedirectUrl='/catalog/wraps' path='/sign-up' routing='path' signInUrl='/sign-in' />
      </AuthFormPanel>
    </AuthPageFrame>
  );
}
