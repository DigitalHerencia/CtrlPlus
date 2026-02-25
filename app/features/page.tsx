import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const featureRows = [
  {
    title: 'Wrap Catalog + Design Discovery',
    description:
      'Curated design browsing with clear categories, compatible vehicle types, and transparent pricing cues.',
    points: [
      'Filter by finish, style, and visual theme.',
      'Review estimated install duration upfront.',
      'Move directly into the “Try on my vehicle” flow.'
    ],
    image: '/0001-3395082611040874149.png',
    imageAlt: 'CTRL+ designs showcase'
  },
  {
    title: 'Visualizer with Smart Fallbacks',
    description:
      'Upload previews build confidence while template previews preserve momentum when speed matters.',
    points: [
      'Upload a front, side, or 3/4 image for personalized previews.',
      'Switch to template mode when speed is critical.',
      'Continue to scheduling even if upload preview fails.'
    ],
    image: '/0001-1137653301909815874.png',
    imageAlt: 'Vehicle wrap close-up details'
  },
  {
    title: 'Scheduling + Capacity Rules',
    description:
      'Capture drop-off and pick-up windows while enforcing business hours, buffers, and capacity.',
    points: [
      'Guide customers to valid appointment windows only.',
      'Protect operations with server-side scheduling rules.',
      'Reduce back-and-forth through structured confirmation flows.'
    ],
    image: '/0001-8036042029217284237.png',
    imageAlt: 'CTRL+ wraps promotional artwork'
  },
  {
    title: 'Invoicing + Stripe Checkout',
    description:
      'Move from quote to paid booking through secure checkout and webhook-confirmed status updates.',
    points: [
      'Generate invoice context directly from booking details.',
      'Use secure checkout for faster conversion.',
      'Reflect payment state in booking confirmations.'
    ],
    image: '/0001-5948623603194756924.png',
    imageAlt: 'CTRL+ El Paso fleet lineup at dusk'
  }
];

export const metadata: Metadata = {
  title: 'Features'
};

export default function FeaturesPage() {
  return (
    <PublicSiteShell activePath="/features">
      <main className="content-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">Platform Features</p>
            <h1 className="content-hero__title">
              Core capabilities built to convert browsing into confirmed bookings.
            </h1>
            <p>
              Each feature supports the same objective: reduce friction and move customers from
              interest to payment.
            </p>
            <div className="content-hero__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--feature">
            <Image
              src="/0001-6683836236957800475.png"
              alt="CTRL+ premium vehicle wrap solutions"
              fill
              priority
              sizes="(max-width: 980px) 100vw, 46vw"
            />
          </figure>
        </section>

        <section className="section-shell landing-section">
          <header className="section-head">
            <p className="eyebrow">Feature Breakdown</p>
            <h2>Designed to support the full customer journey end-to-end.</h2>
          </header>

          <div className="feature-layout">
            {featureRows.map((featureRow, index) => {
              const shouldReverse = index % 2 === 1;

              return (
                <article
                  className={`feature-row card ${shouldReverse ? 'feature-row--reverse' : ''}`}
                  key={featureRow.title}
                >
                  <div className="feature-row__copy">
                    <h3>{featureRow.title}</h3>
                    <p>{featureRow.description}</p>
                    <ul className="bullet-list">
                      {featureRow.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <Link className="inline-link" href="/sign-up">
                      Create Account
                    </Link>
                  </div>

                  <figure className="media-card media-card--feature-row">
                    <Image
                      src={featureRow.image}
                      alt={featureRow.imageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 42vw"
                    />
                  </figure>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell cta-panel">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2>Create an account and launch your first wrap flow.</h2>
            <p>
              Existing customers can sign in to continue active previews, bookings, and invoices.
            </p>
          </div>
          <div className="cta-panel__actions">
            <Link className="button button--primary" href="/sign-up">
              Sign Up
            </Link>
            <Link className="button button--ghost" href="/sign-in">
              Sign In
            </Link>
          </div>
        </section>
      </main>
    </PublicSiteShell>
  );
}
