import Link from 'next/link';

import { buttonVariants } from '../../ui';

export function AuthCta() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3'>
      <Link className={buttonVariants()} href='/sign-up'>
        Create account
      </Link>
      <Link className={buttonVariants({ variant: 'outline' })} href='/sign-in'>
        Sign in
      </Link>
    </div>
  );
}
