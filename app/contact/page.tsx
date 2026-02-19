import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const contactOptions = [
  {
    title: 'Call CTRL+',
    details: '(915) 999-2191',
    hint: 'Speak directly with the team about wrap scope, timeline, and fit.',
    link: 'tel:+19159992191',
    label: 'Call now'
  },
  {
    title: 'Service Area',
    details: 'El Paso, Texas',
    hint: 'Local support for personal vehicles, business fleets, and signage needs.',
    link: '/about',
    label: 'Learn about us'
  },
  {
    title: 'Start Online',
    details: 'Sign up in minutes',
    hint: 'Create an account to browse wraps, preview options, and secure your schedule.',
    link: '/sign-up',
    label: 'Create account'
  }
];

const nextSteps = [
  'Create your account to save wrap choices and continue later.',
  'Start with a preview upload or choose a fast model template.',
  'Book your preferred drop-off and pick-up windows.',
  'Pay securely and receive confirmation right away.'
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
            <h1 className="content-hero__title">Talk with CTRL+ and start your wrap project today.</h1>
            <p>
              Whether you&apos;re wrapping one car or managing fleet branding, we can help you plan
              a clear path from preview to paid booking.
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
            <h2>Multiple ways to connect and move forward fast.</h2>
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
            <h2>A straightforward funnel designed to turn intent into booked work.</h2>
            <ul className="split-section__list">
              {nextSteps.map((nextStep) => (
                <li key={nextStep}>{nextStep}</li>
              ))}
            </ul>
            <div className="split-section__actions">
              <Link className="button button--primary" href="/sign-up">
                Start Sign Up
              </Link>
              <Link className="button button--ghost" href="/features">
                See Feature Details
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
