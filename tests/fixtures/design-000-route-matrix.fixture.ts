export interface DesignRouteExpectation {
  readonly route: string;
  readonly filePath: string;
  readonly requiredSnippets: readonly string[];
}

export const DESIGN_000_BLOCKED_TERMS = [
  'premium',
  'luxury',
  'elite',
  'best-in-class',
  'world-class',
  'exclusive'
] as const;

export const DESIGN_000_ROUTE_MATRIX: readonly DesignRouteExpectation[] = [
  {
    route: '/',
    filePath: 'app/page.tsx',
    requiredSnippets: [
      'Vehicle wraps, tint, and signage with a clear digital booking path.',
      'className="public-hero__title"',
      'Create Account',
      'Realistic El Paso Service Estimates',
      'className="pricing-card__typical"'
    ]
  },
  {
    route: '/about',
    filePath: 'app/about/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">About CTRL+</p>',
      'Vehicle wrap services built around clear planning and dependable execution.',
      'className="content-hero__title"',
      'Contact Us'
    ]
  },
  {
    route: '/features',
    filePath: 'app/features/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">Platform Features</p>',
      'Customer-facing tools that keep wrap projects moving.',
      'surface-card feature-row',
      'Create Account'
    ]
  },
  {
    route: '/contact',
    filePath: 'app/contact/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">Contact</p>',
      'Whether you are planning one vehicle or a fleet project, the team can help you move',
      'className="service-grid"',
      'Create Account'
    ]
  },
  {
    route: '/sign-in',
    filePath: 'app/(auth)/sign-in/[[...sign-in]]/page.tsx',
    requiredSnippets: [
      "eyebrow: 'Sign In'",
      "title: 'Welcome back to CTRL+.'",
      '<SignIn fallbackRedirectUrl="/wraps" path="/sign-in" routing="path" signUpUrl="/sign-up" />'
    ]
  },
  {
    route: '/sign-up',
    filePath: 'app/(auth)/sign-up/[[...sign-up]]/page.tsx',
    requiredSnippets: [
      "eyebrow: 'Sign Up'",
      "title: 'Create your CTRL+ account.'",
      '<SignUp fallbackRedirectUrl="/wraps" path="/sign-up" routing="path" signInUrl="/sign-in" />'
    ]
  },
  {
    route: '/wraps',
    filePath: 'app/(tenant)/wraps/page.tsx',
    requiredSnippets: [
      'Wrap catalog',
      'Review available wrap options and open details to continue planning.',
      '<WrapCatalogList wraps={wraps} />'
    ]
  },
  {
    route: '/wraps/[id]',
    filePath: 'app/(tenant)/wraps/[id]/page.tsx',
    requiredSnippets: ['<WrapCatalogDetail wrap={wrap} />', '/ Wraps']
  },
  {
    route: '/admin',
    filePath: 'app/(tenant)/admin/page.tsx',
    requiredSnippets: [
      'Admin / Operations',
      'Operations Dashboard',
      'className="text-2xl font-semibold text-[color:var(--text)]">Performance Snapshot</h2>'
    ]
  }
] as const;
