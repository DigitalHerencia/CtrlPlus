import type { LucideIcon } from "lucide-react";
import { CalendarDays, CreditCard, Grid3x3, ImageIcon, ShieldCheck } from "lucide-react";

export type WorkspaceNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  access?: "owner_dashboard" | "admin_dashboard";
};

export type WorkspaceNavGroup = {
  label: string;
  items: WorkspaceNavItem[];
};

export const workspaceNavGroups: WorkspaceNavGroup[] = [
  {
    label: "Customer",
    items: [
      { title: "Catalog", href: "/catalog", icon: Grid3x3 },
      { title: "Visualizer", href: "/visualizer", icon: ImageIcon },
      { title: "Scheduling", href: "/scheduling", icon: CalendarDays },
      { title: "Billing", href: "/billing", icon: CreditCard },
      { title: "Website Settings", href: "/settings", icon: ShieldCheck },
    ],
  },
  {
    label: "Dashboards",
    items: [
      { title: "Owner Dashboard", href: "/admin", icon: ShieldCheck, access: "owner_dashboard" },
      { title: "Admin Console", href: "/platform", icon: ShieldCheck, access: "admin_dashboard" },
    ],
  },
];

export function isWorkspaceNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
