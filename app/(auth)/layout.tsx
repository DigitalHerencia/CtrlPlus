import type { ReactNode } from 'react';

import { AuthShell } from '../../components/shared-ui/layout/auth-shell';
import { PublicSiteShell } from '../../components/shared-ui/layout/public-site-shell';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicSiteShell activePath='/sign-in' variant='auth'>
      <AuthShell>{children}</AuthShell>
    </PublicSiteShell>
  );
}
