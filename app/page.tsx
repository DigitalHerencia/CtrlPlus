import Image from 'next/image';
import Link from 'next/link';

import { PublicSiteShell } from '../components/public/public-site-shell';

const performanceStats = [
  {
    value: '10–20s',
    label: 'Upload preview target for customer-submitted vehicle photos.'
  },
  {
    value: '<1s',
    label: 'Template preview fallback for uninterrupted booking flow.'
  },
  {
    value: '1 Flow',
    label: 'Browse, preview, schedule, and pay in one clear sequence.'
  },
  {
    value: '100%',
    label: 'Server-side tenant isolation with secure checkout controls.'
  }
];

const funnelFeatures = [
  {
    title: 'Wrap Catalog Discovery',
    description:
      'Present wrap options with practical pricing, finish details, and clear install expectations.',
    cta: 'Create an account to save options and proceed to booking.'
  },
  {
    title: 'Preview Visualizer',
    description:
      'Start with upload previews, then switch to templates instantly when a faster path is needed.',
    cta: 'Sign up to launch a reliable “Try on my vehicle” flow.'
  },
  {
    title: 'Structured Scheduling',
    description:
      'Offer valid drop-off and pick-up windows based on availability and operating capacity.',
    cta: 'Sign up to streamline approvals and booking confirmation.'
  },
  {
    title: 'Invoice + Stripe Checkout',
    description:
      'Convert approved work into paid bookings through a secure, guided checkout experience.',
    cta: 'Create your account to move from inquiry to confirmed appointment.'
  }
];

const conversionFlow = [
  'Review wrap options by style, finish, and vehicle type.',
  'Preview the design on an upload or a template model.',
  'Select drop-off and pick-up windows that match live availability.',
  'Complete secure checkout and receive booking confirmation.'
];

const conversionReasons = [
  'Preview-first design helps customers decide with confidence.',
  'Fallback rendering keeps progress steady when uploads are slow.',
  'Scheduling and payment are connected to reduce drop-off risk.',
  'Primary calls-to-action stay visible through each decision step.'
];

export default function HomePage() {
  return (
    <PublicSiteShell activePath="/">
      <main className="landing-main" id="main-content">
        <section className="hero section-shell">
          <div className="hero__content">
            <p className="eyebrow">Command Your Brand · El Paso, Texas</p>
            <h1 className="hero__title">
              Vehicle wraps, tint, and signage with a clear digital booking path.
            </h1>
            <p className="hero__description">
              CTRL+ helps customers move from initial concept to confirmed install in one guided
              journey: discover, preview, schedule, and pay.
            </p>

            <ul className="hero__checklist">
              <li>Preview-first workflow with practical fallback coverage.</li>
              <li>Transparent scheduling windows and clear next steps.</li>
              <li>Secure checkout designed for fast completion.</li>
            </ul>

            <div className="hero__actions">
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

            <p className="hero__contact">
              Need guidance? Call <a href="tel:+19159992191">(915) 999-2191</a>
            </p>
          </div>

          <div className="hero__visuals">
            <figure className="media-card media-card--primary">
              <Image
                src="/0001-7280563191036061234.png"
                alt="CTRL+ wrap showcase"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 52vw"
              />
              <figcaption className="media-card__overlay">
                Wrap options shown with clear visual references.
              </figcaption>
            </figure>

            <div className="hero__visual-grid">
              <figure className="media-card media-card--secondary">
                <Image
                  src="/0001-1137653301909815874.png"
                  alt="Vehicle wrap detail shot"
                  fill
                  sizes="(max-width: 980px) 50vw, 26vw"
                />
              </figure>
              <figure className="media-card media-card--secondary">
                <Image
                  src="/0001-8036042029217284237.png"
                  alt="CTRL+ brand hero composition"
                  fill
                  sizes="(max-width: 980px) 50vw, 26vw"
                />
              </figure>
            </div>
          </div>
        </section>

        <section aria-label="Performance proof points" className="section-shell stats-section">
          <div className="stats-grid">
            {performanceStats.map((stat) => (
              <article className="card stat-card" key={stat.value}>
                <p className="stat-card__value">{stat.value}</p>
                <p className="stat-card__label">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell landing-section" id="features-overview">
          <header className="section-head">
            <p className="eyebrow">Core Platform Highlights</p>
            <h2>Each section is built to move customers toward a confirmed booking.</h2>
            <p>
              The journey stays focused from wrap discovery through checkout, with concise
              information and direct calls-to-action.
            </p>
          </header>

          <div className="funnel-grid">
            {funnelFeatures.map((funnelFeature) => (
              <article className="card feature-card" key={funnelFeature.title}>
                <h3>{funnelFeature.title}</h3>
                <p>{funnelFeature.description}</p>
                <p className="feature-card__hook">{funnelFeature.cta}</p>
                <Link className="inline-link" href="/sign-up">
                  Create Account
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell landing-section" id="how-it-works">
          <header className="section-head">
            <p className="eyebrow">Browse → Preview → Schedule → Pay</p>
            <h2>A simple customer journey built for dependable booking outcomes.</h2>
          </header>

          <ol className="flow-grid">
            {conversionFlow.map((step, index) => (
              <li className="card flow-card" key={step}>
                <span className="flow-card__number">0{index + 1}</span>
                <p>{step}</p>
                <Link className="inline-link" href="/sign-up">
                  Continue
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-shell split-section">
          <div className="card split-section__content">
            <p className="eyebrow">Why this experience works</p>
            <h2>Decision confidence is reinforced at every major step.</h2>
            <ul className="split-section__list">
              {conversionReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <div className="split-section__actions">
              <Link className="button button--primary" href="/sign-up">
                Create Account
              </Link>
              <Link className="button button--ghost" href="/about">
                About Us
              </Link>
            </div>
          </div>

          <figure className="media-card media-card--tall">
            <Image
              src="/0001-5948623603194756924.png"
              alt="CTRL+ El Paso fleet lineup"
              fill
              sizes="(max-width: 980px) 100vw, 44vw"
            />
          </figure>
        </section>

        <section className="section-shell cta-panel">
          <div>
            <p className="eyebrow">Ready to begin?</p>
            <h2>Create an account to start your first preview and booking flow.</h2>
            <p>
              Returning customers can sign in to continue active previews, bookings, and invoices.
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
