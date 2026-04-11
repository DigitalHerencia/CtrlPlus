/**
 * @introduction Authz — TODO: short one-line summary of capabilities.ts
 *
 * @description TODO: longer description for capabilities.ts. Keep it short — one or two sentences.
 * Domain: authz
 * Public: TODO (yes/no)
 */
import { type Capability, type GlobalRole } from '@/types/auth.types'

/**
 * ROLE_CAPABILITIES — TODO: brief description.
 */
export const ROLE_CAPABILITIES: Record<GlobalRole, Set<Capability>> = {
    customer: new Set<Capability>([
        'catalog.read',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.write.own',
        'billing.read.own',
        'billing.write.own',
        'settings.manage.own',
    ]),
    owner: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
    ]),
    admin: new Set<Capability>([
        'catalog.read',
        'catalog.manage',
        'visualizer.use',
        'visualizer.manage',
        'scheduling.read.own',
        'scheduling.read.all',
        'scheduling.write.own',
        'scheduling.write.all',
        'billing.read.own',
        'billing.read.all',
        'billing.write.own',
        'billing.write.all',
        'settings.manage.own',
        'dashboard.owner',
        'dashboard.platform',
        'platform.webhook.ops',
        'platform.database.ops',
    ]),
}
