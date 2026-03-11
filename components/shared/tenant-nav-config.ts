import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CreditCard,
  Grid3x3,
  ImageIcon,
  Settings,
  ShieldCheck,
  TerminalIcon,
} from "lucide-react";

export type TenantNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  access?: "owner_dashboard" | "admin_dashboard";
};

export const tenantNavItems: TenantNavItem[] = [
  { title: "Catalog", href: "/catalog", icon: Grid3x3 },
  { title: "Visualizer", href: "/visualizer", icon: ImageIcon },
  { title: "Scheduling", href: "/scheduling", icon: CalendarDays },
  { title: "Billing", href: "/billing", icon: CreditCard },
  { title: "Website Settings", href: "/settings", icon: Settings },
  { title: "Owner Dashboard", href: "/admin", icon: ShieldCheck, access: "owner_dashboard" },
  { title: "Admin Console", href: "/platform", icon: TerminalIcon, access: "admin_dashboard" },
];

export function isTenantNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
