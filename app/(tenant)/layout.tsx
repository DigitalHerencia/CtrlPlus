import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect("/sign-in");
  }

  const isAdmin = session.role === "OWNER" || session.role === "ADMIN";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-neutral-900">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/catalog"
              className="flex items-center gap-2 font-bold text-xl"
            >
              CTRL+
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/catalog"
                className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Catalog
              </Link>
              <Link
                href="/visualizer"
                className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Visualizer
              </Link>
              <Link
                href="/scheduling"
                className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Scheduling
              </Link>
              <Link
                href="/billing"
                className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Billing
              </Link>
              {/* Admin link: visible only to OWNER and ADMIN roles */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:inline">
              {session.tenantSlug ?? session.tenantId}
            </span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">{children}</main>
    </div>
  );
}
