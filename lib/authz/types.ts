export type GlobalRole = "customer" | "owner" | "admin";

export type Capability =
  | "catalog.read"
  | "catalog.manage"
  | "visualizer.use"
  | "visualizer.manage"
  | "scheduling.read.own"
  | "scheduling.read.all"
  | "scheduling.write.own"
  | "scheduling.write.all"
  | "billing.read.own"
  | "billing.read.all"
  | "billing.write.own"
  | "billing.write.all"
  | "settings.manage.own"
  | "dashboard.owner"
  | "dashboard.platform"
  | "platform.webhook.ops"
  | "platform.database.ops";

export interface AuthzContext {
  userId: string | null;
  role: GlobalRole;
  isAuthenticated: boolean;
  isOwner: boolean;
  isPlatformAdmin: boolean;
}
