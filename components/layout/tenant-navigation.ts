import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CalendarPlus2,
  ClipboardList,
  CreditCard,
  Grid3x3,
  ImageIcon,
  Settings2,
  ShieldCheck,
  Users2,
} from "lucide-react";

export type TenantNavigationChild = {
  title: string;
  href: string;
  description?: string;
};

export type TenantNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  detailTitle?: string;
  detailDescription?: string;
  children?: TenantNavigationChild[];
};

export type TenantNavigationGroup = {
  label: string;
  items: TenantNavigationItem[];
};

export type TenantRouteContext = {
  sectionLabel: string;
  title: string;
  description: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
};

export const tenantNavigation: TenantNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Catalog",
        href: "/catalog",
        icon: Grid3x3,
        description: "Browse wraps, compare finishes, and keep your product catalog moving.",
        detailTitle: "Wrap Details",
        detailDescription:
          "Review wrap details, pricing, and media before you update availability.",
      },
      {
        title: "Visualizer",
        href: "/visualizer",
        icon: ImageIcon,
        description: "Preview wrap concepts and refine visual direction before production starts.",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Scheduling",
        href: "/scheduling",
        icon: CalendarDays,
        description:
          "Manage consultations, installation windows, and booking activity in one place.",
        children: [
          {
            title: "Bookings",
            href: "/scheduling/bookings",
            description: "Track booked jobs, statuses, and customer scheduling activity.",
          },
          {
            title: "Book Appointment",
            href: "/scheduling/book",
            description: "Create a new customer booking from the tenant workspace.",
          },
        ],
      },
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
        description:
          "Monitor invoices, payment activity, and the financial state of tenant projects.",
        detailTitle: "Invoice Details",
        detailDescription:
          "Inspect invoice details, payment state, and billing history for a project.",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Admin",
        href: "/admin",
        icon: ShieldCheck,
        description: "Control tenant settings, team access, and operational guardrails.",
        children: [
          {
            title: "Team",
            href: "/admin/team",
            description: "Manage tenant members, roles, and access boundaries.",
          },
          {
            title: "Settings",
            href: "/admin/settings",
            description: "Update tenant identity, configuration, and operational defaults.",
          },
        ],
      },
    ],
  },
];

function isPathMatch(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function formatSegmentLabel(segment: string) {
  if (!segment) return "Overview";

  if (/^[0-9a-f]{8,}$/i.test(segment)) {
    return "Details";
  }

  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isTenantNavItemActive(pathname: string, item: TenantNavigationItem) {
  return isPathMatch(pathname, item.href);
}

export function isTenantNavChildActive(pathname: string, child: TenantNavigationChild) {
  return isPathMatch(pathname, child.href);
}

export function getTenantRouteContext(pathname: string): TenantRouteContext {
  for (const group of tenantNavigation) {
    for (const item of group.items) {
      if (!isTenantNavItemActive(pathname, item)) {
        continue;
      }

      const activeChild = item.children?.find((child) => isTenantNavChildActive(pathname, child));

      if (activeChild) {
        return {
          sectionLabel: group.label,
          title: activeChild.title,
          description: activeChild.description ?? item.description,
          breadcrumbs: [
            { label: group.label },
            { label: item.title, href: item.href },
            { label: activeChild.title },
          ],
        };
      }

      if (pathname !== item.href) {
        const trailingSegments = pathname
          .replace(item.href, "")
          .split("/")
          .filter(Boolean)
          .map((segment) => ({
            label: formatSegmentLabel(segment),
          }));

        return {
          sectionLabel: group.label,
          title: item.detailTitle ?? item.title,
          description: item.detailDescription ?? item.description,
          breadcrumbs: [
            { label: group.label },
            { label: item.title, href: item.href },
            ...trailingSegments,
          ],
        };
      }

      return {
        sectionLabel: group.label,
        title: item.title,
        description: item.description,
        breadcrumbs: [{ label: group.label }, { label: item.title }],
      };
    }
  }

  return {
    sectionLabel: "Workspace",
    title: "Tenant Workspace",
    description: "Manage your catalog, projects, billing, and team operations from one place.",
    breadcrumbs: [{ label: "Workspace" }, { label: "Overview" }],
  };
}

export const tenantNavigationActionIcons = {
  bookings: ClipboardList,
  book: CalendarPlus2,
  team: Users2,
  settings: Settings2,
};
