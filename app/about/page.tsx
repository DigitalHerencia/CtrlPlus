import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const operatingPrinciples = [
  {
    title: 'Visualizer First',
    description:
      'We lead with visual confidence so customers can approve designs faster and with less risk.'
  },
  {
    title: 'Low-Friction Booking',
    description:
      'Scheduling, invoicing, and payment are connected to reduce abandoned appointments.'
  },
  {
    title: 'Future-Ready Tenancy',
    description:
      'Subdomain-based tenant isolation supports secure expansion for future locations or brands.'
  }
];

const customerFocus = [
  'Drivers who want to preview a wrap before committing.',
  'Local businesses needing branded fleet visibility.',
  'Teams that need transparent scheduling and payment workflows.'
];

export const metadata: Metadata = {
  title: 'About'
};

export default function AboutPage() {
  return (
    <PublicSiteShell activePath="/about">
      <main className="content-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">About CTRL+</p>
            <h1 className="content-hero__title">Command Your Brand with premium wraps built to convert attention.</h1>
            <p>
              CTRL+ is focused on helping El Paso customers and businesses move from concept to
              confirmed wrap project in a single, polished experience.
            </p>
            <div className="content-hero__actions">
              <Link className="button button--primary" href="/sign-up">
                Sign Up to Get Started
              </Link>
              <Link className="button button--ghost" href="/features">
                View Platform Features
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--feature">
            <Image
              src="/0001-7629592165922640420.png"
              alt="CTRL+ sunset hero branding"
              fill
              priority
              sizes="(max-width: 980px) 100vw, 46vw"
            />
          </figure>
        </section>

        <section className="section-shell landing-section">
          <header className="section-head">
            <p className="eyebrow">How We Operate</p>
            <h2>Built around speed, confidence, and secure growth.</h2>
          </header>

          <div className="info-grid">
            {operatingPrinciples.map((operatingPrinciple) => (
              <article className="card info-card" key={operatingPrinciple.title}>
                <h3>{operatingPrinciple.title}</h3>
                <p>{operatingPrinciple.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell split-section">
          <div className="card split-section__content">
            <p className="eyebrow">Who We Serve</p>
            <h2>Designed for customers who want a clear path to purchase.</h2>
            <ul className="split-section__list">
              {customerFocus.map((focusArea) => (
                <li key={focusArea}>{focusArea}</li>
              ))}
            </ul>
            <div className="split-section__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/contact">
                Contact the Team
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--tall">
            <Image
              src="/0001-2762326861478041957.png"
              alt="CTRL+ night showroom scene"
              fill
              sizes="(max-width: 980px) 100vw, 44vw"
            />
          </figure>
        </section>
      </main>
    </PublicSiteShell>
  );
}
