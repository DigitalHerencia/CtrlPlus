import { WrapDetail } from "@/components/catalog/WrapDetail";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getWrapById } from "@/lib/catalog/fetchers/get-wraps";
import { notFound, redirect } from "next/navigation";

interface WrapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WrapDetailPage({ params }: WrapDetailPageProps) {
  const session = await getSession();

  if (!session.userId) {
    redirect("/sign-in"); // Only redirect if not authenticated
  }

  const { id } = await params;
  const canManageCatalog = hasCapability(session.authz, "catalog.manage");

  const wrap = await getWrapById(id, { includeHidden: canManageCatalog });

  if (!wrap) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <WrapDetail wrap={wrap} canManageCatalog={canManageCatalog} />
    </div>
  );
}
