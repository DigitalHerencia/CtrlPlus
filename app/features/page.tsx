import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const featureRows = [
  {
    title: 'Catalog Discovery',
    description: 'Find wrap options by service type and keep your shortlist tied to one account.',
    points: [
      'Review options with practical descriptions and install expectations.',
      'Use one account to save and compare choices across visits.',
      'Move directly into preview and scheduling after selection.'
    ],
    image: '/visuals/feature-discovery.png',
    imageAlt: 'Vehicle lineup and wrap detail composition'
  },
  {
    title: 'Preview With Fallback',
    description:
      'Start with upload preview support, then switch to template-based preview when speed matters.',
    points: [
      'Keep the booking path active even if an upload preview is unavailable.',
      'Review wrap texture and placement before scheduling.',
      'Continue to next steps without restarting the project.'
    ],
    image: '/visuals/feature-preview.png',
    imageAlt: 'Wrap material and vehicle preview collage'
  },
  {
    title: 'Scheduling Controls',
    description:
      'Select valid drop-off and pick-up windows based on business hours and current capacity.',
    points: [
      'Present valid windows only for consistent booking decisions.',
      'Reduce manual back-and-forth with structured appointment steps.',
      'Keep booking details linked to the customer account.'
    ],
    image: '/visuals/feature-scheduling.png',
    imageAlt: 'Scheduling workflow visual composition'
  },
  {
    title: 'Invoice + Checkout',
    description:
      'Complete payment through secure checkout and keep invoice status connected to the booking.',
    points: [
      'Review payment context before submitting checkout.',
      'Receive confirmation in the same flow after payment.',
      'Track booking and invoice progress in one account.'
    ],
    image: '/visuals/contact-service.png',
    imageAlt: 'Customer booking and service visual collage'
  }
];

export const metadata: Metadata = {
  title: 'Features'
};

export default function FeaturesPage() {
  return (
    <PublicSiteShell activePath="/features">
      <main className="public-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">Platform Features</p>
            <h1 className="content-hero__title">
              Customer-facing tools that keep wrap projects moving.
            </h1>
            <p>
              Each feature supports the same goal: clear decisions, valid scheduling, and secure
              payment completion.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--content">
            <Image
              src="/visuals/feature-discovery.png"
              alt="Feature overview collage"
              fill
              priority
              sizes="(max-width: 1040px) 100vw, 45vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section">
          <header className="section-head">
            <p className="eyebrow">Feature Breakdown</p>
            <h2>Designed to support the full customer journey from first click to payment.</h2>
          </header>

          <div className="feature-stack">
            {featureRows.map((featureRow, index) => {
              const shouldReverse = index % 2 === 1;

              return (
                <article
                  className={`surface-card feature-row ${shouldReverse ? 'feature-row--reverse' : ''}`}
                  key={featureRow.title}
                >
                  <div className="feature-row__copy">
                    <h3>{featureRow.title}</h3>
                    <p>{featureRow.description}</p>
                    <ul className="dot-list">
                      {featureRow.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <Link className="inline-link" href="/sign-up">
                      Create Account
                    </Link>
                  </div>

                  <figure className="visual-frame visual-frame--row">
                    <Image
                      src={featureRow.image}
                      alt={featureRow.imageAlt}
                      fill
                      sizes="(max-width: 1040px) 100vw, 42vw"
                    />
                  </figure>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell cta-banner">
          <div>
            <p className="eyebrow">Next Step</p>
            <h2>Create an account and launch your first project flow.</h2>
            <p>Existing customers can sign in to continue active previews, bookings, and invoices.</p>
          </div>
          <div className="button-row">
            <Link className="button button--primary" href="/sign-up">
              Create Account
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
