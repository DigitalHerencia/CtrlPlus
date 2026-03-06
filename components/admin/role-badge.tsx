import { Badge } from "@/components/ui/badge";
import { type TenantRole } from "@/lib/tenancy/types";

export const ROLE_LABELS: Record<TenantRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

const ROLE_VARIANTS: Record<TenantRole, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
};

interface RoleBadgeProps {
  role: TenantRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return <Badge variant={ROLE_VARIANTS[role]}>{ROLE_LABELS[role]}</Badge>;
}
