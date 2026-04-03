import type { DocPage, DocSection } from '@/docs/types'

export const DOC_SECTIONS: DocSection[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        items: [
            {
                slug: 'quick-start',
                title: 'Quick Start',
                description: 'Get productive with CTRL+ in under 15 minutes.',
            },
            {
                slug: 'account/create-account',
                title: 'Create an Account',
                description: 'Set up your account and secure your workspace.',
            },
            {
                slug: 'onboarding/walkthrough',
                title: 'Onboarding Walkthrough',
                description: 'Follow a complete first-day setup path.',
            },
        ],
    },
    {
        id: 'feature-guides',
        title: 'Feature Walkthroughs',
        items: [
            {
                slug: 'features',
                title: 'Features Overview',
                description: 'Understand how the platform modules fit together.',
            },
            {
                slug: 'features/auth',
                title: 'Authentication',
                description: 'Sign-in, account recovery, and access basics.',
            },
            {
                slug: 'features/catalog',
                title: 'Catalog',
                description: 'Browse wraps and prepare visualizer-ready selections.',
            },
            {
                slug: 'features/visualizer',
                title: 'Visualizer',
                description: 'Generate vehicle previews and manage results.',
            },
            {
                slug: 'features/scheduling',
                title: 'Scheduling',
                description: 'Book appointments and manage booking flow.',
            },
            {
                slug: 'features/billing',
                title: 'Billing',
                description: 'Invoice, payment, and checkout workflows.',
            },
            {
                slug: 'features/settings',
                title: 'Settings',
                description: 'Manage profile, account, and platform preferences.',
            },
            {
                slug: 'features/admin',
                title: 'Admin',
                description: 'Moderation, analytics, and operational controls.',
            },
            {
                slug: 'features/platform',
                title: 'Platform',
                description: 'System health, integrations, and runtime tooling.',
            },
        ],
    },
    {
        id: 'support',
        title: 'Support',
        items: [
            {
                slug: 'faq',
                title: 'FAQ',
                description: 'Answers to common user questions.',
            },
            {
                slug: 'troubleshooting',
                title: 'Troubleshooting',
                description: 'Resolve common issues quickly.',
            },
        ],
    },
]

