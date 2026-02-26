import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../components/public/public-site-shell';

const featureHighlights = [
  {
    title: 'Service Discovery',
    description: 'Review wrap, tint, and signage options with practical details.'
  },
  {
    title: 'Vehicle Compatibility',
    description: 'Filter options by vehicle type before moving to preview.'
  },
  {
    title: 'Upload Preview',
    description: 'Start with customer photo previews when available.'
  },
  {
    title: 'Template Fallback',
    description: 'Continue the booking path even if upload rendering is unavailable.'
  },
  {
    title: 'Scheduling Windows',
    description: 'Select valid drop-off and pick-up times based on current availability.'
  },
  {
    title: 'Capacity Checks',
    description: 'Use server-validated appointment rules during booking.'
  },
  {
    title: 'Invoice Tracking',
    description: 'Keep project totals and invoice details tied to each booking.'
  },
  {
    title: 'Secure Checkout',
    description: 'Complete payment through a guided checkout experience.'
  },
  {
    title: 'Account Continuity',
    description: 'Save active previews, appointments, and confirmations in one account.'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$149/mo',
    description: 'For single-vehicle and small project volume.',
    points: [
      'Up to 5 active projects',
      '1 scheduling calendar',
      'Standard checkout flow',
      'Booking status tracking'
    ]
  },
  {
    name: 'Growth',
    price: '$349/mo',
    description: 'For repeat customer bookings and team operations.',
    points: [
      'Up to 25 active projects',
      'Team scheduling support',
      'Invoice workflow controls',
      'Priority account support'
    ],
    featured: true
  },
  {
    name: 'Enterprise',
    price: '$15/truck',
    description: 'For fleet-focused scheduling and booking operations.',
    points: [
      'High-volume fleet projects',
      'Advanced booking oversight',
      'Dedicated workflow support',
      'Custom operational alignment'
    ]
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
              <Image src="/logo_white_spec.png" alt="CTRL+ logo" width={48} height={48} />
              <p className="eyebrow">El Paso Vehicle Wrap Workflow</p>
              <h1 className="public-hero__title">
                Vehicle wraps, tint, and signage with a clear digital booking path.
              </h1>
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
                <Link className="button button--secondary" href="/features">
                  View Features
                </Link>
              </div>

              <p className="public-hero__phone">
                Need guidance? Call <a href="tel:+19159992191">(915) 999-2191</a>
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Feature highlights" className="section-shell landing-feature-zone">
          <header className="section-head section-head--centered">
            <p className="eyebrow">Core Platform Features</p>
            <h2>Comprehensive customer booking features.</h2>
            <p>Everything needed to move from service review to booking confirmation.</p>
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
              <h2>Simple, Transparent Pricing</h2>
              <p>Clear plan options for different booking volumes and service scope.</p>
            </header>

            <div className="landing-pricing-grid">
              {pricingPlans.map((pricingPlan) => (
                <article
                  className={`surface-card pricing-card ${pricingPlan.featured ? 'pricing-card--featured' : ''}`}
                  key={pricingPlan.name}
                >
                  <h3>{pricingPlan.name}</h3>
                  <p className="pricing-card__price">{pricingPlan.price}</p>
                  <p>{pricingPlan.description}</p>
                  <ul className="pricing-list">
                    {pricingPlan.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="button-row">
                    <Link className="button button--primary" href="/sign-up">
                      Create Account
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell cta-banner">
          <div>
            <p className="eyebrow">Ready To Begin</p>
            <h2>Create an account and launch your first wrap project.</h2>
            <p>Returning customers can sign in to continue active previews and booking work.</p>
          </div>
          <div className="button-row">
            <Link className="button button--primary" href="/sign-up">
              Create Account
            </Link>
            <Link className="button button--ghost" href="/sign-in">
              Sign In
            </Link>
            <Link className="button button--secondary" href="/features">
              View Features
            </Link>
          </div>
        </section>

        <section className="section-shell panel-section two-column-section">
          <div className="surface-card emphasis-card">
            <p className="eyebrow">Need Help Choosing?</p>
            <h2>Compare services with the team before you book.</h2>
            <ul className="chip-list">
              <li>Get help matching service type to your vehicle.</li>
              <li>Review timeline expectations before scheduling.</li>
              <li>Confirm project scope for personal or fleet needs.</li>
              <li>Move directly to booking once details are clear.</li>
            </ul>
            <div className="button-row">
              <Link className="button button--primary" href="/contact">
                Contact Us
              </Link>
              <Link className="button button--ghost" href="/features">
                View Features
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--tall">
            <Image
              src="/hero_landing.png"
              alt="Wrap service collage"
              fill
              sizes="(max-width: 1040px) 100vw, 42vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section">
          <header className="section-head">
            <p className="eyebrow">Customer Journey</p>
            <h2>Browse → Preview → Schedule → Pay</h2>
          </header>
          <div className="service-grid">
            {[
              {
                title: 'Browse',
                description: 'Review service options and choose a project direction.'
              },
              {
                title: 'Preview',
                description: 'Use upload or template-based preview to move forward.'
              },
              {
                title: 'Schedule',
                description: 'Select valid appointment windows from available slots.'
              },
              {
                title: 'Pay',
                description: 'Complete secure checkout and receive confirmation.'
              }
            ].map((step) => (
              <article className="surface-card service-card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <Link className="inline-link" href="/sign-up">
                  Create Account
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}
