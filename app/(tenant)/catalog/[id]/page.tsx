import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getWrapById } from "@/lib/catalog/fetchers/get-wraps";
import { WrapDetail } from "@/components/catalog/WrapDetail";

interface WrapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WrapDetailPage({ params }: WrapDetailPageProps) {
  const { user, tenantId } = await getSession();

  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const wrap = await getWrapById(tenantId, id);

  if (!wrap) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <WrapDetail wrap={wrap} />
    </div>
  );
}
