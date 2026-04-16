import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'CTRL+ | Vehicle Wrap Management Platform',
    description:
        'Single-store vehicle wrap platform for catalog browsing, visualizer previews, scheduling, billing, and role-based management.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <ClerkProvider>
                    <main className="min-w-90 bg-neutral-900">{children}</main>
                </ClerkProvider>
            </body>
        </html>
    )
}
