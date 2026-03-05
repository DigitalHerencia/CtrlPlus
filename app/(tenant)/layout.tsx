import { getSession } from "@/lib/auth/session";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  // Require authentication for tenant routes
  const { isAuthenticated } = await getSession();

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  // TODO: If no tenant, redirect to tenant creation/selection flow

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-neutral-900">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="flex items-center gap-2">
              <div className="font-bold text-xl">CTRL+</div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
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
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Admin
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </header>

      <main className="container py-6 px-4">{children}</main>
    </div>
  );
}
