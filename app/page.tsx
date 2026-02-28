import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../components/shared-ui/layout/public-site-shell';
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui';

const featureHighlights = [
  {
    title: 'Built for El Paso Drivers',
    description: 'Choose wrap, tint, and signage services designed for daily heat, sun, and desert dust.',
  },
  {
    title: 'Clear Options for Your Vehicle',
    description: 'See recommendations for trucks, SUVs, and work vehicles before you commit.',
  },
  {
    title: 'Preview Your Look',
    description: 'Upload a photo to preview your style and color direction before installation.',
  },
  {
    title: 'No-Stress Backup Preview',
    description: 'If photo rendering is unavailable, template previews keep your project moving.',
  },
  {
    title: 'Book Around Your Schedule',
    description: 'Pick convenient drop-off and pickup windows that fit your week in El Paso.',
  },
  {
    title: 'Reliable Appointment Times',
    description: 'Available slots are confirmed in real time to reduce delays and reschedules.',
  },
  {
    title: 'Simple Project Pricing',
    description: 'Track estimates, totals, and service details in one clear project view.',
  },
  {
    title: 'Secure Online Checkout',
    description: 'Confirm your booking with secure payment and instant confirmation.',
  },
  {
    title: 'Everything in One Account',
    description: 'Keep previews, appointments, and confirmations organized from first quote to install day.',
  },
];

const serviceEstimates = [
  {
    category: 'Wrap',
    name: 'Full Vehicle Wrap',
    range: '$2,600-$4,500',
    typical: '$3,400',
    timeline: '3-5 days',
    description: 'Best for complete color changes and full-body branding coverage.',
  },
  {
    category: 'Wrap',
    name: 'Partial Wrap Package',
    range: '$850-$1,900',
    typical: '$1,250',
    timeline: '1-2 days',
    description: 'Great for hood, roof, side panel, and accent-focused installs.',
    featured: true,
  },
  {
    category: 'Tint',
    name: 'Ceramic Window Tint',
    range: '$220-$550',
    typical: '$360',
    timeline: '2-5 hours',
    description: 'Heat and glare reduction with daily-driver durability in El Paso weather.',
  },
  {
    category: 'Fleet',
    name: 'Fleet Graphics (per vehicle)',
    range: '$1,200-$3,200',
    typical: '$2,050',
    timeline: '1-3 days',
    description: 'Consistent business branding for vans, work trucks, and service fleets.',
  },
  {
    category: 'Signage',
    name: 'Business Signage',
    range: '$700-$2,600',
    typical: '$1,500',
    timeline: '2-7 days',
    description: 'Exterior and storefront signage sized for small and mid-size businesses.',
  },
  {
    category: 'Graphics',
    name: 'Vinyl Lettering & Decals',
    range: '$180-$900',
    typical: '$420',
    timeline: '2-6 hours',
    description: 'Door logos, cut lettering, and spot decals for quick brand visibility.',
  },
];

export default function HomePage() {
  return (
    <PublicSiteShell activePath='/'>
      <main className='mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:px-6 md:py-12' id='main-content'>
        <section className='grid gap-5 lg:grid-cols-[1.05fr_0.95fr]'>
          <Card className='overflow-hidden'>
            <CardContent className='relative min-h-[460px] px-0 pb-0 pt-0'>
              <Image
                alt='Vehicle wrap fleet at dusk in El Paso'
                className='object-cover'
                fill
                priority
                sizes='(max-width: 1024px) 100vw, 52vw'
                src='/hero_page.png'
              />
              <div className='absolute inset-0 bg-black/45' />
              <div className='relative z-10 grid h-full content-end gap-3 p-6 md:p-8'>
                <Badge variant='outline'>Print + Tint + Signage</Badge>
                <h1 className='text-4xl font-semibold tracking-[0.02em] text-[color:var(--text)] md:text-5xl'>
                  Command Your Brand
                </h1>
                <p className='max-w-2xl text-sm text-[color:var(--text)] md:text-base'>
                  Vehicle wraps, tint, and signage with a clear digital booking path.
                </p>
                <p className='max-w-2xl text-sm text-[color:var(--text)] md:text-base'>
                  Review services, preview options, schedule valid appointment windows, and complete secure checkout in one customer flow.
                </p>
                <div className='flex flex-wrap items-center gap-2'>
                  <Link className={buttonVariants()} href='/sign-up'>
                    Create Account
                  </Link>
                  <Link className={buttonVariants({ variant: 'outline' })} href='/sign-in'>
                    Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Fast Project Start</CardTitle>
                <CardDescription>
                  Browse services, confirm fit, and move into preview without waiting on a manual intake step.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Operational Visibility</CardTitle>
                <CardDescription>
                  Keep scheduling windows and payment status visible as one connected customer journey.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className='grid gap-5'>
          <header className='grid gap-2'>
            <h2 className='text-3xl font-semibold tracking-[0.02em] text-[color:var(--text)]'>
              Why El Paso customers choose Ctrl Plus.
            </h2>
            <p className='max-w-3xl text-[color:var(--text-muted)]'>
              From first preview to final checkout, every step is built to make your wrap project straightforward, fast, and dependable.
            </p>
          </header>

          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {featureHighlights.map((featureHighlight, index) => (
              <Card key={featureHighlight.title}>
                <CardHeader>
                  <Badge variant='accent'>0{index + 1}</Badge>
                  <CardTitle className='text-xl'>{featureHighlight.title}</CardTitle>
                  <CardDescription>{featureHighlight.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className='grid gap-5'>
          <header className='grid gap-2'>
            <Badge variant='outline'>Pricing</Badge>
            <h2 className='text-3xl font-semibold tracking-[0.02em] text-[color:var(--text)]'>
              Realistic El Paso Service Estimates
            </h2>
            <p className='max-w-3xl text-[color:var(--text-muted)]'>
              Final quote depends on vehicle size, coverage, and material selection.
            </p>
          </header>

          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {serviceEstimates.map((serviceEstimate) => (
              <Card
                className={serviceEstimate.featured ? 'border-[color:var(--accent)] bg-[color:var(--surface-elevated)]' : undefined}
                key={serviceEstimate.name}
              >
                <CardHeader className='gap-3'>
                  <div className='flex items-center justify-between gap-2 text-xs uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>
                    <span>{serviceEstimate.category}</span>
                    <span>{serviceEstimate.timeline}</span>
                  </div>
                  <CardTitle className='text-xl'>{serviceEstimate.name}</CardTitle>
                  <CardDescription>{serviceEstimate.description}</CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                  <p className='text-xs uppercase tracking-[0.08em] text-[color:var(--text-muted)]'>Estimate range</p>
                  <p className='text-lg font-semibold text-[color:var(--text)]'>{serviceEstimate.range}</p>
                  <p className='text-sm text-[color:var(--text-muted)]'>Typical quote: {serviceEstimate.typical}</p>
                  <Link className={buttonVariants({ variant: 'link' })} href='/contact'>
                    Request estimate
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}
