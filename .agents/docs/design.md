# Design System & Frontend Architecture

## Intent

CtrlPlus frontend is built on a **mobile-first**, responsive design system using **Tailwind CSS** with **shadcn/ui** primitives. All UI is accessible, performant, and follows strict architectural governance ensuring clean separation between presentation, composition, and data layers.

## Design Principles

1. **Mobile-First**: Optimize for small screens first, progressively enhance for larger viewports
2. **Semantic Simplicity**: Use shadcn/ui primitives exclusively; no custom UI components
3. **Consistent Spacing**: Maintain predictable, scalable spacing ratios across all sections
4. **Performance**: Progressive enhancement, lazy loading, responsive images
5. **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, keyboard navigation
6. **Animation**: Subtle, purposeful Tailwind animations that don't distract
7. **Responsive Typography**: Font sizes and line-heights that scale gracefully across devices

## Color System

Strict adherence to brand colors (no additional colors or variations):

| Purpose          | Tailwind         | Hex                   | Usage                                     |
| ---------------- | ---------------- | --------------------- | ----------------------------------------- |
| Primary (Accent) | `blue-600`       | #2563eb               | CTAs, highlights, focus states            |
| Border           | `neutral-700`    | #404040               | Card borders, dividers, subtle separators |
| Background       | `neutral-900`    | #171717               | Page and section backgrounds              |
| Surface/Callout  | `neutral-950/80` | rgba(10, 10, 10, 0.8) | Dark overlays, glass-morphism             |
| Text Primary     | `neutral-100`    | #f5f5f5               | Body text, headings                       |
| Text Secondary   | `neutral-400`    | #a3a3a3               | Metadata, muted descriptions, labels      |

## Typography Scale

Mobile-first scaling ensures readability across all devices:

| Element       | Mobile    | Tablet (md) | Desktop (lg) | Weight        | Letter-Spacing  |
| ------------- | --------- | ----------- | ------------ | ------------- | --------------- |
| H1 (Hero)     | text-4xl  | text-5xl    | text-6xl     | font-black    | tracking-tight  |
| H2 (Sections) | text-2xl  | text-4xl    | text-5xl     | font-black    | tracking-tight  |
| H3 (Cards)    | text-lg   | text-xl     | text-2xl     | font-bold     | tracking-normal |
| Body          | text-base | text-base   | text-base    | font-normal   | tracking-normal |
| Small         | text-sm   | text-sm     | text-sm      | font-normal   | tracking-normal |
| Label         | text-xs   | text-xs     | text-sm      | font-semibold | tracking-widest |

## Spacing System

Tailwind's built-in scale (`4px` increments):

- **Compact sections**: `py-12 sm:py-16 lg:py-20`
- **Standard sections**: `py-16 sm:py-20 lg:py-24`
- **Large sections**: `py-20 sm:py-24 lg:py-28`
- **Card padding**: `p-4 sm:p-6 lg:p-8`
- **Gap (grid/flex)**: `gap-4 sm:gap-6 lg:gap-8`
- **Padding (container)**: `px-4 sm:px-6 lg:px-8`

## Layout & Containers

All sections use a consistent max-width container pattern:

```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

- `max-w-7xl` = 1280px (Tailwind default)
- Responsive padding ensures mobile safety
- Sections wrap full width with consistent backgrounds

## Responsive Grid System

| Use Case      | Mobile  | Tablet  | Desktop |
| ------------- | ------- | ------- | ------- |
| Features Grid | 1 col   | 2 col   | 3 col   |
| Pricing Cards | 1 col   | 2-3 col | 3 col   |
| Feature Cards | 1 col   | 2 col   | 3 col   |
| Gallery/Grid  | 1-2 col | 2 col   | 3-4 col |

Always use: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern.

## Button System

All buttons follow the **Header Button Template** from `SiteHeader`:

### Primary Button (CTA)

```tsx
<Button
  asChild
  className="bg-blue-600 text-neutral-100 transition-all
    hover:border-2 hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
>
  <Link href="/path">Action</Link>
</Button>
```

### Secondary Button (Outline/Alternative)

```tsx
<Button
  asChild
  variant="outline"
  className="border-neutral-700 bg-transparent text-neutral-100
    hover:border-blue-600 hover:bg-transparent hover:text-blue-600"
>
  <Link href="/path">Action</Link>