const pages: DocPage[] = [
    {
        slug: 'quick-start',
        title: 'Quick Start',
        description: 'Launch your first CTRL+ workflow from account setup to booked project.',
        sectionId: 'getting-started',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'before-you-begin', title: 'Before you begin' },
            { id: 'step-1-account', title: 'Step 1: Create your account' },
            { id: 'step-2-profile', title: 'Step 2: Complete your profile' },
            { id: 'step-3-catalog', title: 'Step 3: Browse the catalog' },
            { id: 'step-4-preview', title: 'Step 4: Generate a visualizer preview' },
            { id: 'step-5-book', title: 'Step 5: Book and confirm' },
        ],
        content: (
            <>
                <p>
                    This quick start is designed for first-time CTRL+ users who want to go from sign
                    up to a confirmed wrap appointment in a single guided flow.
                </p>

                <h2 id="before-you-begin">Before you begin</h2>
                <ul>
                    <li>Use a modern browser (latest Chrome, Edge, Safari, or Firefox).</li>
                    <li>Have a clear photo of your vehicle ready for visualizer previews.</li>
                    <li>Use a real email address for verification and booking notifications.</li>
                </ul>

                <h2 id="step-1-account">Step 1: Create your account</h2>
                <ol>
                    <li>Open the Sign Up page from the top-right navigation.</li>
                    <li>Enter your name, email, and a secure password.</li>
                    <li>Verify your email when prompted to activate your account.</li>
                </ol>

                <h2 id="step-2-profile">Step 2: Complete your profile</h2>
                <ul>
                    <li>Add your preferred contact number.</li>
                    <li>Confirm your location and time zone for scheduling accuracy.</li>
                    <li>Review notification settings so booking updates reach you immediately.</li>
                </ul>

                <h2 id="step-3-catalog">Step 3: Browse the catalog</h2>
                <p>
                    In the Catalog area, filter by finish, style, and use case. Each wrap includes
                    key details such as visual style, estimated pricing, and visualizer
                    compatibility.
                </p>

                <h2 id="step-4-preview">Step 4: Generate a visualizer preview</h2>
                <ol>
                    <li>
                        Open a wrap detail and choose <strong>Preview in Visualizer</strong>.
                    </li>
                    <li>Upload a vehicle image or pick a previously uploaded image.</li>
                    <li>Submit generation and monitor progress until status shows complete.</li>
                </ol>

                <h2 id="step-5-book">Step 5: Book and confirm</h2>
                <p>
                    Move to Scheduling to pick an available slot, then finalize with Billing. You
                    will receive confirmation details in-app and by email.
                </p>
            </>
        ),
    },
    {
        slug: 'account/create-account',
        title: 'Create an Account',
        description:
            'Set up a secure CTRL+ account and prepare your profile for tenant-scoped workflows.',
        sectionId: 'getting-started',
        readTime: '5 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'account-requirements', title: 'Account requirements' },
            { id: 'registration-steps', title: 'Registration steps' },
            { id: 'verification', title: 'Email verification' },
            { id: 'first-login', title: 'First login checklist' },
        ],
        content: (
            <>
                <p>
                    CTRL+ uses secure authentication to protect customer data, booking records, and
                    billing operations. Follow this guide to create your account correctly the first
                    time.
                </p>

                <h2 id="account-requirements">Account requirements</h2>
                <ul>
                    <li>Unique email address you can access immediately.</li>
                    <li>
                        Strong password (recommended: 12+ characters with mixed case and symbols).
                    </li>
                    <li>Legal first and last name for invoices and appointment records.</li>
                </ul>

                <h2 id="registration-steps">Registration steps</h2>
                <ol>
                    <li>
                        Go to <strong>Sign Up</strong> from the public header.
                    </li>
                    <li>Provide your identity and contact details.</li>
                    <li>Create your password and submit the form.</li>
                    <li>Accept terms and continue to verification.</li>
                </ol>

                <h2 id="verification">Email verification</h2>
                <p>
                    Verification confirms account ownership. If the verification email is delayed,
                    check spam folders and then request a new code from the sign-up screen.
                </p>

                <h2 id="first-login">First login checklist</h2>
                <ul>
                    <li>Confirm your profile details are accurate.</li>
                    <li>Set preferred notification channels.</li>
                    <li>Open the Quick Start guide to begin your first project flow.</li>
                </ul>
            </>
        ),
    },
    {
        slug: 'onboarding/walkthrough',
        title: 'Onboarding Walkthrough',
        description: 'Complete onboarding path for new CTRL+ users and first operational setup.',
        sectionId: 'getting-started',
        readTime: '8 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'onboarding-goal', title: 'Onboarding goal' },
            { id: 'configure-profile', title: 'Configure your profile and account' },
            { id: 'prepare-assets', title: 'Prepare vehicle assets and preferences' },
            { id: 'run-first-flow', title: 'Run your first full customer flow' },
        ],
        content: (
            <>
                <p>
                    The onboarding walkthrough ensures your workspace is configured for reliable
                    previews, scheduling, and billing outcomes.
                </p>

                <h2 id="onboarding-goal">Onboarding goal</h2>
                <p>
                    By the end of onboarding, you should be able to discover wraps, preview on a
                    vehicle, reserve a slot, and complete payment using the default workflow.
                </p>

                <h2 id="configure-profile">Configure your profile and account</h2>
                <ul>
                    <li>Set your contact details and communication preferences.</li>
                    <li>Review account settings and verify identity controls.</li>
                    <li>Confirm timezone and operational hours for booking accuracy.</li>
                </ul>

                <h2 id="prepare-assets">Prepare vehicle assets and preferences</h2>
                <ul>
                    <li>Upload at least one clear side-angle vehicle image.</li>
                    <li>Save preferred wrap finishes to streamline future selection.</li>
                    <li>Review supported image quality requirements before generation.</li>
                </ul>

                <h2 id="run-first-flow">Run your first full customer flow</h2>
                <ol>
                    <li>Select a catalog wrap and launch visualizer preview.</li>
                    <li>Review generated result and compare alternatives.</li>
                    <li>Book an appointment slot and complete checkout.</li>
                    <li>Confirm status updates are delivered as expected.</li>
                </ol>
            </>
        ),
    },
    {
        slug: 'features',
        title: 'Features Overview',
        description: 'Tour the core CTRL+ modules and understand how each capability connects.',
        sectionId: 'feature-guides',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'platform-map', title: 'Platform capability map' },
            { id: 'customer-flow', title: 'Customer journey flow' },
            { id: 'operations-flow', title: 'Operations and admin flow' },
        ],
        content: (
            <>
                <p>
                    CTRL+ is organized into domain modules so each user can focus on the tasks they
                    need while maintaining a single connected workflow.
                </p>

                <h2 id="platform-map">Platform capability map</h2>
                <ul>
                    <li>
                        <strong>Authentication:</strong> Secure account access and identity
                        lifecycle.
                    </li>
                    <li>
                        <strong>Catalog:</strong> Wrap discovery, product detail, and selection
                        pipeline.
                    </li>
                    <li>
                        <strong>Visualizer:</strong> AI-assisted preview generation from uploaded
                        vehicle images.
                    </li>
                    <li>
                        <strong>Scheduling:</strong> Appointment booking, slot management, and
                        updates.
                    </li>
                    <li>
                        <strong>Billing:</strong> Invoice and payment workflows.
                    </li>
                    <li>
                        <strong>Settings/Admin/Platform:</strong> User controls, moderation, health,
                        and diagnostics.
                    </li>
                </ul>

                <h2 id="customer-flow">Customer journey flow</h2>
                <p>
                    A standard customer journey is: sign in → browse wraps → generate preview → book
                    appointment → pay invoice → track completion.
                </p>

                <h2 id="operations-flow">Operations and admin flow</h2>
                <p>
                    Team and admin users can monitor moderation queues, operational metrics, and
                    platform health while maintaining secure tenant-scoped controls.
                </p>
            </>
        ),
    },
    {
        slug: 'features/auth',
        title: 'Authentication',
        description: 'Manage sign-in, sign-up, verification, and account recovery in CTRL+.',
        sectionId: 'feature-guides',
        readTime: '5 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'auth-overview', title: 'Authentication overview' },
            { id: 'sign-in-flow', title: 'Sign-in flow' },
            { id: 'sign-up-flow', title: 'Sign-up flow' },
            { id: 'account-recovery', title: 'Account recovery and support' },
        ],
        content: (
            <>
                <h2 id="auth-overview">Authentication overview</h2>
                <p>
                    Authentication secures all protected workflows and ensures only authorized users
                    can access tenant-scoped resources.
                </p>

                <h2 id="sign-in-flow">Sign-in flow</h2>
                <ul>
                    <li>Use verified credentials on the Sign In page.</li>
                    <li>Authenticated users are redirected to core workspace routes.</li>
                    <li>Session expiration requires a fresh login for security.</li>
                </ul>

                <h2 id="sign-up-flow">Sign-up flow</h2>
                <p>
                    New users register through the public sign-up page, verify ownership, and then
                    continue into onboarding.
                </p>

                <h2 id="account-recovery">Account recovery and support</h2>
                <p>
                    If you lose access, use built-in recovery options and verify your email before
                    retrying. If recovery fails repeatedly, contact platform support with timestamp
                    and account email.
                </p>
            </>
        ),
    },
    {
        slug: 'features/catalog',
        title: 'Catalog',
        description:
            'Explore wrap offerings, compare options, and prepare preview-ready selections.',
        sectionId: 'feature-guides',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'catalog-goals', title: 'Catalog goals' },
            { id: 'browse-filter', title: 'Browse and filter wraps' },
            { id: 'detail-pages', title: 'Wrap detail pages' },
            { id: 'handoff-to-visualizer', title: 'Handoff to visualizer' },
        ],
        content: (
            <>
                <h2 id="catalog-goals">Catalog goals</h2>
                <p>
                    The catalog is the source of truth for wrap discovery and selection. Users can
                    quickly evaluate style, finish, and compatibility before previewing.
                </p>

                <h2 id="browse-filter">Browse and filter wraps</h2>
                <ul>
                    <li>Sort by style, finish, or business use case.</li>
                    <li>Review pricing context and availability signals.</li>
                    <li>Compare wraps before committing to preview generation.</li>
                </ul>

                <h2 id="detail-pages">Wrap detail pages</h2>
                <p>
                    Detail pages provide a deeper view with hero assets, gallery images, and
                    visualizer-ready texture references.
                </p>

                <h2 id="handoff-to-visualizer">Handoff to visualizer</h2>
                <p>
                    Use the visualizer handoff action to carry the selected wrap into preview
                    generation while preserving the wrap context.
                </p>
            </>
        ),
    },
    {
        slug: 'features/visualizer',
        title: 'Visualizer',
        description: 'Generate and review AI-powered concept previews for selected wraps.',
        sectionId: 'feature-guides',
        readTime: '7 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'preview-lifecycle', title: 'Preview lifecycle' },
            { id: 'upload-best-practices', title: 'Upload best practices' },
            { id: 'generation-status', title: 'Generation status and outcomes' },
            { id: 'using-results', title: 'Using preview results' },
        ],
        content: (
            <>
                <h2 id="preview-lifecycle">Preview lifecycle</h2>
                <p>
                    Preview jobs move through a clear lifecycle: <strong>pending</strong>,{' '}
                    <strong>processing</strong>, <strong>complete</strong>, or{' '}
                    <strong>failed</strong>.
                </p>

                <h2 id="upload-best-practices">Upload best practices</h2>
                <ul>
                    <li>Use a high-resolution photo with even lighting.</li>
                    <li>Capture side angle views where body lines are visible.</li>
                    <li>Avoid heavy reflections, severe shadows, or strong motion blur.</li>
                </ul>

                <h2 id="generation-status">Generation status and outcomes</h2>
                <p>
                    Preview status and timestamps help you track generation reliability. Failed
                    previews can be retried after adjusting source image quality.
                </p>

                <h2 id="using-results">Using preview results</h2>
                <p>
                    Use completed previews for internal review and customer collaboration, then
                    continue to scheduling once design direction is confirmed.
                </p>
            </>
        ),
    },
    {
        slug: 'features/scheduling',
        title: 'Scheduling',
        description: 'Book appointments, manage availability, and keep installs on track.',
        sectionId: 'feature-guides',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'booking-overview', title: 'Booking overview' },
            { id: 'book-appointment', title: 'Create a booking' },
            { id: 'manage-bookings', title: 'Manage existing bookings' },
            { id: 'status-lifecycle', title: 'Booking status lifecycle' },
        ],
        content: (
            <>
                <h2 id="booking-overview">Booking overview</h2>
                <p>
                    Scheduling helps coordinate wrap installs by connecting customer preference,
                    slot availability, and downstream billing workflows.
                </p>

                <h2 id="book-appointment">Create a booking</h2>
                <ol>
                    <li>Select date and time from available slots.</li>
                    <li>Confirm vehicle details and selected wrap context.</li>
                    <li>Submit booking and verify confirmation details.</li>
                </ol>

                <h2 id="manage-bookings">Manage existing bookings</h2>
                <ul>
                    <li>Edit or reschedule from booking detail pages.</li>
                    <li>Track status updates and communication history.</li>
                    <li>Coordinate changes with billing when needed.</li>
                </ul>

                <h2 id="status-lifecycle">Booking status lifecycle</h2>
                <p>
                    Keep bookings moving through planned, confirmed, in-progress, and completed
                    states to maintain operational clarity.
                </p>
            </>
        ),
    },
    {
        slug: 'features/billing',
        title: 'Billing',
        description: 'Issue invoices, process payments, and manage transaction follow-up safely.',
        sectionId: 'feature-guides',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'billing-overview', title: 'Billing overview' },
            { id: 'invoice-lifecycle', title: 'Invoice lifecycle' },
            { id: 'payment-flow', title: 'Payment flow' },
            { id: 'refund-adjustments', title: 'Refund and adjustment handling' },
        ],
        content: (
            <>
                <h2 id="billing-overview">Billing overview</h2>
                <p>
                    Billing centralizes invoice generation and payment collection for scheduled wrap
                    projects.
                </p>

                <h2 id="invoice-lifecycle">Invoice lifecycle</h2>
                <ul>
                    <li>Create invoice with service and pricing details.</li>
                    <li>Send or present payment link to customer.</li>
                    <li>Track status changes until paid or adjusted.</li>
                </ul>

                <h2 id="payment-flow">Payment flow</h2>
                <p>
                    Payment processing is integrated for secure checkout and immediate billing state
                    updates in the workspace.
                </p>

                <h2 id="refund-adjustments">Refund and adjustment handling</h2>
                <p>
                    Authorized users can apply adjustments or initiate refunds from invoice detail
                    views when required by service changes.
                </p>
            </>
        ),
    },
    {
        slug: 'features/settings',
        title: 'Settings',
        description: 'Control user profile, account preferences, and operational defaults.',
        sectionId: 'feature-guides',
        readTime: '4 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'profile-settings', title: 'Profile settings' },
            { id: 'account-preferences', title: 'Account preferences' },
            { id: 'data-management', title: 'Data and export management' },
        ],
        content: (
            <>
                <h2 id="profile-settings">Profile settings</h2>
                <p>
                    Keep identity and contact information current to avoid missed scheduling and
                    billing notifications.
                </p>

                <h2 id="account-preferences">Account preferences</h2>
                <ul>
                    <li>Notification channels and communication preferences.</li>
                    <li>Security and account management controls.</li>
                    <li>Personal workflow defaults for recurring tasks.</li>
                </ul>

                <h2 id="data-management">Data and export management</h2>
                <p>
                    Use data settings for exports, history visibility, and account-level data
                    governance tasks.
                </p>
            </>
        ),
    },
    {
        slug: 'features/admin',
        title: 'Admin',
        description:
            'Use admin capabilities for moderation, analytics, and platform-level operations.',
        sectionId: 'feature-guides',
        readTime: '7 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'admin-overview', title: 'Admin overview' },
            { id: 'moderation', title: 'Moderation queue and actions' },
            { id: 'analytics', title: 'Analytics and KPI monitoring' },
            { id: 'audit-operations', title: 'Audit and operational controls' },
        ],
        content: (
            <>
                <h2 id="admin-overview">Admin overview</h2>
                <p>
                    Admin surfaces are designed for trusted users responsible for platform integrity
                    and operational performance.
                </p>

                <h2 id="moderation">Moderation queue and actions</h2>
                <p>
                    Review and act on queued items through structured moderation actions to keep
                    catalog and user-facing content compliant.
                </p>

                <h2 id="analytics">Analytics and KPI monitoring</h2>
                <p>
                    Use KPI cards and trend panels to monitor bookings, conversion, and operational
                    throughput.
                </p>

                <h2 id="audit-operations">Audit and operational controls</h2>
                <p>
                    Audit logs and management tools provide traceability for sensitive admin actions
                    and platform-level decision making.
                </p>
            </>
        ),
    },
    {
        slug: 'features/platform',
        title: 'Platform',
        description: 'Monitor health, integration boundaries, and core platform operations.',
        sectionId: 'feature-guides',
        readTime: '6 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'platform-health', title: 'Platform health' },
            { id: 'integrations', title: 'Integrations and webhooks' },
            { id: 'jobs-diagnostics', title: 'Jobs and diagnostics' },
        ],
        content: (
            <>
                <h2 id="platform-health">Platform health</h2>
                <p>
                    Platform dashboards expose high-level service status so operations teams can
                    quickly detect instability and respond.
                </p>

                <h2 id="integrations">Integrations and webhooks</h2>
                <p>
                    Integration views help validate downstream service connectivity and webhook
                    behavior.
                </p>

                <h2 id="jobs-diagnostics">Jobs and diagnostics</h2>
                <p>
                    Jobs and diagnostic pages support troubleshooting and lifecycle monitoring for
                    asynchronous platform work.
                </p>
            </>
        ),
    },
    {
        slug: 'faq',
        title: 'FAQ',
        description: 'Frequently asked questions about accounts, previews, bookings, and payments.',
        sectionId: 'support',
        readTime: '5 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'faq-account', title: 'Account and access' },
            { id: 'faq-preview', title: 'Visualizer previews' },
            { id: 'faq-bookings', title: 'Bookings and billing' },
        ],
        content: (
            <>
                <h2 id="faq-account">Account and access</h2>
                <p>
                    <strong>Can I use CTRL+ without signing in?</strong> You can browse public pages
                    and documentation, but operational workflows require authentication.
                </p>
                <p>
                    <strong>What if I cannot verify my email?</strong> Request a new verification
                    link and check spam/junk folders before contacting support.
                </p>

                <h2 id="faq-preview">Visualizer previews</h2>
                <p>
                    <strong>Why does a preview fail?</strong> Most failures are tied to source image
                    quality or temporary generation instability. Retry with a clearer image.
                </p>

                <h2 id="faq-bookings">Bookings and billing</h2>
                <p>
                    <strong>Can I reschedule after payment?</strong> Yes, depending on current
                    policy and slot availability.
                </p>
            </>
        ),
    },
    {
        slug: 'troubleshooting',
        title: 'Troubleshooting',
        description: 'Resolve common account, preview, scheduling, and checkout issues.',
        sectionId: 'support',
        readTime: '7 min',
        updatedAt: '2026-04-03',
        headings: [
            { id: 'signin-issues', title: 'Sign-in issues' },
            { id: 'preview-issues', title: 'Preview generation issues' },
            { id: 'scheduling-issues', title: 'Scheduling issues' },
            { id: 'billing-issues', title: 'Billing issues' },
            { id: 'when-to-contact', title: 'When to contact support' },
        ],
        content: (
            <>
                <h2 id="signin-issues">Sign-in issues</h2>
                <ul>
                    <li>Confirm email and password are correct and current.</li>
                    <li>Reset password if login attempts continue to fail.</li>
                    <li>Clear browser cache/cookies if session loops occur.</li>
                </ul>

                <h2 id="preview-issues">Preview generation issues</h2>
                <ul>
                    <li>Use a higher-quality image with clear vehicle edges.</li>
                    <li>Retry after a short delay if processing stalls.</li>
                    <li>Switch to a different source image when repeated failures occur.</li>
                </ul>

                <h2 id="scheduling-issues">Scheduling issues</h2>
                <ul>
                    <li>Refresh availability if the selected slot disappears.</li>
                    <li>Verify timezone settings in your profile.</li>
                    <li>Confirm booking status before attempting edits.</li>
                </ul>

                <h2 id="billing-issues">Billing issues</h2>
                <ul>
                    <li>Check invoice status before retrying checkout.</li>
                    <li>Verify card details and available balance.</li>
                    <li>Use invoice detail pages for payment and adjustment history.</li>
                </ul>

                <h2 id="when-to-contact">When to contact support</h2>
                <p>
                    Contact support when an issue persists after these steps. Include your account
                    email, route visited, and approximate timestamp for faster diagnosis.
                </p>
            </>
        ),
    },
]

export const DOC_PAGES = pages

export function getDocBySlug(slug: string) {
    return DOC_PAGES.find((page) => page.slug === slug)
}

export function getDocBySegments(segments: string[]) {
    return getDocBySlug(segments.join('/'))
}

export function getDocsRoute(slug: string) {
    return `/docs/${slug}`
}

export function getFlattenedNavItems() {
    return DOC_SECTIONS.flatMap((section) => section.items)
}

export function getAdjacentDocs(slug: string) {
    const allItems = getFlattenedNavItems()
    const currentIndex = allItems.findIndex((item) => item.slug === slug)

    if (currentIndex === -1) {
        return { previous: null, next: null }
    }

    return {
        previous: allItems[currentIndex - 1] ?? null,
        next: allItems[currentIndex + 1] ?? null,
    }
}
