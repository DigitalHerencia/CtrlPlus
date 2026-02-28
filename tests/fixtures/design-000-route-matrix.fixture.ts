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
    filePath: 'app/(public)/page.tsx',
    requiredSnippets: [
      'Vehicle wraps, tint, and signage with a clear digital booking path.',
      'Command Your Brand',
      'Create Account',
      'Realistic El Paso Service Estimates',
      'Typical quote:'
    ]
  },
  {
    route: '/about',
    filePath: 'app/(public)/about/page.tsx',
    requiredSnippets: [
      'About CTRL+',
      'Vehicle wrap services built around clear planning and dependable execution.',
      'How We Operate',
      'Contact Us'
    ]
  },
  {
    route: '/features',
    filePath: 'app/(public)/features/page.tsx',
    requiredSnippets: [
      'Platform Features',
      'Customer-facing tools that keep wrap projects moving.',
      'Feature Breakdown',
      'Create Account'
    ]
  },
  {
    route: '/contact',
    filePath: 'app/(public)/contact/page.tsx',
    requiredSnippets: [
      'Contact',
      'Whether you are planning one vehicle or a fleet project, the team can help you move',
      'Multiple ways to connect and keep your project moving.',
      'Create Account'
    ]
  },
  {
    route: '/sign-in',
    filePath: 'app/(auth)/sign-in/[[...sign-in]]/page.tsx',
    requiredSnippets: [
      "eyebrow: 'Sign In'",
      "title: 'Welcome back to CTRL+.'",
      "<SignIn fallbackRedirectUrl='/catalog/wraps' path='/sign-in' routing='path' signUpUrl='/sign-up' />"
    ]
  },
  {
    route: '/sign-up',
    filePath: 'app/(auth)/sign-up/[[...sign-up]]/page.tsx',
    requiredSnippets: [
      "eyebrow: 'Sign Up'",
      "title: 'Create your CTRL+ account.'",
      "<SignUp fallbackRedirectUrl='/catalog/wraps' path='/sign-up' routing='path' signInUrl='/sign-in' />"
    ]
  },
  {
    route: '/catalog/wraps',
    filePath: 'app/(tenant)/catalog/wraps/page.tsx',
    requiredSnippets: [
      'Wrap catalog',
      'Review available wrap options and open details to continue planning.',
      '<WrapCatalogList wraps={wraps} />'
    ]
  },
  {
    route: '/catalog/wraps/new',
    filePath: 'app/(tenant)/catalog/wraps/new/page.tsx',
    requiredSnippets: ['Create wrap', 'Save wrap', 'redirect(`/catalog/wraps/${created.id}`);']
  },
  {
    route: '/catalog/wraps/[id]',
    filePath: 'app/(tenant)/catalog/wraps/[id]/page.tsx',
    requiredSnippets: ['<WrapCatalogDetail wrap={wrap} />', 'Wrap detail']
  },
  {
    route: '/catalog/wraps/[id]/edit',
    filePath: 'app/(tenant)/catalog/wraps/[id]/edit/page.tsx',
    requiredSnippets: ['Edit wrap', 'Save changes', 'updateWrapDesignAction']
  },
  {
    route: '/operations/admin',
    filePath: 'app/(tenant)/operations/admin/page.tsx',
    requiredSnippets: [
      'Admin / Operations',
      'Operations Dashboard',
      'Performance Snapshot'
    ]
  }
] as const;
