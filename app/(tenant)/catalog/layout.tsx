import type { ReactNode } from 'react';

type CatalogLayoutProps = {
  readonly children: ReactNode;
};

export default function CatalogLayout({ children }: CatalogLayoutProps) {
  return children;
}
