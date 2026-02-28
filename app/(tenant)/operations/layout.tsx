import type { ReactNode } from 'react';

type OperationsLayoutProps = {
  readonly children: ReactNode;
};

export default function OperationsLayout({ children }: OperationsLayoutProps) {
  return children;
}
