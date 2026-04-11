/**
 * @introduction Constants — TODO: short one-line summary of permissions.ts
 *
 * @description TODO: longer description for permissions.ts. Keep it short — one or two sentences.
 * Domain: constants
 * Public: TODO (yes/no)
 */
/**
 * GLOBAL_ROLE_VALUES — TODO: brief description.
 */
export const GLOBAL_ROLE_VALUES = ['customer', 'owner', 'admin'] as const

/**
 * CAPABILITY_VALUES — TODO: brief description.
 */
export const CAPABILITY_VALUES = [
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
] as const
