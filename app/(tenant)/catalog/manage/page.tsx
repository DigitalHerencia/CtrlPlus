import Link from "next/link";

import { CatalogManager } from "@/components/catalog/CatalogManager";
import { WorkspacePageIntro } from "@/components/shared/tenant-elements";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { hasCapability } from "@/lib/authz/policy";
import { getWrapCategories } from "@/lib/catalog/fetchers/get-wrap-categories";
import { getWraps } from "@/lib/catalog/fetchers/get-wraps";
import { redirect } from "next/navigation";

export default async function CatalogManagerPage() {
  const session = await getSession();

  if (!session.isAuthenticated || !session.userId) {
    redirect("/sign-in");
  }

  if (!hasCapability(session.authz, "catalog.manage")) {
    redirect("/catalog");
  }

  const [wraps, categories] = await Promise.all([
    getWraps({ includeHidden: true }),
    getWrapCategories(),
  ]);

  return (
    <div className="space-y-6">
      <WorkspacePageIntro
        label="Catalog"
        title="Catalog Manager"
        description="Create wraps, manage categories, and keep image-role metadata aligned for visualizer readiness."
      />

      <div className="flex justify-end">
        <Button asChild variant="outline" className="border-neutral-700 text-neutral-100">
          <Link href="/catalog">Back to Catalog</Link>
        </Button>
      </div>

      <CatalogManager wraps={wraps} categories={categories} />
    </div>
  );
}
