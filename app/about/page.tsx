import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const operatingPrinciples = [
  {
    title: 'Clear Planning',
    description: 'Customers can see the full booking path before committing to an install date.'
  },
  {
    title: 'Structured Operations',
    description:
      'Scheduling, invoicing, and payment are connected so projects move through one workflow.'
  },
  {
    title: 'Reliable Service',
    description: 'Local support keeps communication direct for personal vehicles and fleet work.'
  }
];

const serviceStandards = [
  'Keep customer decisions focused on practical next steps.',
  'Support preview-first planning with fallback coverage.',
  'Use clear appointment windows and secure payment confirmation.',
  'Maintain direct communication from intake through booking.'
];

const customerFocus = [
  'Drivers who want a fast path from wrap selection to booking.',
  'Business owners managing repeat or multi-vehicle work.',
  'Teams that need clear timing, approval, and payment steps.'
];

export const metadata: Metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <PublicSiteShell activePath="/about">
      <main className="public-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">About CTRL+</p>
            <h1 className="content-hero__title">
              Vehicle wrap services built around clear planning and dependable execution.
            </h1>
            <p>
              CTRL+ supports customers and businesses with a customer-facing booking flow that keeps
              decisions practical from first visit through confirmation.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/features">
                View Features
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--content">
            <Image
              src="/visuals/about-operations.png"
              alt="Wrap service operations collage"
              fill
              priority
              sizes="(max-width: 1040px) 100vw, 45vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section">
          <header className="section-head">
            <p className="eyebrow">How We Operate</p>
            <h2>Built around operational clarity and consistent customer communication.</h2>
          </header>

          <div className="service-grid">
            {operatingPrinciples.map((operatingPrinciple) => (
              <article className="surface-card service-card" key={operatingPrinciple.title}>
                <h3>{operatingPrinciple.title}</h3>
                <p>{operatingPrinciple.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell panel-section two-column-section">
          <div className="surface-card emphasis-card">
            <p className="eyebrow">Service Standards</p>
            <h2>Every project is guided by the same practical workflow rules.</h2>
            <ul className="chip-list">
              {serviceStandards.map((serviceStandard) => (
                <li key={serviceStandard}>{serviceStandard}</li>
              ))}
            </ul>
          </div>

          <figure className="visual-frame visual-frame--tall">
            <Image
              src="/visuals/feature-discovery.png"
              alt="Vehicle wrap discovery composition"
              fill
              sizes="(max-width: 1040px) 100vw, 42vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section two-column-section">
          <div className="surface-card emphasis-card">
            <p className="eyebrow">Who We Serve</p>
            <h2>Designed for customers who need a direct path to booking.</h2>
            <ul className="chip-list">
              {customerFocus.map((focusArea) => (
                <li key={focusArea}>{focusArea}</li>
              ))}
            </ul>
            <div className="button-row">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--tall">
            <Image
              src="/visuals/feature-preview.png"
              alt="Customer preview workflow collage"
              fill
              sizes="(max-width: 1040px) 100vw, 42vw"
            />
          </figure>
        </section>
      </main>
    </PublicSiteShell>
  );
}
