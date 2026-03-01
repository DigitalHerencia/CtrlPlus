import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';

type UserMenuProps = {
  readonly dashboardHref?: string;
};

export function UserMenu({ dashboardHref = '/catalog/wraps' }: UserMenuProps) {
  return (
    <SignedIn>
      <div className='flex items-center gap-2'>
        <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={dashboardHref}>
          Dashboard
        </Link>
        <SignOutButton>
          <Button size='sm' variant='ghost'>
            Sign out
          </Button>
        </SignOutButton>
        <UserButton afterSignOutUrl='/' />
      </div>
    </SignedIn>
  );
}
