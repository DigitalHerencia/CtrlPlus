import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { getClerkPublishableKey } from '../lib/server/auth/clerk-config';

export const metadata: Metadata = {
  title: {
    default: 'CTRL+ Vehicle Wraps',
    template: '%s | CTRL+'
  },
  description:
    'Premium vehicle wraps, tint, and signage with a guided browse, visualize, schedule, and payment flow.'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const publishableKey = getClerkPublishableKey();

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
