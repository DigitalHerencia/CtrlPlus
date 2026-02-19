import { UserButton } from '@clerk/nextjs';

export function UserMenu() {
  return (
    <section aria-label="User menu">
      <UserButton afterSignOutUrl="/" />
    </section>
  );
}
