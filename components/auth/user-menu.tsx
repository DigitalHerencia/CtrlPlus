import Link from 'next/link';

import type { AuthenticatedUser } from '../../lib/server/auth/require-auth';

export interface UserMenuProps {
  readonly user: AuthenticatedUser;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <section aria-label="User menu">
      <p>Signed in as {user.email}</p>
      <p>User ID: {user.userId}</p>
      <nav>
        <Link href="/">Dashboard</Link>
      </nav>
    </section>
  );
}
