import { getSession } from "@/lib/auth/session";
import { getTenantStats } from "@/lib/admin/fetchers/get-tenant-stats";
import { getUsersForTenant } from "@/lib/admin/fetchers/get-users";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RoleBadge } from "@/components/admin/role-badge";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [stats, members] = await Promise.all([
    getTenantStats(session.tenantId!),
    getUsersForTenant(session.tenantId!),
  ]);

  // Recent members (up to 5) for quick overview
  const recentMembers = members.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Overview of your business metrics and team
        </p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Overview</h2>
        <DashboardStats stats={stats} />
      </section>

      {/* Team Preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team</h2>
          <Link
            href="/admin/team"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            View all →
          </Link>
        </div>

        <div className="rounded-lg border bg-white dark:bg-neutral-900">
          {recentMembers.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-400">
              No team members yet.
            </p>
          ) : (
            <ul className="divide-y dark:divide-neutral-800">
              {recentMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {member.email}
                    </p>
                  </div>
                  <RoleBadge role={member.role} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/team"
            className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:border-neutral-400 dark:bg-neutral-900 dark:hover:border-neutral-600"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Manage Team
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                View members and manage roles
              </p>
            </div>
          </Link>

          {session.role === "OWNER" && (
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:border-neutral-400 dark:bg-neutral-900 dark:hover:border-neutral-600"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Business Settings
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Update your business profile
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
