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
      'className="hero__title"',
      'Create Account',
      'Sign In'
    ]
  },
  {
    route: '/about',
    filePath: 'app/about/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">About CTRL+</p>',
      'Vehicle wrap services built around clarity, speed, and execution.',
      'className="content-hero__title"',
      'View Features'
    ]
  },
  {
    route: '/features',
    filePath: 'app/features/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">Platform Features</p>',
      'Each feature supports the same objective: reduce friction and move customers from',
      'feature-row card',
      'Sign Up'
    ]
  },
  {
    route: '/contact',
    filePath: 'app/contact/page.tsx',
    requiredSnippets: [
      '<p className="eyebrow">Contact</p>',
      'Whether you are wrapping one vehicle or a full fleet, we provide a direct path from',
      'className="contact-grid"',
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
