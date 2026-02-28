import type { ReactNode } from 'react';

import { AppProviders } from '../providers/app-providers';
import { TenantNav } from '../nav/tenant-nav';

type TenantShellProps = {
  readonly children: ReactNode;
};

export function TenantShell({ children }: TenantShellProps) {
  return (
    <AppProviders>
      <div className='min-h-screen bg-[color:var(--surface-background)]'>
        <TenantNav />
        {children}
      </div>
    </AppProviders>
  );
}
