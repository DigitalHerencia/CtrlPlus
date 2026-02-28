import type { ReactNode } from 'react';

import { PublicSiteShell } from './public-site-shell';

type PublicShellProps = {
  readonly children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return <PublicSiteShell>{children}</PublicSiteShell>;
}
