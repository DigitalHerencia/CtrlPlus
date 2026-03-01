import type { ReactNode } from 'react';

import { TenantShell } from '../../components/shared/layout/tenant-shell';

type TenantLayoutProps = {
  readonly children: ReactNode;
};

export default function TenantLayout({ children }: TenantLayoutProps) {
  return <TenantShell>{children}</TenantShell>;
}
