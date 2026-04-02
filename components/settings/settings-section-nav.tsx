import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface SettingsSectionNavProps {
    active: 'profile' | 'account' | 'data'
}

const navItems = [
    { key: 'profile', href: '/settings/profile', label: 'Profile' },
    { key: 'account', href: '/settings/account', label: 'Account' },
    { key: 'data', href: '/settings/data', label: 'Data Export' },
] as const

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
