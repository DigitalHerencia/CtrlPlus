import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

import { buttonVariants } from '../../../components/ui';
import {
  AuthFormPanel,
  AuthMarketingPanel,
  AuthPageFrame,
} from '../../../components/shared-ui/auth/auth-panels';

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
    <AuthPageFrame>
      <AuthMarketingPanel
        actions={
          <>
            <Link className={buttonVariants()} href='/sign-up'>
              Create Account
            </Link>
            <Link className={buttonVariants({ variant: 'outline' })} href='/features'>
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
            <Link className={buttonVariants({ variant: 'link' })} href='/sign-up'>
              Sign up
            </Link>
          </>
        }
        title={signInContent.title}
      />

      <AuthFormPanel eyebrow='Secure Access' title='Sign in with Clerk to continue.'>
        <SignIn fallbackRedirectUrl='/catalog/wraps' path='/sign-in' routing='path' signUpUrl='/sign-up' />
      </AuthFormPanel>
    </AuthPageFrame>
  );
}
