import Link from "next/link";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            CTRL+
          </span>
          <div className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link
              href="/catalog"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Catalog
            </Link>
            <Link
              href="/visualizer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Visualizer
            </Link>
            <Link
              href="/scheduling"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Scheduling
            </Link>
            <Link
              href="/billing"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Billing
            </Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
