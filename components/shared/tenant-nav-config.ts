/**
 * @introduction Components — TODO: short one-line summary of tenant-nav-config.ts
 *
 * @description TODO: longer description for tenant-nav-config.ts. Keep it short — one or two sentences.
 * Domain: components
 * Public: TODO (yes/no)
 */
import type { LucideIcon } from 'lucide-react'
import {
    CalendarDays,
    CreditCard,
    Grid3x3,
    ImageIcon,
    Settings,
    ShieldCheck,
    TerminalIcon,
} from 'lucide-react'

/**
 * TenantNavItem — TODO: brief description of this type.
 */
export type TenantNavItem = {
    title: string
    href: string
    icon: LucideIcon
    access?: 'owner_dashboard' | 'admin_dashboard'
}

/**
 * tenantNavItems — TODO: brief description.
 */
export const tenantNavItems: TenantNavItem[] = [
    { title: 'Catalog', href: '/catalog', icon: Grid3x3 },
    { title: 'Visualizer', href: '/visualizer', icon: ImageIcon },
    { title: 'Scheduling', href: '/scheduling', icon: CalendarDays },
    { title: 'Billing', href: '/billing', icon: CreditCard },
    { title: 'Website Settings', href: '/settings', icon: Settings },
    { title: 'Owner Dashboard', href: '/admin', icon: ShieldCheck, access: 'owner_dashboard' },
    { title: 'Admin Console', href: '/platform', icon: TerminalIcon, access: 'admin_dashboard' },
]

/**
 * isTenantNavActive — TODO: brief description of this function.
 * @returns TODO: describe return value
 */
export function isTenantNavActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
}
