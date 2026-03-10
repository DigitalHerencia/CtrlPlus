import type { LucideIcon } from "lucide-react";
import { CalendarDays, CreditCard, Grid3x3, ImageIcon, ShieldCheck } from "lucide-react";

export type TenantNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type TenantNavGroup = {
  label: string;
  items: TenantNavItem[];
};

export const tenantNavGroups: TenantNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Catalog", href: "/catalog", icon: Grid3x3 },
      { title: "Visualizer", href: "/visualizer", icon: ImageIcon },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Scheduling", href: "/scheduling", icon: CalendarDays },
      { title: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    label: "Admin",
    items: [{ title: "Admin", href: "/admin", icon: ShieldCheck }],
  },
];

export function isTenantNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
