import Link from 'next/link';

import { buttonVariants } from '../../ui';
import { UserMenu } from '../auth/user-menu';

export function TenantNav() {
  return (
    <header className='sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--surface-card)]/95 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6'>
        <nav aria-label='Tenant navigation' className='flex items-center gap-2'>
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href='/operations/admin'>
            Dashboard
          </Link>
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href='/catalog/wraps'>
            Wraps
          </Link>
        </nav>
        <UserMenu dashboardHref='/operations/admin' />
      </div>
    </header>
  );
}
