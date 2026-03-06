import { WrapDetail } from "@/components/catalog/WrapDetail";
import { getSession } from "@/lib/auth/session";
import { getWrapById } from "@/lib/catalog/fetchers/get-wraps";
import { notFound, redirect } from "next/navigation";

interface WrapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WrapDetailPage({ params }: WrapDetailPageProps) {
  const { tenantId, userId } = await getSession();

  if (!userId) {
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
