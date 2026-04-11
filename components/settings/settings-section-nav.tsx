/**
 * @introduction Components — TODO: short one-line summary of settings-section-nav.tsx
 *
 * @description TODO: longer description for settings-section-nav.tsx. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface SettingsSectionNavProps {
    active?: 'profile' | 'account' | 'data' | 'docs'
}

const navItems = [
    { key: 'profile', href: '/settings/profile', label: 'Profile' },
    { key: 'account', href: '/settings/account', label: 'Account' },
    { key: 'data', href: '/settings/data', label: 'Data Export' },
    { key: 'docs', href: '/docs', label: 'Documentation' },
] as const

/**
 * SettingsSectionNav — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function SettingsSectionNav({ active }: SettingsSectionNavProps) {
    return (
        <nav className="flex flex-wrap gap-2" aria-label="Settings sections">
            {navItems.map((item) => (
                <Button
                    key={item.key}
                    asChild
                    size="sm"
                    variant={active === item.key ? 'default' : 'outline'}
                >
                    <Link href={item.href}>{item.label}</Link>
                </Button>
            ))}
        </nav>
    )
}
