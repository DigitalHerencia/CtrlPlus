import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | CTRL+",
    default: "CTRL+",
  },
  description: "Vehicle wrap management platform",
};

const NAV_LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/scheduling", label: "Scheduling" },
  { href: "/billing", label: "Billing" },
] as const;

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
          >
            CTRL+
          </Link>

          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">{children}</main>
    </div>
  );
}
