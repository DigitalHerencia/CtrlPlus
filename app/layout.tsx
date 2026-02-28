import type { ReactNode } from 'react';

type PublicLayoutProps = {
  readonly children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return children;
}