</Button>
```

### Sizes

- **sm**: `size="sm"` — inline, secondary actions
- **base/default**: no size prop — standard buttons
- **lg**: `size="lg"` — prominent CTAs, hero sections (`px-8 py-4`)
- **xl**: custom `px-10 py-6` — major hero CTAs

### States

- **Hover**: Color invert with border
- **Focus**: Ring-blue-600 (default from Tailwind config)
- **Disabled**: `opacity-50 cursor-not-allowed`

## Card Components

All cards use shadcn/ui `Card` with consistent styling:

```tsx
<Card className="border-neutral-700 bg-neutral-950/80
  transition-all duration-300
  hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>
```

- **Border**: `border-neutral-700`
- **Background**: `bg-neutral-950/80` (layered on top of page background)
- **Hover State**: Subtle border lift and shadow
- **Transition**: `transition-all duration-300`

## Images & Media

### Responsive Images

All images use Next.js `Image` with responsive sizing:

```tsx
<Image
  src="/image.png"
  alt="Descriptive alt text"
  fill
  sizes="100vw"           // Mobile
  className="object-cover"
  priority               // Hero images only
  loading="lazy"         // Default for non-hero
/>
```

- **Hero Images**: `priority`, `fill`, `object-cover`
- **Gallery**: `fill` or fixed `width/height`, `.object-cover`
- **Aspect Ratios**: Use container div with `aspect-video` or `aspect-square`

## Animations & Transitions

Leverage Tailwind's built-in animations and custom keyframes:

| Animation                     | Usage                      | Duration |
| ----------------------------- | -------------------------- | -------- |
| `fade-in`                     | Subtle entrance            | 200ms    |
| `slide-in-up`                 | Card reveal, content       | 200ms    |
| `transition-all duration-300` | Hover states, color shifts | 300ms    |
| `transition duration-200`     | Quick interactions         | 200ms    |

### When to Animate

- Card hover states
- Button state changes
- Section entrance (lazy load)
- Loading states
- Navigation transitions

### Avoid

- Excessive animations
- Auto-playing animations on scroll (unless essential)
- Long durations (keep ≤ 500ms)

## Component Architecture

### Page Routes (`app/**`)

- Thin orchestration layer
- Import feature components
- No business logic
- Server Components by default

### Features (`features/{domain}/**`)

- Domain-specific composition
- Bridge data → UI
- Use fetchers/actions from `lib/`
- Client only if interactivity required

### Components (`components/**`)

- **UI** (`components/ui/**`): shadcn primitives only
- **Domain** (`components/{domain}/**`): Reusable domain blocks
- **Shared** (`components/shared/**`): Header, footer, navigation
- Pure presentation, no data fetching
- Pass data as props

### Server Authority (`lib/**`)

- `lib/fetchers/**`: Read orchestration
- `lib/actions/**`: Write orchestration
- `lib/auth/**`: Authentication
- `lib/authz/**`: Authorization
- No React hooks, SSR-safe

## Accessibility

- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible styles (Tailwind default ring)
- Alt text on all images
- Sufficient color contrast
- Responsive text sizing (≥16px on mobile)

## Performance Optimization

- **Images**: Next.js Image for automatic optimization
- **Lazy Loading**: Intersection Observer for off-viewport elements
- **Code Splitting**: Automatic via Next.js App Router
- **CSS**: Tailwind JIT purges unused classes
- **Fonts**: System fonts or preloaded web fonts
- **Bundle Size**: Tree-shaking via module imports

## Dark Mode

All colors assume dark mode (no light mode toggles):

- Background: `neutral-900`
- Text: `neutral-100` primary, `neutral-400` secondary
- Borders: `neutral-700`
- No need for `dark:` prefixes

## Responsive Breakpoints

Tailwind defaults (mobile-first):

| Breakpoint | Width  | Mobile First  |
| ---------- | ------ | ------------- |
| sm         | 640px  | Tablet        |
| md         | 768px  | Large tablet  |
| lg         | 1024px | Desktop       |
| xl         | 1280px | Large desktop |
| 2xl        | 1536px | Ultra-wide    |

Pattern: Base styles for mobile, `md:` for tablets, `lg:` for desktop.

## Utility Class Conventions

### Spacing

- Padding: `px-4 sm:px-6 lg:px-8`, `py-6 sm:py-8 lg:py-10`
- Margins: `mb-4`, `mt-2`, etc.
- Gaps: `gap-4 sm:gap-6 md:gap-8`

### Sizing

- Full: `w-full`, `h-full`
- Screen: `w-screen`, `min-h-screen`
- Specific: `w-12`, `h-20`, etc.

### Flex/Grid

- Center: `flex items-center justify-center`
- Stretch: `items-stretch`
- Grow: `flex-1`

### Typography

- Headings: `font-black` or `font-bold`, `tracking-tight`
- Body: `font-normal`, `tracking-normal`
- Uppercase for labels: `uppercase tracking-[0.24em]`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari 12+, Chrome Android)
- Graceful degradation for older browsers
- No IE11 support

## Dashboard Pages

Dashboard pages are the primary user-facing interface for tenant operations. All dashboard pages follow standardized component and layout patterns defined in `.agents/docs/page-patterns.md`.

### Workspace Page Components

Every dashboard uses four core components from `components/shared/tenant-elements.tsx`:

#### 1. WorkspacePageIntro

Domain-specific page header introducing the section.

**Styling**:

- Border: `border-neutral-700`
- Background: `bg-neutral-950/80`
- Padding: `px-6 py-7`
- Label: `text-xs uppercase tracking-[0.24em] text-blue-600`
- Title: `text-3xl sm:text-4xl font-black tracking-tight text-neutral-100`
- Description: `text-sm sm:text-base text-neutral-100`

#### 2. WorkspacePageContextCard

Actions panel for domain-specific workflows.

**Styling**:

- Border: `border-neutral-700`
- Background: `bg-neutral-950/80`
- Padding: `px-6 py-6`
- Layout: Two-column on desktop (labels left, actions right), stacked on mobile
- Button gap: `gap-3`

#### 3. WorkspaceMetricCard

KPI statistic with label, value, and optional icon/badge.

**Styling**:

- Border: `border-neutral-700`
- Background: `bg-neutral-950/80`
- Label: `text-xs uppercase tracking-[0.18em] text-neutral-100`
- Value: `text-3xl font-black tracking-tight text-neutral-100`
- Icon: `border border-blue-600 text-blue-600 bg-neutral-900` (12x12px container)
- Badge: `border-neutral-700 text-neutral-100` (outline variant)

**Grid Pattern**:

```
Mobile (1 col): grid-cols-1
Tablet (2 col): md:grid-cols-2
Desktop (4 col): lg:grid-cols-4
Gap: gap-4 sm:gap-6 lg:gap-8
```

#### 4. WorkspaceEmptyState

No-data state for empty results.

**Styling**:

- Border: `border border-dashed border-neutral-700` (dashed = empty)
- Background: `bg-neutral-950/80`
- Padding: `py-14` (centered vertical)
- Label: `text-xs uppercase tracking-[0.24em] text-blue-600`
- Title: `text-xl font-bold text-neutral-100`
- Description: `text-sm text-neutral-100 max-w-md`

### Dashboard Page Spacing

```tsx
<div className="space-y-6">  {/* 24px between major sections */}
    <WorkspacePageIntro ... />
    <WorkspacePageContextCard ... />

    <Suspense fallback={<StatsSkeleton />}>
        <StatsSection ... />
    </Suspense>

    <FiltersSection ... />

    <Suspense fallback={<TableSkeleton />}>
        <TableSection ... />
    </Suspense>
