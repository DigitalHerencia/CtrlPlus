import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const contactOptions = [
  {
    title: 'Call CTRL+',
    details: '(915) 999-2191',
    hint: 'Discuss project scope, timing, and vehicle fit directly with the team.',
    link: 'tel:+19159992191',
    label: 'Call Now'
  },
  {
    title: 'Service Area',
    details: 'El Paso, Texas',
    hint: 'Local support for personal vehicles, fleet branding, and signage projects.',
    link: '/about',
    label: 'About Us'
  },
  {
    title: 'Start Online',
    details: 'Sign up in minutes',
    hint: 'Create an account to browse wraps, preview options, and reserve your schedule.',
    link: '/sign-up',
    label: 'Create Account'
  }
];

const nextSteps = [
  'Create an account to save wrap selections and continue later.',
  'Start with an upload preview or a fast template alternative.',
  'Choose valid drop-off and pick-up windows.',
  'Complete secure payment and receive confirmation.'
];

export const metadata: Metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  return (
    <PublicSiteShell activePath="/contact">
      <main className="content-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">Contact</p>
            <h1 className="content-hero__title">Contact CTRL+ to plan your next wrap project.</h1>
            <p>
              Whether you are wrapping one vehicle or a full fleet, we provide a direct path from
              preview to confirmed booking.
            </p>
            <div className="content-hero__actions">
              <Link className="button button--primary" href="/sign-up">
                Sign Up
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--feature">
            <Image
              src="/0001-7280563191036061234.png"
              alt="CTRL+ vehicle lineup in front of studio"
              fill
              priority
              sizes="(max-width: 980px) 100vw, 46vw"
            />
          </figure>
        </section>

        <section className="section-shell landing-section">
          <header className="section-head">
            <p className="eyebrow">Reach Us</p>
            <h2>Multiple ways to connect and move forward quickly.</h2>
          </header>

          <div className="contact-grid">
            {contactOptions.map((contactOption) => (
              <article className="card info-card" key={contactOption.title}>
                <h3>{contactOption.title}</h3>
                <p className="contact-value">{contactOption.details}</p>
                <p>{contactOption.hint}</p>
                <Link className="inline-link" href={contactOption.link}>
                  {contactOption.label}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell split-section">
          <div className="card split-section__content">
            <p className="eyebrow">What Happens Next</p>
            <h2>A straightforward workflow designed to turn intent into booked work.</h2>
            <ul className="split-section__list">
              {nextSteps.map((nextStep) => (
                <li key={nextStep}>{nextStep}</li>
              ))}
            </ul>
            <div className="split-section__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/features">
                View Features
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--tall">
            <Image
              src="/0001-5948623603194756924.png"
              alt="CTRL+ storefront and fleet"
              fill
              sizes="(max-width: 980px) 100vw, 44vw"
            />
          </figure>
        </section>
      </main>
    </PublicSiteShell>
  );
}
