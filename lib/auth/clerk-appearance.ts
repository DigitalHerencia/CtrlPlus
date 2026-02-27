import { ClerkProvider } from '@clerk/nextjs';
import type { ComponentProps } from 'react';

export const appearance = {
  variables: {
    colorBackground: '#0E1A3A',
    colorText: '#F8F9FB',
    colorInputBackground: '#10254A',
    colorPrimary: '#1F46E0'
  },
  elements: {
    card: 'rounded-[18px] border border-[rgba(216,219,244,0.25)] bg-[#10254a] shadow-[0_24px_54px_rgba(2,10,28,0.45)]',
    formButtonPrimary:
      'rounded-full border border-[#1234B5] bg-[#1F46E0] text-[#F8F9FB] transition hover:bg-[#1234B5] focus-visible:ring-2 focus-visible:ring-[#D8DBF4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10254A]',
    socialButtonsBlockButton:
      'rounded-full border border-[rgba(216,219,244,0.25)] bg-[#102952] text-[#F8F9FB] transition hover:border-[#1F46E0] hover:bg-[#162c53] focus-visible:ring-2 focus-visible:ring-[#D8DBF4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10254A]',
    footerActionLink: 'font-semibold text-[#D8DBF4] underline-offset-4 hover:text-[#F8F9FB] hover:underline'
  }
} satisfies NonNullable<ComponentProps<typeof ClerkProvider>['appearance']>;