</div>
```

**Spacing Rules**:

- Between page sections: `space-y-6` (24px)
- Within grouped content: `space-y-4` (16px)
- Grid/flex gaps: `gap-4 sm:gap-6 lg:gap-8`

### Integration with Design System

Dashboard pages inherit all design system rules:

- **Color System**: Use only colors from the palette (blue-600, neutral-\* only)
- **Typography Scale**: Page title = text-3xl sm:text-4xl, metrics = text-3xl
- **Responsive**: Mobile-first pattern (1 col → 2 col → 4 col)
- **Buttons**: Primary (solid blue) + Secondary (outline neutral) only
- **Animations**: Use transition-all on card hovers, fade-in for lazy-loaded sections
- **Accessibility**: WCAG AA contrast, semantic HTML, focus visible

### Reference Implementations

- **Scheduling**: `features/scheduling/scheduling-dashboard-page-feature.tsx`
- **Billing**: `features/billing/invoices-dashboard-page-feature.tsx`
- **Settings**: `features/settings/unified-settings-page-feature.tsx`
- **Visualizer**: `features/visualizer/visualizer-hf-page-feature.tsx`

Study these pages for exact patterns and implementation details. See `.agents/docs/page-patterns.md` for comprehensive architecture documentation.

## Future Considerations

- Dark/light mode toggle (if needed)
- Internationalization (i18n)
- RTL language support
- Advanced animations (Framer Motion) if complex interactions needed
- Component storybook for documentation
- Component storybook for documentation
