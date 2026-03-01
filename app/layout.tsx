import type { ReactNode } from 'react';
import './globals.css';

type PublicLayoutProps = {
  readonly children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
