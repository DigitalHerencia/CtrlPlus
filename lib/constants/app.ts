/**
 * @introduction Constants — TODO: short one-line summary of app.ts
 *
 * @description TODO: longer description for app.ts. Keep it short — one or two sentences.
 * Domain: constants
 * Public: TODO (yes/no)
 */
/**
 * APP_NAME — TODO: brief description.
 */
export const APP_NAME = 'CtrlPlus'

/**
 * DEFAULT_POST_AUTH_REDIRECT — TODO: brief description.
 */
export const DEFAULT_POST_AUTH_REDIRECT = '/catalog'
/**
 * DEFAULT_STORE_TIMEZONE — TODO: brief description.
 */
export const DEFAULT_STORE_TIMEZONE = process.env.DEFAULT_STORE_TIMEZONE ?? 'America/Denver'

/**
 * DEFAULT_PAGE — TODO: brief description.
 */
export const DEFAULT_PAGE = 1
/**
 * DEFAULT_PAGE_SIZE — TODO: brief description.
 */
export const DEFAULT_PAGE_SIZE = 20
/**
 * MAX_PAGE_SIZE — TODO: brief description.
 */
export const MAX_PAGE_SIZE = 100

/**
 * WEBHOOK_STALE_THRESHOLD_MINUTES — TODO: brief description.
 */
export const WEBHOOK_STALE_THRESHOLD_MINUTES = 5
/**
 * RECENT_WEBHOOK_FAILURE_LIMIT — TODO: brief description.
 */
export const RECENT_WEBHOOK_FAILURE_LIMIT = 25

/**
 * WRAP_SORT_BY_VALUES — TODO: brief description.
 */
export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

/**
 * APP_ROUTES — TODO: brief description.
 */
export const APP_ROUTES = {
    home: '/',
    catalog: '/catalog',
    catalogManage: '/catalog/manage',
    visualizer: '/visualizer',
    scheduling: '/scheduling',
    schedulingBook: '/scheduling/new',
    schedulingBookings: '/scheduling',
    schedulingManage: '/scheduling/manage',
    billing: '/billing',
    platform: '/platform',
    signIn: '/sign-in',
    signUp: '/sign-up',
} as const

/**
 * SCHEDULING_REVALIDATION_PATHS — TODO: brief description.
 */
export const SCHEDULING_REVALIDATION_PATHS = [
    APP_ROUTES.scheduling,
    APP_ROUTES.schedulingBook,
    APP_ROUTES.schedulingManage,
] as const
