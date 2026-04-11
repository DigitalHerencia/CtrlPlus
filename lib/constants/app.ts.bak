export const APP_NAME = 'CtrlPlus'

export const DEFAULT_POST_AUTH_REDIRECT = '/catalog'
export const DEFAULT_STORE_TIMEZONE = process.env.DEFAULT_STORE_TIMEZONE ?? 'America/Denver'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const WEBHOOK_STALE_THRESHOLD_MINUTES = 5
export const RECENT_WEBHOOK_FAILURE_LIMIT = 25

export const WRAP_SORT_BY_VALUES = {
    name: 'name',
    price: 'price',
    createdAt: 'createdAt',
} as const

export const APP_ROUTES = {
    home: '/',
    catalog: '/catalog',
    catalogManage: '/catalog/manage',
    visualizer: '/visualizer',
    scheduling: '/scheduling',
    schedulingBook: '/scheduling/book',
    schedulingBookings: '/scheduling/bookings',
    billing: '/billing',
    platform: '/platform',
    signIn: '/sign-in',
    signUp: '/sign-up',
} as const

export const SCHEDULING_REVALIDATION_PATHS = [
    APP_ROUTES.scheduling,
    APP_ROUTES.schedulingBook,
    APP_ROUTES.schedulingBookings,
] as const
