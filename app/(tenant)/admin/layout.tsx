import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Only OWNER and ADMIN may access admin routes
  if (session.role !== "OWNER" && session.role !== "ADMIN") {
    redirect("/catalog");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/team", label: "Team" },
    // Settings restricted further to OWNER inside the settings page
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="sticky top-24 flex flex-col gap-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Admin
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
