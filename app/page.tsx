import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../components/public/public-site-shell';

const featureHighlights = [
  {
    title: 'Built for El Paso Drivers',
    description: 'Choose wrap, tint, and signage services designed for daily heat, sun, and desert dust.'
  },
  {
    title: 'Clear Options for Your Vehicle',
    description: 'See recommendations for trucks, SUVs, and work vehicles before you commit.'
  },
  {
    title: 'Preview Your Look',
    description: 'Upload a photo to preview your style and color direction before installation.'
  },
  {
    title: 'No-Stress Backup Preview',
    description: 'If photo rendering is unavailable, template previews keep your project moving.'
  },
  {
    title: 'Book Around Your Schedule',
    description: 'Pick convenient drop-off and pickup windows that fit your week in El Paso.'
  },
  {
    title: 'Reliable Appointment Times',
    description: 'Available slots are confirmed in real time to reduce delays and reschedules.'
  },
  {
    title: 'Simple Project Pricing',
    description: 'Track estimates, totals, and service details in one clear project view.'
  },
  {
    title: 'Secure Online Checkout',
    description: 'Confirm your booking with secure payment and instant confirmation.'
  },
  {
    title: 'Everything in One Account',
    description: 'Keep previews, appointments, and confirmations organized from first quote to install day.'
  }
];

const serviceEstimates = [
  {
    category: 'Wrap',
    name: 'Full Vehicle Wrap',
    range: '$2,600-$4,500',
    typical: '$3,400',
    timeline: '3-5 days',
    description: 'Best for complete color changes and full-body branding coverage.'
  },
  {
    category: 'Wrap',
    name: 'Partial Wrap Package',
    range: '$850-$1,900',
    typical: '$1,250',
    timeline: '1-2 days',
    description: 'Great for hood, roof, side panel, and accent-focused installs.',
    featured: true
  },
  {
    category: 'Tint',
    name: 'Ceramic Window Tint',
    range: '$220-$550',
    typical: '$360',
    timeline: '2-5 hours',
    description: 'Heat and glare reduction with daily-driver durability in El Paso weather.'
  },
  {
    category: 'Fleet',
    name: 'Fleet Graphics (per vehicle)',
    range: '$1,200-$3,200',
    typical: '$2,050',
    timeline: '1-3 days',
    description: 'Consistent business branding for vans, work trucks, and service fleets.'
  },
  {
    category: 'Signage',
    name: 'Business Signage',
    range: '$700-$2,600',
    typical: '$1,500',
    timeline: '2-7 days',
    description: 'Exterior and storefront signage sized for small and mid-size businesses.'
  },
  {
    category: 'Graphics',
    name: 'Vinyl Lettering & Decals',
    range: '$180-$900',
    typical: '$420',
    timeline: '2-6 hours',
    description: 'Door logos, cut lettering, and spot decals for quick brand visibility.'
  }
];

export default function HomePage() {
  return (
    <PublicSiteShell activePath="/">
      <main className="public-main" id="main-content">
        <section className="section-shell hero-stage">
          <div className="hero-stage__media">
            <Image
              src="/hero_page.png"
              alt="Vehicle wrap fleet at dusk in El Paso"
              fill
              priority
              sizes="100vw"
            />
            <div className="hero-stage__scrim" />

            <div className="hero-stage__content">
              <p className="eyebrow">Print + Tint + Signage</p>
              <h1 className="public-hero__title">
                Command Your Brand
              </h1>
              <p className="hero-stage__description">
                Vehicle wraps, tint, and signage with a clear digital booking path.
              </p>
              <p className="hero-stage__description">
                Review services, preview options, schedule valid appointment windows, and complete
                secure checkout in one customer flow.
              </p>

              <div className="public-hero__actions">
                <Link className="button button--primary" href="/sign-up">
                  Create Account
                </Link>
                <Link className="button button--ghost" href="/sign-in">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Feature highlights" className="section-shell landing-feature-zone">
          <header className="section-head section-head--centered">
            <h2>Why El Paso customers choose Ctrl Plus.</h2>
            <p>
              From first preview to final checkout, every step is built to make your wrap project
              straightforward, fast, and dependable.
            </p>
          </header>

          <div className="landing-feature-grid">
            {featureHighlights.map((featureHighlight, index) => (
              <article className="surface-card landing-feature-card" key={featureHighlight.title}>
                <p className="landing-feature-card__index">0{index + 1}</p>
                <h3>{featureHighlight.title}</h3>
                <p>{featureHighlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-pricing-band">
          <div className="landing-pricing-band__media">
            <Image
              src="/2a60fda9-1ebf-4246-bf8c-bd9802436fa1.png"
              alt="Fleet service visual background"
              fill
              sizes="100vw"
            />
          </div>
          <div className="landing-pricing-band__scrim" />

          <div className="section-shell landing-pricing-shell">
            <header className="section-head section-head--centered">
              <p className="eyebrow">Pricing</p>
              <h2>Realistic El Paso Service Estimates</h2>
              <p>
                Final quote depends on vehicle size, coverage, and material selection.
              </p>
            </header>

            <div className="landing-pricing-grid">
              {serviceEstimates.map((serviceEstimate) => (
                <article
                  className={`surface-card pricing-card ${serviceEstimate.featured ? 'pricing-card--featured' : ''}`}
                  key={serviceEstimate.name}
                >
                  <header className="pricing-card__head">
                    <p className="pricing-card__category">{serviceEstimate.category}</p>
                    <p className="pricing-card__timeline">{serviceEstimate.timeline}</p>
                  </header>
                  <h3 className="pricing-card__name">{serviceEstimate.name}</h3>
                  <p className="pricing-card__range">
                    <span className="pricing-card__range-label">Estimate range</span>
                    <span className="pricing-card__range-value">{serviceEstimate.range}</span>
                  </p>
                  <p className="pricing-card__typical">Typical quote: {serviceEstimate.typical}</p>
                  <p className="pricing-card__description">{serviceEstimate.description}</p>
                  <div className="pricing-card__actions">
                    <Link className="inline-link" href="/contact">
                      Request estimate
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}
