import type { ReactNode } from 'react';

type AppProvidersProps = {
  readonly children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
