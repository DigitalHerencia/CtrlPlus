import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In | CTRL+',
    description: 'Sign in to your CTRL+ account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children
}
