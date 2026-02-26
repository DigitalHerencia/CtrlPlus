import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../../components/public/public-site-shell';

const contactOptions = [
  {
    title: 'Call The Team',
    details: '(915) 999-2191',
    hint: 'Discuss project scope, scheduling windows, and vehicle fit directly.',
    link: 'tel:+19159992191',
    label: 'Contact Us'
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
    details: 'Create Account',
    hint: 'Set up your account to browse services and save booking details.',
    link: '/sign-up',
    label: 'Create Account'
  }
];

const nextSteps = [
  'Create Account and save your service selections.',
  'Review preview options and choose your preferred path.',
  'Select valid drop-off and pick-up windows.',
  'Complete secure checkout and receive confirmation.'
];

const projectReadiness = [
  'Vehicle year, make, and model',
  'Service type and finish preference',
  'Preferred scheduling window',
  'Contact number for booking updates'
];

export const metadata: Metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  return (
    <PublicSiteShell activePath="/contact">
      <main className="public-main" id="main-content">
        <section className="section-shell content-hero">
          <div className="content-hero__copy">
            <p className="eyebrow">Contact</p>
            <h1 className="content-hero__title">Contact CTRL+ to plan your next wrap project.</h1>
            <p>
              Whether you are planning one vehicle or a fleet project, the team can help you move
              from service selection to confirmed booking.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/sign-in">
                Sign In
              </Link>
              <Link className="button button--ghost" href="/features">
                View Features
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--content">
            <Image
              src="/visuals/contact-service.png"
              alt="Contact and service planning collage"
              fill
              priority
              sizes="(max-width: 1040px) 100vw, 45vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section">
          <header className="section-head">
            <p className="eyebrow">Reach Us</p>
            <h2>Multiple ways to connect and keep your project moving.</h2>
          </header>

          <div className="service-grid">
            {contactOptions.map((contactOption) => (
              <article className="surface-card service-card" key={contactOption.title}>
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

        <section className="section-shell panel-section two-column-section">
          <div className="surface-card emphasis-card">
            <p className="eyebrow">What Happens Next</p>
            <h2>A straightforward workflow designed to turn interest into booked work.</h2>
            <ul className="chip-list">
              {nextSteps.map((nextStep) => (
                <li key={nextStep}>{nextStep}</li>
              ))}
            </ul>
            <div className="button-row">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/features">
                View Features
              </Link>
            </div>
          </div>

          <figure className="visual-frame visual-frame--tall">
            <Image
              src="/visuals/feature-scheduling.png"
              alt="Booking workflow visual composition"
              fill
              sizes="(max-width: 1040px) 100vw, 42vw"
            />
          </figure>
        </section>

        <section className="section-shell panel-section two-column-section">
          <div className="surface-card emphasis-card">
            <p className="eyebrow">Before You Contact Us</p>
            <h2>Gathering a few details helps us respond faster.</h2>
            <ul className="chip-list">
              {projectReadiness.map((projectItem) => (
                <li key={projectItem}>{projectItem}</li>
              ))}
            </ul>
          </div>

          <figure className="visual-frame visual-frame--tall">
            <Image
              src="/visuals/feature-discovery.png"
              alt="Vehicle service details collage"
              fill
              sizes="(max-width: 1040px) 100vw, 42vw"
            />
          </figure>
        </section>
      </main>
    </PublicSiteShell>
  );
}
